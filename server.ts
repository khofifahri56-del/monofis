/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  BOARD_TILES,
  MASTER_QUIZZES,
  PHYSICS_MATERIALS,
  PHYSICS_CHALLENGES,
  QuizWithAnswer,
} from './src/data/monofisBoardData.js';
import type {
  GameSession,
  Group,
  AnswerRecord,
  CurrentAction,
  AuthUser,
  UserRole,
  PhysicsMaterial,
  PhysicsChallenge,
  SafeQuiz,
} from './src/types/game.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent storage paths
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'monofis_db.json');
const USERS_FILE = path.resolve(DATA_DIR, 'monofis_users.json');
const CONTENT_FILE = path.resolve(DATA_DIR, 'monofis_content.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ==========================================
// 1. AUTHENTICATION & USER STORE
// ==========================================

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface UsersPersistence {
  users: StoredUser[];
  tokens: Record<string, string>; // token -> userId
}

const usersMap = new Map<string, StoredUser>(); // id -> StoredUser
const tokensMap = new Map<string, string>(); // token -> userId

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_monofis_salt').digest('hex');
}

function saveUsersData() {
  try {
    const data: UsersPersistence = {
      users: Array.from(usersMap.values()),
      tokens: Object.fromEntries(tokensMap.entries()),
    };
    const tempFile = `${USERS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, USERS_FILE);
  } catch (err) {
    console.error('[UsersStore] Failed to save:', err);
  }
}

function loadUsersData() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const data: UsersPersistence = JSON.parse(raw);
      if (Array.isArray(data.users)) {
        for (const u of data.users) {
          if (u && u.id) usersMap.set(u.id, u);
        }
      }
      if (data.tokens && typeof data.tokens === 'object') {
        for (const [tok, uid] of Object.entries(data.tokens)) {
          tokensMap.set(tok, uid);
        }
      }
    }
  } catch (err) {
    console.error('[UsersStore] Failed to load:', err);
  }

  // Ensure default classroom accounts exist for Admin, Moderator, and User Biasa
  const defaults: Array<{ id: string; name: string; email: string; password: string; role: UserRole }> = [
    { id: 'usr_admin_1', name: 'Guru Admin', email: 'admin@monofis.id', password: 'admin123', role: 'admin' },
    { id: 'usr_mod_1', name: 'Moderator Kelas', email: 'moderator@monofis.id', password: 'mod123', role: 'moderator' },
    { id: 'usr_siswa_1', name: 'Siswa Eksperimen', email: 'siswa@monofis.id', password: 'siswa123', role: 'user' },
  ];

  let changed = false;
  for (const d of defaults) {
    const exists = Array.from(usersMap.values()).some((u) => u.email.toLowerCase() === d.email);
    if (!exists) {
      usersMap.set(d.id, {
        id: d.id,
        name: d.name,
        email: d.email,
        role: d.role,
        passwordHash: hashPassword(d.password),
        createdAt: Date.now(),
      });
      changed = true;
    }
  }
  if (changed) saveUsersData();
}

loadUsersData();

function sanitizeUser(u: StoredUser): AuthUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  };
}

interface AuthenticatedRequest extends Request {
  authUser?: AuthUser;
  authToken?: string;
}

function getAuthFromRequest(req: Request): { user: AuthUser | null; token: string | null } {
  const header = req.headers.authorization || '';
  let token: string | null = null;
  if (header.startsWith('Bearer ')) {
    token = header.slice(7).trim();
  } else if (typeof req.query.token === 'string') {
    token = req.query.token.trim();
  }

  if (!token) return { user: null, token: null };
  const userId = tokensMap.get(token);
  if (!userId) return { user: null, token: null };
  const stored = usersMap.get(userId);
  if (!stored) return { user: null, token: null };
  return { user: sanitizeUser(stored), token };
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { user, token } = getAuthFromRequest(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHENTICATED',
      message: 'Silakan login terlebih dahulu untuk mengakses fitur ini.',
    });
  }
  req.authUser = user;
  req.authToken = token || undefined;
  next();
}

function requireManagerRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.authUser) {
    return res.status(401).json({ success: false, message: 'Autentikasi diperlukan.' });
  }
  if (req.authUser.role !== 'admin' && req.authUser.role !== 'moderator') {
    return res.status(403).json({
      success: false,
      code: 'FORBIDDEN',
      message: 'Akses ditolak. Fitur pengelolaan dan penghapusan hanya untuk Admin atau Moderator.',
    });
  }
  next();
}

// ==========================================
// 2. CONTENT DATABASE (MATERIALS, QUIZZES, CHALLENGES)
// ==========================================

interface PersistedContent {
  materials: Record<string, PhysicsMaterial>;
  quizzes: Record<string, QuizWithAnswer>;
  challenges: Record<string, PhysicsChallenge>;
}

let contentStore: PersistedContent = {
  materials: { ...PHYSICS_MATERIALS },
  quizzes: { ...MASTER_QUIZZES },
  challenges: { ...PHYSICS_CHALLENGES },
};

function saveContentData() {
  try {
    const tempFile = `${CONTENT_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(contentStore, null, 2), 'utf-8');
    fs.renameSync(tempFile, CONTENT_FILE);
  } catch (err) {
    console.error('[ContentStore] Failed to save:', err);
  }
}

