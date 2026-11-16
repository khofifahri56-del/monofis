/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Play,
  UserPlus,
  RefreshCw,
  Share2,
  Shield,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import { AuthUser, GameSession } from '../types/game';
import { apiClient } from '../services/apiClient';

interface TeacherLobbyViewProps {
  session: GameSession;
  authUser: AuthUser;
  onStartGame: () => Promise<void>;
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

export const TeacherLobbyView: React.FC<TeacherLobbyViewProps> = ({
  session,
  authUser,
  onStartGame,
  onNotify,
  onRequestConfirm,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isAddingDemo, setIsAddingDemo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canManage = authUser.role === 'admin' || authUser.role === 'moderator';
  const groupsList = Object.values(session.groups);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(session.gameCode);
    setCopied(true);
    onNotify('info', `Kode permainan ${session.gameCode} disalin.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyShareLink = () => {
    const url = window.location.origin + '?code=' + session.gameCode;
    navigator.clipboard.writeText(url);
    setCopied(true);
    onNotify('info', 'Tautan bergabung disalin ke clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = async () => {
    if (groupsList.length === 0) {
      setErrorMsg('Belum ada kelompok yang bergabung! Minimal harus ada 1 kelompok untuk memulai.');
      return;
    }
    setErrorMsg(null);
    setIsStarting(true);
    try {
      await onStartGame();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memulai permainan.');
      setIsStarting(false);
    }
  };

  const handleAddDemoGroup = async () => {
    setIsAddingDemo(true);
    setErrorMsg(null);
    try {
      const demoNames = [
        'Kelompok Newton',
        'Kelompok Snellius',
        'Kelompok Galileo',
        'Kelompok Huygens',
        'Kelompok Maxwell',
        'Kelompok Fresnel',
      ];
      const colors = ['#f43f5e', '#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#06b6d4'];
      const avatars = ['prism', 'laser', 'lens', 'mirror', 'telescope', 'microscope'];

      const existingNames = groupsList.map((g) => g.name.toLowerCase());
      const nextAvailable =
        demoNames.find((n) => !existingNames.includes(n.toLowerCase())) ||
        `Kelompok Optik ${groupsList.length + 1}`;
      const color = colors[groupsList.length % colors.length];
      const avatar = avatars[groupsList.length % avatars.length];

      // Pass saveStudentCache = false so host's role cache is preserved
      await apiClient.registerGroup(session.id, nextAvailable, color, avatar, false);
      onNotify('success', `${nextAvailable} berhasil ditambahkan ke ruang tunggu.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menambahkan kelompok demo.');
    } finally {
      setIsAddingDemo(false);
    }
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    onRequestConfirm({
      title: 'Hapus Kelompok dari Sesi?',
      message: `Kelompok "${groupName}" akan dikeluarkan dari sesi ini. Kelompok lain yang terdaftar tidak akan terpengaruh.`,
      confirmLabel: 'Hapus Kelompok',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await apiClient.deleteGroup(session.id, groupId);
          onNotify('success', res.message || `Kelompok "${groupName}" berhasil dihapus.`);
        } catch (err: any) {
          onNotify('error', err.message || 'Gagal menghapus kelompok.');
        }
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-5 px-4 space-y-5">
      {/* Top Session Banner */}
      <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-black uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Ruang Tunggu Kelas • Host Sesi</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {session.gameName}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Pengampu: <strong className="text-slate-800">{session.teacherName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddDemoGroup}
              disabled={isAddingDemo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Tambahkan kelompok uji coba tanpa perangkat tambahan"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAddingDemo ? 'Menambahkan...' : '+ Uji Coba Cepat'}</span>
            </button>
          </div>
        </div>

        {/* Big Game Code Banner for Projector / TV */}
        <div className="bg-gradient-to-r from-sky-50 via-amber-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border-2 border-sky-300 text-center space-y-2 shadow-inner">
          <span className="text-xs uppercase tracking-widest text-sky-800 font-black">
            Tampilkan di Layar Smart TV / Proyektor Kelas:
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-4xl sm:text-6xl font-black tracking-widest text-amber-600 drop-shadow-sm">
              {session.gameCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-colors cursor-pointer"
              title="Salin Kode Permainan"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-200" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-xs text-slate-600 max-w-lg mx-auto font-medium">
            Siswa membuka MONOFIS di HP/tablet, memilih <strong>&quot;Gabung dengan Kode Sesi&quot;</strong>, lalu memasukkan kode di atas.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-300 shadow-sm transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Salin Link Gabung Langsung</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {/* Connected Groups List */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Kelompok Terdaftar ({groupsList.length})
            </h2>
          </div>
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Real-time Siap
          </span>
        </div>

        {groupsList.length === 0 ? (
          <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-2">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mx-auto text-sky-600">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-slate-800 text-sm font-bold">
              Menunggu kelompok siswa bergabung...
            </p>
            <p className="text-slate-500 text-xs max-w-sm mx-auto font-medium">
              Siswa dapat bergabung dengan kode <strong className="text-amber-600">{session.gameCode}</strong> atau klik tombol &quot;+ Uji Coba Cepat&quot; di atas untuk simulasi langsung.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {groupsList.map((grp, idx) => (
              <div
                key={grp.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 hover:border-slate-300 shadow-sm transition-colors"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm ring-2 ring-white shrink-0"
                  style={{ backgroundColor: grp.color }}
                >
                  {grp.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black text-slate-400">Pion #{idx + 1}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      Tersambung
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{grp.name}</h3>
                  <p className="text-[10px] text-slate-500">Skor Awal: 0 Poin</p>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleDeleteGroup(grp.id, grp.name)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer shrink-0"
                    title={`Hapus kelompok ${grp.name}`}
                    aria-label={`Hapus kelompok ${grp.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Start Game Action Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
            {groupsList.length >= 1
              ? `Siap dengan ${groupsList.length} kelompok. Klik Mulai Permainan untuk mengaktifkan papan.`
              : 'Daftarkan minimal 1 kelompok sebelum memulai.'}
          </p>

          <button
            onClick={handleStart}
            disabled={groupsList.length === 0 || isStarting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
          >
            {isStarting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memulai Permainan...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Permainan MONOFIS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
