/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GameSession,
  ConnectionState,
  Group,
  AuthUser,
  UserRole,
  GameContentStore,
  BoardTile,
  PhysicsMaterial,
} from '../types/game';

const LOCAL_STORAGE_KEY = 'monofis_session_cache_v1';
const AUTH_TOKEN_KEY = 'monofis_auth_token_v1';

export interface LocalSessionCache {
  gameId: string;
  gameCode: string;
  groupId: string | null;
  role: 'teacher' | 'student';
}

class ApiClient {
  private eventSource: EventSource | null = null;
  private currentSession: GameSession | null = null;
  private connectionState: ConnectionState = 'offline';
  private statusListeners = new Set<(status: ConnectionState) => void>();
  private sessionListeners = new Set<(session: GameSession) => void>();
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setConnectionState('reconnecting');
        if (this.currentSession?.id) {
          this.subscribeToGame(this.currentSession.id);
        }
      });
      window.addEventListener('offline', () => {
        this.setConnectionState('offline');
      });
    }
  }

  public getAuthToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public setAuthToken(token: string | null) {
    try {
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } catch (e) {
      console.warn('LocalStorage auth token warning:', e);
    }
  }

  private getHeaders(hasBody = true): Record<string, string> {
    const headers: Record<string, string> = {};
    if (hasBody) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  public getCache(): LocalSessionCache | null {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public setCache(cache: LocalSessionCache | null) {
    try {
      if (cache) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cache));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('LocalStorage access warning:', e);
    }
  }

  public onStatusChange(callback: (status: ConnectionState) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.connectionState);
    return () => this.statusListeners.delete(callback);
  }

  public onSessionUpdate(callback: (session: GameSession) => void): () => void {
    this.sessionListeners.add(callback);
    if (this.currentSession) {
      callback(this.currentSession);
    }
    return () => this.sessionListeners.delete(callback);
  }

  private setConnectionState(state: ConnectionState) {
    this.connectionState = state;
    for (const listener of this.statusListeners) {
      listener(state);
    }
  }

  private notifySession(session: GameSession) {
    this.currentSession = session;
    for (const listener of this.sessionListeners) {
      listener(session);
    }
  }

  // Subscribe to real-time Server-Sent Events (SSE)
  public subscribeToGame(gameId: string) {
    this.disconnect();
    this.setConnectionState('reconnecting');

    const streamUrl = `/api/games/${encodeURIComponent(gameId)}/stream`;
    this.eventSource = new EventSource(streamUrl);

    this.eventSource.onopen = () => {
      this.setConnectionState('connected');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const session: GameSession = JSON.parse(event.data);
        this.notifySession(session);
        this.setConnectionState('saved');
        setTimeout(() => {
          if (this.connectionState === 'saved') {
            this.setConnectionState('connected');
          }
        }, 1200);
      } catch (err) {
        console.error('Failed to parse SSE payload:', err);
      }
    };

    this.eventSource.onerror = () => {
      this.setConnectionState('reconnecting');
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      this.reconnectTimeout = setTimeout(() => {
        if (navigator.onLine) {
          this.subscribeToGame(gameId);
        } else {
          this.setConnectionState('offline');
        }
      }, 3000);
    };
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // --- AUTH METHODS ---
  public async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal login.');
    }
    this.setAuthToken(data.token);
    return { user: data.user, token: data.token };
  }

  public async register(
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ user: AuthUser; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal mendaftar akun.');
    }
    this.setAuthToken(data.token);
    return { user: data.user, token: data.token };
  }

  public async getCurrentUser(): Promise<AuthUser | null> {
    const token = this.getAuthToken();
    if (!token) return null;
    const res = await fetch('/api/auth/me', {
      headers: this.getHeaders(false),
    });
    if (!res.ok) {
      this.setAuthToken(null);
      return null;
    }
    const data = await res.json();
    return data.success ? data.user : null;
  }

  public async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: this.getHeaders(false),
      });
    } finally {
      this.setAuthToken(null);
      this.setCache(null);
      this.disconnect();
    }
  }

  // --- CONTENT MANAGEMENT METHODS ---
  public async getContent(): Promise<GameContentStore> {
    const res = await fetch('/api/content', {
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal memuat materi & bank soal.');
    }
    return data.content;
  }

  public async addMaterial(payload: {
    title: string;
    topic: string;
    summary: string;
    keyPoints: string[];
    formula?: string;
    funFact?: string;
    application: string;
    tileIndex?: number;
  }): Promise<{ material: PhysicsMaterial; content: GameContentStore }> {
    const res = await fetch('/api/content/materials', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menambahkan materi.');
    }
    return data;
  }

  public async deleteMaterial(materialId: string): Promise<{ message: string; content: GameContentStore }> {
    const res = await fetch(`/api/content/materials/${encodeURIComponent(materialId)}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menghapus materi.');
    }
    return data;
  }

  public async deleteQuiz(quizId: string): Promise<{ message: string; content: GameContentStore }> {
    const res = await fetch(`/api/content/quizzes/${encodeURIComponent(quizId)}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menghapus soal kuis.');
    }
    return data;
  }

  public async deleteChallenge(challengeId: string): Promise<{ message: string; content: GameContentStore }> {
    const res = await fetch(`/api/content/challenges/${encodeURIComponent(challengeId)}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menghapus tantangan.');
    }
    return data;
  }

  public async restoreDefaultContent(): Promise<{ message: string; content: GameContentStore }> {
    const res = await fetch('/api/content/restore-defaults', {
      method: 'POST',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal memulihkan materi bawaan.');
    }
    return data;
  }

  // --- GAME SESSION METHODS ---
  public async createGame(gameName: string, teacherName: string, roleMode: 'teacher' | 'student' = 'teacher'): Promise<GameSession> {
    this.setConnectionState('saving');
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ gameName, teacherName }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal membuat sesi permainan.');
    }
    this.notifySession(data.game);
    this.setCache({
      gameId: data.game.id,
      gameCode: data.game.gameCode,
      groupId: null,
      role: roleMode,
    });
    this.subscribeToGame(data.game.id);
    return data.game;
  }

  public async getGameByCode(code: string): Promise<GameSession> {
    const res = await fetch(`/api/games/code/${encodeURIComponent(code)}`, {
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Kode permainan tidak ditemukan.');
    }
    return data.game;
  }

  public async getGame(gameId: string): Promise<GameSession> {
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}`, {
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Sesi permainan tidak ditemukan.');
    }
    return data.game;
  }

  public async listGames(): Promise<GameSession[]> {
    const res = await fetch('/api/games', {
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal memuat daftar permainan.');
    }
    return data.games;
  }

  public async deleteGame(gameId: string): Promise<{ message: string }> {
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menghapus sesi permainan.');
    }
    return data;
  }

  public async registerGroup(
    gameId: string,
    name: string,
    color: string,
    avatar: string,
    saveStudentCache = true
  ): Promise<{ group: Group; game: GameSession }> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/groups`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ name, color, avatar }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal mendaftarkan kelompok.');
    }
    this.notifySession(data.game);
    if (saveStudentCache) {
      this.setCache({
        gameId,
        gameCode: data.game.gameCode,
        groupId: data.group.id,
        role: 'student',
      });
    }
    this.subscribeToGame(gameId);
    return data;
  }

  public async deleteGroup(gameId: string, groupId: string): Promise<{ message: string; game: GameSession }> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/groups/${encodeURIComponent(groupId)}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menghapus kelompok.');
    }
    this.notifySession(data.game);
    return data;
  }

  public async startGame(gameId: string): Promise<GameSession> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/start`, {
      method: 'POST',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal memulai permainan.');
    }
    return data.game;
  }

  public async togglePauseGame(gameId: string): Promise<GameSession> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/pause`, {
      method: 'POST',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal mengubah status permainan.');
    }
    return data.game;
  }

  public async rollDice(
    gameId: string,
    groupId: string
  ): Promise<{ diceValue: number; fromPosition: number; newPosition: number; tile: BoardTile; game: GameSession }> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/roll-dice`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ groupId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal melempar dadu.');
    }
    return data;
  }

  public async submitQuizAnswer(
    gameId: string,
    groupId: string,
    questionId: string,
    selectedIndex: number
  ): Promise<{ isCorrect: boolean; pointsAwarded: number; explanation: string; correctIndex: number; game: GameSession }> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/submit-answer`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ groupId, questionId, selectedIndex }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal mengirimkan jawaban.');
    }
    return data;
  }

  public async completeChallenge(
    gameId: string,
    groupId: string,
    challengeId: string,
    selectedOptionIndex: number
  ): Promise<{ isCorrect: boolean; pointsAwarded: number; explanation: string; correctOptionIndex: number; game: GameSession }> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/complete-challenge`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ groupId, challengeId, selectedOptionIndex }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menyelesaikan tantangan.');
    }
    return data;
  }

  public async readMaterial(gameId: string, groupId: string, materialId: string): Promise<GameSession> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/read-material`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ groupId, materialId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal memperbarui progres materi.');
    }
    return data.game;
  }

  public async nextTurn(gameId: string, groupId?: string, expectedTurnNumber?: number): Promise<GameSession> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/next-turn`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ groupId, expectedTurnNumber }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal berpindah ke giliran berikutnya.');
    }
    return data.game;
  }

  public async endGame(gameId: string): Promise<GameSession> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/end`, {
      method: 'POST',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal mengakhiri permainan.');
    }
    return data.game;
  }

  public async resetGame(gameId: string): Promise<GameSession> {
    this.setConnectionState('saving');
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}/reset`, {
      method: 'POST',
      headers: this.getHeaders(false),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal mereset permainan.');
    }
    return data.game;
  }
}

export const apiClient = new ApiClient();