function loadContentData() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.materials && parsed.quizzes && parsed.challenges) {
        contentStore = parsed;
        console.log(
          `[ContentStore] Loaded ${Object.keys(contentStore.materials).length} materials, ${Object.keys(contentStore.quizzes).length} quizzes, ${Object.keys(contentStore.challenges).length} challenges`
        );
        return;
      }
    }
  } catch (err) {
    console.error('[ContentStore] Failed to load:', err);
  }
  saveContentData();
}

loadContentData();

function getSafeContentForClient(): {
  materials: Record<string, PhysicsMaterial>;
  quizzes: Record<string, SafeQuiz>;
  challenges: Record<string, PhysicsChallenge>;
} {
  const safeQuizzes: Record<string, SafeQuiz> = {};
  for (const [id, q] of Object.entries(contentStore.quizzes)) {
    safeQuizzes[id] = {
      id: q.id,
      tileIndex: q.tileIndex,
      title: q.title,
      topic: q.topic,
      question: q.question,
      options: q.options,
      points: q.points,
    };
  }
  return {
    materials: contentStore.materials,
    quizzes: safeQuizzes,
    challenges: contentStore.challenges,
  };
}

// ==========================================
// 3. GAME SESSIONS DATABASE & SSE
// ==========================================

const gamesStore = new Map<string, GameSession>();

function loadPersistedData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        for (const session of data) {
          if (session && session.id) {
            gamesStore.set(session.id, session);
          }
        }
        console.log(`[Store] Loaded ${gamesStore.size} sessions from ${DATA_FILE}`);
      }
    }
  } catch (err) {
    console.error('[Store] Failed to load persisted data:', err);
  }
}

function savePersistedData() {
  try {
    const list = Array.from(gamesStore.values());
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error('[Store] Failed to persist data to disk:', err);
  }
}

loadPersistedData();

const sseClients = new Map<string, Set<Response>>();

function registerSseClient(gameId: string, res: Response) {
  if (!sseClients.has(gameId)) {
    sseClients.set(gameId, new Set());
  }
  sseClients.get(gameId)!.add(res);

  res.on('close', () => {
    const clients = sseClients.get(gameId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        sseClients.delete(gameId);
      }
    }
  });
}

export function broadcastGameUpdate(gameId: string) {
  const session = gamesStore.get(gameId);
  if (!session) return;

  session.updatedAt = Date.now();
  savePersistedData();

  const clients = sseClients.get(gameId);
  if (clients && clients.size > 0) {
    const payload = `data: ${JSON.stringify(session)}\n\n`;
    for (const client of clients) {
      try {
        client.write(payload);
      } catch {
        // Ignore broken client pipe
      }
    }
  }
}

setInterval(() => {
  for (const clients of sseClients.values()) {
    for (const res of clients) {
      try {
        res.write(': ping\n\n');
      } catch {
        // Ignore
      }
    }
  }
}, 15000);

function generateGameCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  let prefix = '';
  for (let i = 0; i < 3; i++) {
    prefix += letters[Math.floor(Math.random() * letters.length)];
  }
  let suffix = '';
  for (let i = 0; i < 3; i++) {
    suffix += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return `${prefix}-${suffix}`;
}

