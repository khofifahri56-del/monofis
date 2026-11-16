/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { History, ArrowLeft, Trophy, Calendar, Users, Play, Trash2 } from 'lucide-react';
import { AuthUser, GameSession } from '../types/game';
import { apiClient } from '../services/apiClient';

interface TeacherHistoryViewProps {
  authUser: AuthUser;
  onSelectGame: (game: GameSession) => void;
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onRequestConfirm: (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => Promise<void>;
  }) => void;
  onBack: () => void;
}

export const TeacherHistoryView: React.FC<TeacherHistoryViewProps> = ({
  authUser,
  onSelectGame,
  onNotify,
  onRequestConfirm,
  onBack,
}) => {
  const [games, setGames] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canManage = authUser.role === 'admin' || authUser.role === 'moderator';

  useEffect(() => {
    apiClient
      .listGames()
      .then((list) => {
        setGames(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load games:', err);
        onNotify('error', err.message || 'Gagal memuat riwayat sesi.');
        setIsLoading(false);
      });
  }, []);

  const handleDeleteSession = (game: GameSession) => {
    onRequestConfirm({
      title: 'Hapus Sesi Permainan?',
      message: `Sesi "${game.gameName}" (Kode: ${game.gameCode}) akan dihapus secara permanen dari database. Sesi lainnya tidak akan terpengaruh.`,
      confirmLabel: 'Hapus Sesi',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await apiClient.deleteGame(game.id);
          setGames((prev) => prev.filter((item) => item.id !== game.id));
          onNotify('success', res.message || `Sesi "${game.gameName}" berhasil dihapus.`);
        } catch (err: any) {
          onNotify('error', err.message || 'Gagal menghapus sesi permainan.');
        }
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5">
          <History className="w-4 h-4" />
          Riwayat Seluruh Sesi Kelas
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Arsip &amp; Riwayat Sesi MONOFIS
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Data permainan tersimpan secara permanen di database dan dapat dibuka kembali kapan saja.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-sm font-semibold">
          Memuat riwayat permainan...
        </div>
      ) : games.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border-2 border-slate-200 text-center space-y-2 shadow-sm">
          <p className="text-slate-800 font-bold text-sm">Belum ada sesi permainan tersimpan.</p>
          <p className="text-xs text-slate-500 font-medium">
            Buat sesi baru dari beranda untuk memulai pembelajaran bersama siswa.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {games.map((g) => {
            const groups = Object.values(g.groups).sort((a, b) => b.score - a.score);
            const winner = groups[0];

            return (
              <div
                key={g.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-sky-300 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-700 text-sm bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                      {g.gameCode}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        g.status === 'finished'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : g.status === 'playing'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {g.status === 'finished' ? 'Selesai' : g.status === 'playing' ? 'Sedang Main' : 'Ruang Tunggu'}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base">{g.gameName}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(g.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {groups.length} Kelompok
                    </span>
                    {winner && (
                      <>
                        <span>•</span>
                        <span className="text-amber-700 flex items-center gap-1 font-bold">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          Juara: {winner.name} ({winner.score} pts)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectGame(g)}
                    className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Buka Sesi</span>
                  </button>

                  {canManage && (
                    <button
                      onClick={() => handleDeleteSession(g)}
                      className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                      title={`Hapus sesi ${g.gameName}`}
                      aria-label={`Hapus sesi ${g.gameName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
