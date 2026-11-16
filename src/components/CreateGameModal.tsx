/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationCap, Sparkles, RefreshCw, X, ArrowRight } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { GameSession } from '../types/game';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (session: GameSession) => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [gameName, setGameName] = useState('Kelas 8 - Fisika Cahaya & Alat Optik');
  const [teacherName, setTeacherName] = useState('Guru Fisika');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim() || !teacherName.trim()) {
      setErrorMsg('Nama sesi kelas dan nama guru wajib diisi.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const session = await apiClient.createGame(gameName.trim(), teacherName.trim());
      onCreated(session);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membuat sesi permainan.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border-3 border-indigo-300 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Buat Sesi Kelas Baru</h2>
              <p className="text-xs text-slate-500 font-medium">Panel Guru / Pengampu IPA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Nama Sesi / Kelas
            </label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Contoh: Kelas 8A - Fisika Optik"
              maxLength={60}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-300 focus:border-indigo-500 focus:bg-white text-slate-900 text-sm font-bold transition-all shadow-inner"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Nama Guru Pengampu
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Contoh: Ibu Fatimah, S.Pd"
              maxLength={40}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-300 focus:border-indigo-500 focus:bg-white text-slate-900 text-sm font-bold transition-all shadow-inner"
              required
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-slate-600 space-y-1 font-medium">
            <p className="font-black text-indigo-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sistem Otomatisasi Permainan:
            </p>
            <p>• Kode unik 6-digit dibuatkan secara otomatis oleh server.</p>
            <p>• Papan 24 kotak materi optik langsung siap dimainkan.</p>
            <p>• Sinkronisasi real-time instan aktif untuk seluruh kelompok.</p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Membuat Sesi...</span>
                </>
              ) : (
                <>
                  <span>Buka Ruang Kelas</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