// ==========================================
// 4. API ROUTES
// ==========================================

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: Date.now(), activeGames: gamesStore.size });
});

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = String(password || '');

  if (cleanName.length < 2) {
    return res.status(400).json({ success: false, message: 'Nama lengkap minimal 2 karakter.' });
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return res.status(400).json({ success: false, message: 'Masukkan alamat email yang valid.' });
  }
  if (cleanPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'Kata sandi minimal 4 karakter.' });
  }

  const duplicate = Array.from(usersMap.values()).some((u) => u.email.toLowerCase() === cleanEmail);
  if (duplicate) {
    return res.status(400).json({ success: false, message: 'Email ini sudah terdaftar. Silakan login.' });
  }

  const assignedRole: UserRole = role === 'admin' || role === 'moderator' ? role : 'user';
  const userId = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const newUser: StoredUser = {
    id: userId,
    name: cleanName,
    email: cleanEmail,
    role: assignedRole,
    passwordHash: hashPassword(cleanPassword),
    createdAt: Date.now(),
  };

  usersMap.set(userId, newUser);
  const token = crypto.randomBytes(24).toString('hex');
  tokensMap.set(token, userId);
  saveUsersData();

  res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(newUser),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = String(password || '');

  const user = Array.from(usersMap.values()).find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user || user.passwordHash !== hashPassword(cleanPassword)) {
    return res.status(401).json({
      success: false,
      message: 'Email atau kata sandi salah.',
    });
  }

  const token = crypto.randomBytes(24).toString('hex');
  tokensMap.set(token, user.id);
  saveUsersData();

  res.json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, user: req.authUser });
});

app.post('/api/auth/logout', (req, res) => {
  const { token } = getAuthFromRequest(req);
  if (token) {
    tokensMap.delete(token);
    saveUsersData();
  }
  res.json({ success: true });
});

// --- CONTENT MANAGEMENT ROUTES (MATERIALS, QUIZZES, CHALLENGES) ---
app.get('/api/content', requireAuth, (_req, res) => {
  res.json({ success: true, content: getSafeContentForClient() });
});

app.post('/api/content/materials', requireAuth, requireManagerRole, (req: AuthenticatedRequest, res) => {
  const { title, topic, summary, keyPoints, formula, funFact, application, tileIndex } = req.body;
  if (!title?.trim() || !summary?.trim()) {
    return res.status(400).json({ success: false, message: 'Judul dan ringkasan materi wajib diisi.' });
  }

  const id = 'mat_custom_' + Date.now();
  const newMaterial: PhysicsMaterial = {
    id,
    tileIndex: typeof tileIndex === 'number' ? tileIndex : 1,
    title: title.trim(),
    topic: (topic || 'Fisika Cahaya & Optik').trim(),
    summary: summary.trim(),
    keyPoints: Array.isArray(keyPoints) && keyPoints.length > 0 ? keyPoints : [summary.trim()],
    formula: formula?.trim() || undefined,
    funFact: funFact?.trim() || undefined,
    application: (application || 'Penerapan dalam teknologi optik sehari-hari.').trim(),
  };

  contentStore.materials[id] = newMaterial;
  saveContentData();

  res.status(201).json({
    success: true,
    material: newMaterial,
    content: getSafeContentForClient(),
  });
});

app.delete('/api/content/materials/:id', requireAuth, requireManagerRole, (req, res) => {
  const { id } = req.params;
  if (!contentStore.materials[id]) {
    return res.status(404).json({ success: false, message: 'Materi tidak ditemukan.' });
  }
  const deletedTitle = contentStore.materials[id].title;
  delete contentStore.materials[id];
  saveContentData();

  res.json({
    success: true,
    message: `Materi "${deletedTitle}" berhasil dihapus.`,
    content: getSafeContentForClient(),
  });
});

app.delete('/api/content/quizzes/:id', requireAuth, requireManagerRole, (req, res) => {
  const { id } = req.params;
  if (!contentStore.quizzes[id]) {
    return res.status(404).json({ success: false, message: 'Soal kuis tidak ditemukan.' });
  }
  const deletedTitle = contentStore.quizzes[id].title;
  delete contentStore.quizzes[id];
  saveContentData();

  res.json({
    success: true,
    message: `Kuis "${deletedTitle}" berhasil dihapus.`,
    content: getSafeContentForClient(),
  });
});

app.delete('/api/content/challenges/:id', requireAuth, requireManagerRole, (req, res) => {
  const { id } = req.params;
  if (!contentStore.challenges[id]) {
    return res.status(404).json({ success: false, message: 'Tantangan tidak ditemukan.' });
  }
  const deletedTitle = contentStore.challenges[id].title;
  delete contentStore.challenges[id];
  saveContentData();

  res.json({
    success: true,
    message: `Tantangan "${deletedTitle}" berhasil dihapus.`,
    content: getSafeContentForClient(),
  });
});

