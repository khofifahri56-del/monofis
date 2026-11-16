/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Users, Sparkles, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { COLOR_OPTIONS, AVATAR_OPTIONS } from '../data/monofisBoardData';
import { apiClient } from '../services/apiClient';
import { GameSession } from '../types/game';

interface StudentJoinViewProps {
  initialCode?: string;
  onJoined: (game: GameSession, groupId: string) => void;
  onBack: () => void;
}

export const StudentJoinView: React.FC<StudentJoinViewProps> = ({
  initialCode = '',
  onJoined,
  onBack,
}) => {
  const [code, setCode] = useState(initialCode);
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase());
    }
  }, [initialCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    const cleanName = groupName.trim();

    if (!cleanCode) {
      setErrorMsg('Masukkan kode permainan yang diberikan oleh Guru.');
      return;
    }
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Nama kelompok minimal 2 karakter.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const game = await apiClient.getGameByCode(cleanCode);
      const { group, game: updatedGame } = await apiClient.registerGroup(
        game.id,
        cleanName,
        selectedColor,
        selectedAvatar
      );
      onJoined(updatedGame, group.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal bergabung. Periksa kembali kode sesi atau nama kelompok.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl shadow-amber-100/60">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Formulir Siswa
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Gabung Sesi MONOFIS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Masukkan kode sesi kelas dan daftarkan identitas kelompokmu.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Game Code Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              1. Kode Permainan
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: BJC-225"
              maxLength={10}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white text-slate-900 font-mono text-2xl font-black tracking-widest uppercase transition-all shadow-inner placeholder:normal-case placeholder:text-slate-400 placeholder:text-sm placeholder:tracking-normal"
              required
            />
          </div>

          {/* Group Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              2. Nama Kelompok
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Contoh: Kelompok Newton / Kelompok Lensa 1"
              maxLength={30}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white text-slate-900 font-bold text-sm transition-all shadow-inner placeholder:text-slate-400 placeholder:font-normal"
              required
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              3. Pilih Warna Pion Kelompok
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = selectedColor === c.hex;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? 'ring-4 ring-slate-900 scale-105 shadow-md' : 'opacity-80 hover:opacity-100 hover:scale-102'
                    }`}
                    title={c.name}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Avatar / Symbol Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              4. Simbol Fisika Kelompok
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-400 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-bold leading-tight truncate w-full">
                      {av.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mendaftarkan Kelompok...</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>BERGABUNG KE PERMAINAN</span>
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
