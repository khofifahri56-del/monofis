/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  GameSession,
  ConnectionState,
  AuthUser,
  GameContentStore,
  ToastItem,
} from './types/game';
import { apiClient } from './services/apiClient';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { TeacherLobbyView } from './components/TeacherLobbyView';
import { StudentJoinView } from './components/StudentJoinView';
import { GameBoardView } from './components/GameBoardView';
import { TeacherHistoryView } from './components/TeacherHistoryView';
import { CreateGameModal } from './components/CreateGameModal';
import { LoginView } from './components/LoginView';
import { ContentManagerView } from './components/ContentManagerView';
import { ToastContainer } from './components/ToastContainer';
import { ConfirmModal } from './components/ConfirmModal';
import { RefreshCw } from 'lucide-react';

type AppView =
  | 'home'
  | 'teacher_lobby'
  | 'student_join'
  | 'game_board'
  | 'history'
  | 'content_manager';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading: boolean;
  onConfirm: (() => Promise<void>) | null;
}

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [session, setSession] = useState<GameSession | null>(null);
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('home');
  const [connectionState, setConnectionState] = useState<ConnectionState>('offline');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [urlCode, setUrlCode] = useState<string>('');
  const [contentStore, setContentStore] = useState<GameContentStore>({
    materials: {},
    quizzes: {},
    challenges: {},
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    isLoading: false,
    onConfirm: null,
  });

  const roleRef = useRef(role);
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  const addToast = useCallback((type: ToastItem['type'], message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const requestConfirm = useCallback(
    (opts: {
      title: string;
      message: string;
      confirmLabel?: string;
      variant?: 'danger' | 'warning' | 'primary';
      onConfirm: () => Promise<void>;
    }) => {
      setConfirmState({
        isOpen: true,
        title: opts.title,
        message: opts.message,
        confirmLabel: opts.confirmLabel,
        variant: opts.variant || 'danger',
        isLoading: false,
        onConfirm: opts.onConfirm,
      });
    },
    []
  );

  const handleConfirmExecute = async () => {
    if (!confirmState.onConfirm) return;
    setConfirmState((prev) => ({ ...prev, isLoading: true }));
    try {
      await confirmState.onConfirm();
    } finally {
      setConfirmState({
        isOpen: false,
        title: '',
        message: '',
        isLoading: false,
        onConfirm: null,
      });
    }
  };

  const restoreSessionAndContent = useCallback(async (user: AuthUser, joinCodeParam?: string) => {
    try {
      const content = await apiClient.getContent();
      setContentStore(content);
    } catch (err) {
      console.warn('Failed to fetch content store:', err);
    }

    if (joinCodeParam) {
      setUrlCode(joinCodeParam.toUpperCase());
      setView('student_join');
      return;
    }

    const cache = apiClient.getCache();
    if (cache && cache.gameId) {
      try {
        const game = await apiClient.getGame(cache.gameId);
        setSession(game);
        setRole(cache.role);
        setCurrentGroupId(cache.groupId);
        apiClient.subscribeToGame(game.id);

        if (game.status === 'waiting' && cache.role === 'teacher') {
          setView('teacher_lobby');
        } else {
          setView('game_board');
        }
      } catch (err) {
        console.warn('Failed to restore cached session:', err);
        apiClient.setCache(null);
      }
    }
    void user;
  }, []);

  // Setup connection listeners & check auth on mount (no [role] dep so SSE never resets!)
  useEffect(() => {
    const unsubStatus = apiClient.onStatusChange((status) => {
      setConnectionState(status);
    });

    const unsubSession = apiClient.onSessionUpdate((updatedSession) => {
      setSession(updatedSession);
      if (
        updatedSession.status === 'playing' ||
        updatedSession.status === 'paused' ||
        updatedSession.status === 'finished'
      ) {
        setView('game_board');
      } else if (updatedSession.status === 'waiting' && roleRef.current === 'teacher') {
        setView('teacher_lobby');
      }
    });

    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code')?.toUpperCase() || '';
    if (codeParam) {
      setUrlCode(codeParam);
    }

    apiClient
      .getCurrentUser()
      .then(async (user) => {
        setAuthUser(user);
        if (user) {
          await restoreSessionAndContent(user, codeParam || undefined);
        }
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });

    return () => {
      unsubStatus();
      unsubSession();
      apiClient.disconnect();
    };
  }, [restoreSessionAndContent]);

  const handleAuthenticated = async (user: AuthUser) => {
    setAuthUser(user);
    addToast('success', `Selamat datang, ${user.name} (${user.role.toUpperCase()})!`);
    await restoreSessionAndContent(user, urlCode || undefined);
  };

  const handleLogoutAccount = () => {
    requestConfirm({
      title: 'Keluar dari Akun?',
      message: 'Anda akan keluar dari akun saat ini dan diarahkan kembali ke halaman Login.',
      confirmLabel: 'Logout',
      variant: 'warning',
      onConfirm: async () => {
        await apiClient.logout();
        setAuthUser(null);
        setSession(null);
        setRole(null);
        setCurrentGroupId(null);
        setView('home');
        addToast('info', 'Anda telah logout.');
      },
    });
  };

  // Handle Host Create Game
  const handleGameCreated = (newSession: GameSession) => {
    setIsCreateModalOpen(false);
    setSession(newSession);
    setRole('teacher');
    setCurrentGroupId(null);
    setView('teacher_lobby');
    addToast('success', `Sesi "${newSession.gameName}" dibuat dengan kode ${newSession.gameCode}.`);
  };

  // Handle Start Game
  const handleTeacherStartGame = async () => {
    if (!session) return;
    const started = await apiClient.startGame(session.id);
    setSession(started);
    setView('game_board');
    addToast('success', 'Permainan dimulai! Giliran pertama siap melempar dadu.');
  };

  // Handle Student Joined Game
  const handleStudentJoined = (game: GameSession, groupId: string) => {
    setSession(game);
    setRole('student');
    setCurrentGroupId(groupId);
    setView('game_board');
    addToast('success', 'Berhasil bergabung ke sesi permainan!');
  };

  // Handle Select from History
  const handleSelectHistoryGame = (game: GameSession) => {
    setSession(game);
    setRole('teacher');
    setCurrentGroupId(null);
    apiClient.subscribeToGame(game.id);
    apiClient.setCache({
      gameId: game.id,
      gameCode: game.gameCode,
      groupId: null,
      role: 'teacher',
    });
    if (game.status === 'waiting') {
      setView('teacher_lobby');
    } else {
      setView('game_board');
    }
  };

  // Handle Exit / Leave Session
  const handleExitSession = () => {
    requestConfirm({
      title: 'Keluar dari Sesi Permainan?',
      message:
        'Anda akan keluar dari tampilan sesi saat ini. Progres kelompok tetap tersimpan di database.',
      confirmLabel: 'Keluar Sesi',
      variant: 'warning',
      onConfirm: async () => {
        apiClient.disconnect();
        apiClient.setCache(null);
        setSession(null);
        setRole(null);
        setCurrentGroupId(null);
        setView('home');
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Universal Navbar */}
      <Navbar
        authUser={authUser}
        session={session}
        connectionState={connectionState}
        role={role}
        currentGroupId={currentGroupId}
        onExitSession={handleExitSession}
        onOpenContentManager={() => setView('content_manager')}
        onLogoutAccount={handleLogoutAccount}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {isCheckingAuth ? (
          <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-sky-200 shadow-lg text-sm font-bold text-slate-700">
              <RefreshCw className="w-5 h-5 animate-spin text-sky-600" />
              <span>Memeriksa sesi login...</span>
            </div>
          </div>
        ) : !authUser ? (
          <LoginView
            pendingJoinCode={urlCode || undefined}
            onAuthenticated={handleAuthenticated}
          />
        ) : (
          <>
            {view === 'home' && (
              <HomeView
                authUser={authUser}
                onSelectTeacherMode={() => setIsCreateModalOpen(true)}
                onSelectStudentMode={() => setView('student_join')}
                onOpenHistory={() => setView('history')}
                onOpenContentManager={() => setView('content_manager')}
              />
            )}

            {view === 'teacher_lobby' && session && (
              <TeacherLobbyView
                session={session}
                authUser={authUser}
                onStartGame={handleTeacherStartGame}
                onNotify={addToast}
                onRequestConfirm={requestConfirm}
                onBack={() => {
                  apiClient.disconnect();
                  apiClient.setCache(null);
                  setSession(null);
                  setRole(null);
                  setView('home');
                }}
              />
            )}

            {view === 'student_join' && (
              <StudentJoinView
                initialCode={urlCode}
                onJoined={handleStudentJoined}
                onBack={() => setView('home')}
              />
            )}

            {view === 'game_board' && session && (
              <GameBoardView
                session={session}
                role={role}
                authUser={authUser}
                currentGroupId={currentGroupId}
                contentStore={contentStore}
                onNotify={addToast}
                onRequestConfirm={requestConfirm}
                onHome={() => {
                  apiClient.disconnect();
                  apiClient.setCache(null);
                  setSession(null);
                  setRole(null);
                  setCurrentGroupId(null);
                  setView('home');
                }}
              />
            )}

            {view === 'history' && (
              <TeacherHistoryView
                authUser={authUser}
                onSelectGame={handleSelectHistoryGame}
                onNotify={addToast}
                onRequestConfirm={requestConfirm}
                onBack={() => setView('home')}
              />
            )}

            {view === 'content_manager' && (
              <ContentManagerView
                authUser={authUser}
                contentStore={contentStore}
                onContentChange={setContentStore}
                onNotify={addToast}
                onRequestConfirm={requestConfirm}
                onBack={() => setView('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Host Create Game Modal */}
      {authUser && (
        <CreateGameModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleGameCreated}
        />
      )}

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        variant={confirmState.variant}
        isLoading={confirmState.isLoading}
        onConfirm={handleConfirmExecute}
        onCancel={() =>
          setConfirmState({
            isOpen: false,
            title: '',
            message: '',
            isLoading: false,
            onConfirm: null,
          })
        }
      />

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