app.post('/api/content/restore-defaults', requireAuth, requireManagerRole, (_req, res) => {
  contentStore = {
    materials: { ...PHYSICS_MATERIALS },
    quizzes: { ...MASTER_QUIZZES },
    challenges: { ...PHYSICS_CHALLENGES },
  };
  saveContentData();
  res.json({
    success: true,
    message: 'Seluruh materi dan bank soal bawaan berhasil dipulihkan.',
    content: getSafeContentForClient(),
  });
});

// --- GAME SESSION ROUTES ---
app.get('/api/games', requireAuth, (_req, res) => {
  const list = Array.from(gamesStore.values()).sort((a, b) => b.createdAt - a.createdAt);
  res.json({ success: true, games: list });
});

app.post('/api/games', requireAuth, (req: AuthenticatedRequest, res) => {
  const { gameName, teacherName } = req.body;
  const gameId = 'game_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const gameCode = generateGameCode();

  const newGame: GameSession = {
    id: gameId,
    gameCode,
    gameName: gameName?.trim() || 'Sesi Fisika Cahaya & Alat Optik',
    teacherName: teacherName?.trim() || req.authUser?.name || 'Guru Fisika',
    createdByUserId: req.authUser?.id,
    status: 'waiting',
    currentTurnGroupId: null,
    currentTurnIndex: 0,
    turnNumber: 1,
    currentAction: null,
    groups: {},
    groupOrder: [],
    answers: {},
    events: [
      {
        id: 'evt_' + Date.now(),
        groupId: 'system',
        groupName: 'Sistem MONOFIS',
        eventType: 'game_start',
        description: `Sesi permainan "${gameName || 'Fisika Cahaya'}" berhasil dibuat dengan Kode: ${gameCode}`,
        timestamp: Date.now(),
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  gamesStore.set(gameId, newGame);
  savePersistedData();

  res.status(201).json({ success: true, game: newGame });
});

app.get('/api/games/code/:code', requireAuth, (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const found = Array.from(gamesStore.values()).find((g) => g.gameCode === code);
  if (!found) {
    return res.status(404).json({ success: false, message: `Permainan dengan kode "${code}" tidak ditemukan.` });
  }
  res.json({ success: true, game: found });
});

app.get('/api/games/:gameId', requireAuth, (req, res) => {
  const session = gamesStore.get(req.params.gameId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi permainan tidak ditemukan.' });
  }
  res.json({ success: true, game: session });
});

app.delete('/api/games/:gameId', requireAuth, requireManagerRole, (req, res) => {
  const { gameId } = req.params;
  const session = gamesStore.get(gameId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi permainan tidak ditemukan.' });
  }
  const deletedName = session.gameName;
  gamesStore.delete(gameId);
  savePersistedData();

  res.json({
    success: true,
    message: `Sesi "${deletedName}" berhasil dihapus.`,
  });
});

// Real-Time SSE Stream for a Game
app.get('/api/games/:gameId/stream', (req, res) => {
  const { gameId } = req.params;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Game session not found.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  res.write(`data: ${JSON.stringify(session)}\n\n`);
  registerSseClient(gameId, res);
});

// Register Group to a Game
app.post('/api/games/:gameId/groups', requireAuth, (req: AuthenticatedRequest, res) => {
  const { gameId } = req.params;
  const { name, color, avatar } = req.body;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi permainan tidak ditemukan.' });
  }

  const cleanName = (name || '').trim();
  if (!cleanName || cleanName.length < 2) {
    return res.status(400).json({ success: false, message: 'Nama kelompok minimal 2 karakter.' });
  }

  const isDuplicate = Object.values(session.groups).some(
    (g) => g.name.toLowerCase() === cleanName.toLowerCase()
  );
  if (isDuplicate) {
    return res.status(400).json({
      success: false,
      message: `Kelompok dengan nama "${cleanName}" sudah terdaftar dalam sesi ini.`,
    });
  }

  const groupId = 'grp_' + Math.random().toString(36).substring(2, 8);
  const newGroup: Group = {
    id: groupId,
    name: cleanName,
    color: color || '#3b82f6',
    avatar: avatar || 'prism',
    pionPosition: 0,
    score: 0,
    quizPoints: 0,
    bonusPoints: 0,
    challengePoints: 0,
    correctAnswersCount: 0,
    wrongAnswersCount: 0,
    joinedAt: Date.now(),
    lastActiveAt: Date.now(),
    status: 'active',
    ownerUserId: req.authUser?.id,
  };

  session.groups[groupId] = newGroup;
  session.groupOrder.push(groupId);

  session.events.unshift({
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
    groupId,
    groupName: cleanName,
    eventType: 'joined',
    description: `Kelompok "${cleanName}" bergabung ke dalam permainan MONOFIS.`,
    timestamp: Date.now(),
  });

  broadcastGameUpdate(gameId);
  res.status(201).json({ success: true, group: newGroup, game: session });
});

// Delete a Group from a Game (Admin / Moderator)
app.delete('/api/games/:gameId/groups/:groupId', requireAuth, requireManagerRole, (req, res) => {
  const { gameId, groupId } = req.params;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi permainan tidak ditemukan.' });
  }

  const group = session.groups[groupId];
  if (!group) {
    return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
  }

  const deletedName = group.name;
  delete session.groups[groupId];
  session.groupOrder = session.groupOrder.filter((id) => id !== groupId);

  // Reconcile turn index safely if active group was removed
  if (session.groupOrder.length === 0) {
    session.currentTurnGroupId = null;
    session.currentTurnIndex = 0;
    session.currentAction = null;
  } else {
    if (session.currentTurnIndex >= session.groupOrder.length) {
      session.currentTurnIndex = 0;
    }
    if (session.currentTurnGroupId === groupId) {
      const nextGrpId = session.groupOrder[session.currentTurnIndex];
      session.currentTurnGroupId = nextGrpId;
      if (session.status === 'playing') {
        session.currentAction = {
          groupId: nextGrpId,
          type: 'roll_dice',
          tileIndex: session.groups[nextGrpId].pionPosition,
        };
      }
    }
  }

  session.events.unshift({
    id: 'evt_' + Date.now(),
    groupId: 'system',
    groupName: 'Pengelola Sesi',
    eventType: 'group_removed',
    description: `Kelompok "${deletedName}" dihapus dari sesi permainan.`,
    timestamp: Date.now(),
  });

  broadcastGameUpdate(gameId);
  res.json({
    success: true,
    message: `Kelompok "${deletedName}" berhasil dihapus.`,
    game: session,
  });
});

// Start Game
app.post('/api/games/:gameId/start', requireAuth, (req, res) => {
  const { gameId } = req.params;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi permainan tidak ditemukan.' });
  }

  if (session.groupOrder.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Belum ada kelompok yang bergabung! Minimal 1 kelompok untuk memulai.',
    });
  }

  session.status = 'playing';
  session.currentTurnIndex = 0;
  const firstGroupId = session.groupOrder[0];
  session.currentTurnGroupId = firstGroupId;
  session.currentAction = {
    groupId: firstGroupId,
    type: 'roll_dice',
    tileIndex: session.groups[firstGroupId].pionPosition,
  };

  session.events.unshift({
    id: 'evt_' + Date.now(),
    groupId: 'system',
    groupName: 'Guru Fisika',
    eventType: 'game_start',
    description: `Permainan dimulai! Giliran pertama: ${session.groups[firstGroupId].name}`,
    timestamp: Date.now(),
  });

  broadcastGameUpdate(gameId);
  res.json({ success: true, game: session });
});

