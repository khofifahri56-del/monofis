/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Award, Sparkles, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../services/soundEffects';
import { PhotonBonusIllustration } from '../OpticsIllustrations';

interface BonusModalProps {
  groupName: string;
  points: number;
  isMyTurn: boolean;
  onNextTurn: () => Promise<void> | void;
  onDismiss: () => void;
}

export const BonusModal: React.FC<BonusModalProps> = ({
  groupName,
  points,
  isMyTurn,
  onNextTurn,
  onDismiss,
}) => {
  useEffect(() => {
    soundManager.playBonusChime();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border-3 border-emerald-400 rounded-3xl max-w-lg w-full p-5 sm:p-7 text-slate-900 space-y-4 shadow-2xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
          aria-label="Tutup panel bonus"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md ring-2 ring-emerald-300">
          <Award className="w-8 h-8 animate-bounce text-emerald-600" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] uppercase font-black tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Kotak #6 • Laboratorium Foton Optik
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">BONUS FOTON OPTIK!</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Selamat kepada <strong className="text-emerald-700 font-black">{groupName}</strong>! Pion mendarat di Kotak Bonus Foton.
          </p>
        </div>

        {/* Vector illustration */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-emerald-200">
          <PhotonBonusIllustration className="w-full h-28 sm:h-32" />
        </div>

        <div className="py-3 px-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border-2 border-emerald-300 inline-block shadow-inner">
          <div className="text-4xl sm:text-5xl font-black text-emerald-600">
            +{points} POIN
          </div>
          <span className="text-[10px] text-emerald-800 font-black tracking-wider uppercase block mt-0.5">
            Ditambahkan Otomatis ke Skor Kelompok
          </span>
        </div>

        <p className="text-[11px] text-slate-500 max-w-xs mx-auto font-medium">
          Foton membawa paket energi kuantum gelombang elektromagnetik berkecepatan 3 x 10^8 m/s!
        </p>

        <div className="pt-2">
          {isMyTurn ? (
            <button
              onClick={onNextTurn}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Klaim Bonus &amp; Lanjut Giliran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onDismiss}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
