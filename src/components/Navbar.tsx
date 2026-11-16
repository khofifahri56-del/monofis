/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  LogOut,
  Radio,
  CheckCircle2,
  Tv,
  UserCheck,
  BookOpen,
  Power,
} from 'lucide-react';
import { AuthUser, ConnectionState, GameSession } from '../types/game';
import { soundManager } from '../services/soundEffects';

interface NavbarProps {
  authUser: AuthUser | null;
  session: GameSession | null;
  connectionState: ConnectionState;
  role: 'teacher' | 'student' | null;
  currentGroupId: string | null;
  onExitSession: () => void;
  onOpenContentManager: () => void;
  onLogoutAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  authUser,
  session,
  connectionState,
  role,
  currentGroupId,
  onExitSession,
  onOpenContentManager,
  onLogoutAccount,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleSound = () => {
    soundManager.toggleMute();
    setIsMuted(soundManager.isMuted());
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCopyCode = () => {
    if (!session?.gameCode) return;
    navigator.clipboard.writeText(session.gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentGroup = currentGroupId && session ? session.groups[currentGroupId] : null;

  const roleBadgeClass =
    authUser?.role === 'admin'
      ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
      : authUser?.role === 'moderator'
      ? 'bg-purple-100 text-purple-800 border-purple-300'
      : 'bg-amber-100 text-amber-800 border-amber-300';

  const roleLabel =
    authUser?.role === 'admin'
      ? 'Admin'
      : authUser?.role === 'moderator'
      ? 'Moderator'
      : 'User';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-sky-200 text-slate-800 px-3 sm:px-6 py-2 shadow-sm transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 flex items-center justify-center shadow-md shadow-sky-500/30 text-white transform hover:rotate-6 transition-transform">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500">
                MONOFIS
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 hidden xs:inline-block">
                Fisika Optik
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              Monopoly Pembelajaran Cahaya &amp; Alat Optik
            </p>
          </div>
        </div>

        {/* Center: Game Code and Role status if in game */}
        {session && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-sky-50 to-amber-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-sky-300 shadow-inner">
              <span className="text-[11px] font-bold text-sky-700 hidden sm:inline">Kode:</span>
              <span className="font-mono font-black text-sm sm:text-lg text-amber-600 tracking-wider">
                {session.gameCode}
              </span>
              <button
                onClick={handleCopyCode}
                title="Salin Kode Permainan"
                className="p-1 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
              {role === 'teacher' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Host Sesi</span>
                </>
              ) : currentGroup ? (
                <>
                  <span
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: currentGroup.color }}
                  />
                  <span>Kelompok: {currentGroup.name}</span>
                </>
              ) : (
                'Peserta Kelas'
              )}
            </div>
          </div>
        )}

        {/* Right tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Authenticated User Pill */}
          {authUser && (
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold ${roleBadgeClass}`}>
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="max-w-[110px] truncate">{authUser.name}</span>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-md bg-white/70">
                {roleLabel}
              </span>
            </div>
          )}

          {/* Content Manager shortcut when logged in */}
          {authUser && !session && (
            <button
              onClick={onOpenContentManager}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Kelola Bank Materi & Soal Fisika"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Materi &amp; Soal</span>
            </button>
          )}

          {/* Smart TV / Projector Fullscreen Mode */}
          <button
            onClick={handleToggleFullscreen}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Tampilan Layar Penuh"
          >
            <Tv className="w-4 h-4 text-sky-600" />
            <span className="hidden xl:inline">{isFullscreen ? 'Keluar Fullscreen' : 'Mode TV'}</span>
          </button>

          {/* Connection Status Pill (shown when in session) */}
          {session && (
            <div
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                connectionState === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : connectionState === 'saved'
                  ? 'bg-sky-50 text-sky-700 border-sky-300'
                  : connectionState === 'reconnecting'
                  ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                  : 'bg-rose-50 text-rose-700 border-rose-300'
              }`}
            >
              {connectionState === 'connected' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden md:inline">Real-time</span>
                </>
              )}
              {connectionState === 'saved' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden md:inline">Tersimpan</span>
                </>
              )}
              {connectionState === 'reconnecting' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="hidden md:inline">Sync...</span>
                </>
              )}
              {connectionState === 'offline' && (
                <>
                  <Radio className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden md:inline">Offline</span>
                </>
              )}
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-sm cursor-pointer"
            title={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Exit session button */}
          {session && (
            <button
              onClick={onExitSession}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Keluar dari sesi permainan ini"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar Sesi</span>
            </button>
          )}

          {/* Logout account button */}
          {authUser && !session && (
            <button
              onClick={onLogoutAccount}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-all cursor-pointer"
              title="Logout akun"
            >
              <Power className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