// Pause / Resume Game
app.post('/api/games/:gameId/pause', requireAuth, (req: AuthenticatedRequest, res) => {
  const { gameId } = req.params;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }

  const isAllowed =
    req.authUser?.role === 'admin' ||
    req.authUser?.role === 'moderator' ||
    session.createdByUserId === req.authUser?.id;

  if (!isAllowed) {
    return res.status(403).json({
      success: false,
      message: 'Hanya Admin, Moderator, atau pembuat sesi yang dapat menjeda permainan.',
    });
  }

  if (session.status === 'playing') {
    session.status = 'paused';
    session.events.unshift({
      id: 'evt_' + Date.now(),
      groupId: 'system',
      groupName: 'Guru Fisika',
      eventType: 'game_paused',
      description: 'Permainan dijeda oleh Pengelola.',
      timestamp: Date.now(),
    });
  } else if (session.status === 'paused') {
    session.status = 'playing';
    session.events.unshift({
      id: 'evt_' + Date.now(),
      groupId: 'system',
      groupName: 'Guru Fisika',
      eventType: 'game_resumed',
      description: 'Permainan dilanjutkan kembali.',
      timestamp: Date.now(),
    });
  }

  broadcastGameUpdate(gameId);
  res.json({ success: true, game: session });
});

// Roll Dice (Available to ALL authenticated users: admin, moderator, user)
app.post('/api/games/:gameId/roll-dice', requireAuth, (req: AuthenticatedRequest, res) => {
  const { gameId } = req.params;
  const requestedGroupId = req.body?.groupId;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }

  if (session.status !== 'playing') {
    return res.status(400).json({ success: false, message: 'Permainan sedang dijeda atau belum dimulai.' });
  }

  // Use the active turn group when user/moderator/admin rolls
  const targetGroupId = session.currentTurnGroupId || requestedGroupId;
  if (!targetGroupId || !session.groups[targetGroupId]) {
    return res.status(404).json({ success: false, message: 'Kelompok giliran tidak ditemukan.' });
  }

  if (session.currentAction && session.currentAction.type !== 'roll_dice') {
    return res.status(400).json({
      success: false,
      message: 'Dadu sudah dilempar pada giliran ini. Selesaikan aktivitas petak terlebih dahulu.',
    });
  }

  const group = session.groups[targetGroupId];

  // Random 1-6
  const diceValue = Math.floor(Math.random() * 6) + 1;
  const oldPos = group.pionPosition;
  const newPos = (oldPos + diceValue) % 24;

  // Save new pawn position permanently
  group.pionPosition = newPos;
  group.lastActiveAt = Date.now();

  const tile = BOARD_TILES[newPos];

  let nextActionType: CurrentAction['type'] = 'waiting_next';
  let bonusClaimed = false;
  let answered = false;

  if (tile.type === 'quiz') {
    nextActionType = 'quiz';
  } else if (tile.type === 'material') {
    nextActionType = 'material';
  } else if (tile.type === 'challenge') {
    nextActionType = 'challenge';
  } else if (tile.type === 'bonus') {
    nextActionType = 'bonus';
    group.score += 20;
    group.bonusPoints += 20;
    bonusClaimed = true;
    answered = true;

    session.events.unshift({
      id: 'evt_' + Date.now() + '_bonus',
      groupId: targetGroupId,
      groupName: group.name,
      eventType: 'bonus_claimed',
      pointsAwarded: 20,
      description: `🎉 BONUS OPTIK! ${group.name} mendarat di Kotak Bonus dan memperoleh +20 POIN!`,
      timestamp: Date.now(),
    });
  } else if (tile.type === 'start') {
    nextActionType = 'waiting_next';
    answered = true; // Start tile has no modal task, ready to proceed
  }

  session.currentAction = {
    groupId: targetGroupId,
    type: nextActionType,
    tileIndex: newPos,
    contentId: tile.contentId,
    diceValue,
    bonusClaimed,
    answered,
  };

  session.events.unshift({
    id: 'evt_' + Date.now(),
    groupId: targetGroupId,
    groupName: group.name,
    eventType: 'move',
    fromPosition: oldPos,
    toPosition: newPos,
    description: `🎲 ${group.name} (${req.authUser?.name || 'Pemain'}) melempar dadu: [${diceValue}]! Pion bergerak dari #${oldPos} ke Kotak #${newPos} (${tile.title}).`,
    timestamp: Date.now(),
  });

  broadcastGameUpdate(gameId);

  res.json({
    success: true,
    diceValue,
    fromPosition: oldPos,
    newPosition: newPos,
    tile,
    game: session,
  });
});

// Submit Quiz Answer
app.post('/api/games/:gameId/submit-answer', requireAuth, (req, res) => {
  const { gameId } = req.params;
  const { groupId, questionId, selectedIndex } = req.body;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }

  const activeGroupId = session.currentTurnGroupId || groupId;
  if (!activeGroupId || !session.groups[activeGroupId]) {
    return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
  }

  if (!session.currentAction || session.currentAction.type !== 'quiz' || session.currentAction.answered) {
    return res.status(400).json({ success: false, message: 'Pertanyaan ini sudah dijawab atau tidak aktif.' });
  }

  const masterQuiz = contentStore.quizzes[questionId] || MASTER_QUIZZES[questionId];
  if (!masterQuiz) {
    // If deleted from bank, still allow closing turn cleanly
    session.currentAction.answered = true;
    broadcastGameUpdate(gameId);
    return res.json({
      success: true,
      isCorrect: false,
      pointsAwarded: 0,
      explanation: 'Soal kuis pada petak ini telah dihapus oleh pengelola.',
      correctIndex: 0,
      game: session,
    });
  }

  const group = session.groups[activeGroupId];
  const isCorrect = selectedIndex === masterQuiz.correctIndex;
  const pointsAwarded = isCorrect ? 10 : 0;

  if (isCorrect) {
    group.score += pointsAwarded;
    group.quizPoints += pointsAwarded;
    group.correctAnswersCount += 1;
  } else {
    group.wrongAnswersCount += 1;
  }
  group.lastActiveAt = Date.now();

  const answerRecord: AnswerRecord = {
    id: 'ans_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    groupId: activeGroupId,
    groupName: group.name,
    questionId,
    questionTitle: masterQuiz.title,
    selectedAnswer: masterQuiz.options[selectedIndex] || 'Tidak dijawab',
    selectedIndex,
    isCorrect,
    pointsAwarded,
    answeredAt: Date.now(),
  };

  session.answers[answerRecord.id] = answerRecord;
  session.currentAction.answered = true;

  session.events.unshift({
    id: 'evt_' + Date.now(),
    groupId: activeGroupId,
    groupName: group.name,
    eventType: 'quiz_answered',
    pointsAwarded,
    description: isCorrect
      ? `✨ ${group.name} MENJAWAB BENAR pada ${masterQuiz.title}! (+${pointsAwarded} Poin)`
      : `❌ ${group.name} menjawab salah pada ${masterQuiz.title}. (+0 Poin)`,
    timestamp: Date.now(),
  });

  broadcastGameUpdate(gameId);

  res.json({
    success: true,
    isCorrect,
    pointsAwarded,
    explanation: masterQuiz.explanation,
    correctIndex: masterQuiz.correctIndex,
    game: session,
  });
});

// Complete Challenge
app.post('/api/games/:gameId/complete-challenge', requireAuth, (req, res) => {
  const { gameId } = req.params;
  const { groupId, challengeId, selectedOptionIndex } = req.body;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }

  const activeGroupId = session.currentTurnGroupId || groupId;
  if (!activeGroupId || !session.groups[activeGroupId]) {
    return res.status(404).json({ success: false, message: 'Kelompok tidak ditemukan.' });
  }

  if (!session.currentAction || session.currentAction.type !== 'challenge' || session.currentAction.answered) {
    return res.status(400).json({ success: false, message: 'Tantangan ini sudah diselesaikan.' });
  }

  const challenge = contentStore.challenges[challengeId] || PHYSICS_CHALLENGES[challengeId];
  if (!challenge) {
    session.currentAction.answered = true;
    broadcastGameUpdate(gameId);
    return res.json({
      success: true,
      isCorrect: false,
      pointsAwarded: 0,
      explanation: 'Tantangan pada petak ini telah dihapus oleh pengelola.',
      correctOptionIndex: 0,
      game: session,
    });
  }

  const group = session.groups[activeGroupId];
  const isCorrect = selectedOptionIndex === challenge.correctOptionIndex;
  const pointsAwarded = isCorrect ? challenge.rewardPoints : 0;

  if (isCorrect) {
    group.score += pointsAwarded;
    group.challengePoints += pointsAwarded;
    group.correctAnswersCount += 1;
  } else {
    group.wrongAnswersCount += 1;
  }
  group.lastActiveAt = Date.now();
  session.currentAction.answered = true;

  session.events.unshift({
    id: 'evt_' + Date.now(),
    groupId: activeGroupId,
    groupName: group.name,
    eventType: 'challenge_completed',
    pointsAwarded,
    description: isCorrect
      ? `🏆 ${group.name} Berhasil menyelesaikan ${challenge.title}! (+${pointsAwarded} Poin)`
      : `⚠️ ${group.name} belum tepat menyelesaikan ${challenge.title}. (+0 Poin)`,
    timestamp: Date.now(),
  });

  broadcastGameUpdate(gameId);

  res.json({
    success: true,
    isCorrect,
    pointsAwarded,
    explanation: challenge.explanation,
    correctOptionIndex: challenge.correctOptionIndex,
    game: session,
  });
});

// Read Material complete (Preserves pawn position, marks material as read)
app.post('/api/games/:gameId/read-material', requireAuth, (req, res) => {
  const { gameId } = req.params;
  const { groupId, materialId } = req.body;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }

  const activeGroupId = session.currentTurnGroupId || groupId;
  const group = activeGroupId ? session.groups[activeGroupId] : undefined;

  if (session.currentAction && session.currentAction.type === 'material') {
    if (!session.currentAction.answered && group) {
      const matTitle = contentStore.materials[materialId]?.title || `Kotak #${session.currentAction.tileIndex}`;
      session.events.unshift({
        id: 'evt_' + Date.now(),
        groupId: activeGroupId,
        groupName: group.name,
        eventType: 'material_read',
        toPosition: group.pionPosition,
        description: `📖 ${group.name} selesai membaca materi "${matTitle}" (Pion tetap di Kotak #${group.pionPosition}).`,
        timestamp: Date.now(),
      });
    }
    session.currentAction.answered = true;
  }

  broadcastGameUpdate(gameId);
  res.json({ success: true, game: session });
});

// Advance to Next Turn (Idempotent using expectedTurnNumber, preserves all pawn positions!)
app.post('/api/games/:gameId/next-turn', requireAuth, (req, res) => {
  const { gameId } = req.params;
  const { expectedTurnNumber } = req.body || {};
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }

  if (session.status !== 'playing') {
    return res.status(400).json({ success: false, message: 'Permainan belum berjalan.' });
  }

  // Idempotency guard: prevent accidental double-advance of turns
  if (typeof expectedTurnNumber === 'number' && expectedTurnNumber !== session.turnNumber) {
    return res.json({ success: true, alreadyAdvanced: true, game: session });
  }

  const count = session.groupOrder.length;
  if (count === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada kelompok.' });
  }

  const nextIndex = (session.currentTurnIndex + 1) % count;
  session.currentTurnIndex = nextIndex;
  const nextGroupId = session.groupOrder[nextIndex];
  session.currentTurnGroupId = nextGroupId;
  session.turnNumber += 1;

  // Notice: next group starts rolling from its preserved pionPosition!
  session.currentAction = {
    groupId: nextGroupId,
    type: 'roll_dice',
    tileIndex: session.groups[nextGroupId].pionPosition,
  };

  broadcastGameUpdate(gameId);
  res.json({ success: true, game: session });
});

// End Game
app.post('/api/games/:gameId/end', requireAuth, (req: AuthenticatedRequest, res) => {
  const { gameId } = req.params;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }

  const isAllowed =
    req.authUser?.role === 'admin' ||
    req.authUser?.role === 'moderator' ||
    session.createdByUserId === req.authUser?.id;

  if (!isAllowed) {
    return res.status(403).json({
      success: false,
      message: 'Hanya Admin, Moderator, atau pembuat sesi yang dapat mengakhiri permainan.',
    });
  }

  session.status = 'finished';
  session.finishedAt = Date.now();

  let topScore = -1;
  let topGroupId: string | null = null;
  for (const group of Object.values(session.groups)) {
    if (group.score > topScore) {
      topScore = group.score;
      topGroupId = group.id;
    }
  }
  session.winnerGroupId = topGroupId;

  session.events.unshift({
    id: 'evt_' + Date.now(),
    groupId: 'system',
    groupName: 'Guru Fisika',
    eventType: 'game_ended',
    description: `🏁 Permainan telah selesai! Pemenang: ${topGroupId ? session.groups[topGroupId]?.name : 'Belum ada'} dengan ${topScore} Poin!`,
    timestamp: Date.now(),
  });

  broadcastGameUpdate(gameId);
  res.json({ success: true, game: session });
});

// Reset Game
app.post('/api/games/:gameId/reset', requireAuth, (req: AuthenticatedRequest, res) => {
  const { gameId } = req.params;
  const session = gamesStore.get(gameId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }

  const isAllowed =
    req.authUser?.role === 'admin' ||
    req.authUser?.role === 'moderator' ||
    session.createdByUserId === req.authUser?.id;

  if (!isAllowed) {
    return res.status(403).json({
      success: false,
      message: 'Hanya Admin, Moderator, atau pembuat sesi yang dapat mereset permainan.',
    });
  }

  session.status = 'waiting';
  session.currentTurnIndex = 0;
  session.turnNumber = 1;
  session.currentTurnGroupId = session.groupOrder[0] || null;
  session.currentAction = null;
  session.answers = {};
  session.winnerGroupId = null;
  delete session.finishedAt;

  for (const group of Object.values(session.groups)) {
    group.pionPosition = 0;
    group.score = 0;
    group.quizPoints = 0;
    group.bonusPoints = 0;
    group.challengePoints = 0;
    group.correctAnswersCount = 0;
    group.wrongAnswersCount = 0;
  }

  session.events.unshift({
    id: 'evt_' + Date.now(),
    groupId: 'system',
    groupName: 'Guru Fisika',
    eventType: 'game_start',
    description: 'Sesi permainan di-reset ke kondisi awal.',
    timestamp: Date.now(),
  });

  broadcastGameUpdate(gameId);
  res.json({ success: true, game: session });
});

// Vite middleware integration for Full-Stack dev mode
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev] Vite dev middlewares mounted');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[Prod] Serving static build from dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MONOFIS Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[MONOFIS Server] Failed to start:', err);
});
