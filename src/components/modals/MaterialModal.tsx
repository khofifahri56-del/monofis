/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, Lightbulb, Compass, X, RefreshCw } from 'lucide-react';
import { PhysicsMaterial } from '../../types/game';
import { getOpticsIllustration } from '../OpticsIllustrations';

interface MaterialModalProps {
  material?: PhysicsMaterial;
  tileIndex: number;
  groupName: string;
  isMyTurn: boolean;
  onComplete: () => Promise<void> | void;
  onDismiss: () => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  material,
  tileIndex,
  groupName,
  isMyTurn,
  onComplete,
  onDismiss,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinishReading = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onComplete();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!material) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white border-2 border-purple-300 rounded-3xl max-w-md w-full p-6 text-slate-900 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">Kotak #{tileIndex} • Materi</h2>
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Materi pada petak ini telah dihapus oleh pengelola. Posisi pion {groupName} tetap berada di Kotak #{tileIndex}.
          </p>
          <div className="flex justify-end gap-2">
            {isMyTurn ? (
              <button
                onClick={handleFinishReading}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjut Giliran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onDismiss}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border-3 border-purple-400 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-slate-900 space-y-4 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-sm shrink-0">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Kotak #{tileIndex} • Materi Pembelajaran
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">{material.title}</h2>
              <p className="text-xs text-slate-500 font-medium">{material.topic}</p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
            title="Tutup sementara untuk melihat papan"
            aria-label="Tutup panel materi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Group Banner */}
        <div className="bg-purple-50 px-4 py-2 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-2 text-purple-900 border border-purple-200 font-medium">
          <span>
            Kelompok di Kotak #{tileIndex}: <strong className="font-black text-purple-800">{groupName}</strong>
          </span>
          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Posisi pion tetap di Kotak #{tileIndex}
          </span>
        </div>

        {/* Vector Illustration */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900">
          {getOpticsIllustration(material.id, 'w-full h-32 sm:h-36')}
        </div>

        {/* Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-600" /> Ringkasan Materi
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {material.summary}
          </p>
        </div>

        {/* Key Points */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Prinsip &amp; Kaidah Optik:
          </h3>
          <div className="space-y-1.5">
            {material.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-slate-700 leading-snug flex items-start gap-2 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Formula Box if available */}
        {material.formula && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-center space-y-0.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-700">
              Rumus / Persamaan Utama
            </span>
            <p className="font-mono text-base font-black text-indigo-900">
              {material.formula}
            </p>
          </div>
        )}

        {/* Fun Fact & Real Application */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {material.funFact && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-slate-700 space-y-1">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Fakta Sains Unik:
              </span>
              <p className="font-medium text-slate-600">{material.funFact}</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-slate-700 space-y-1">
            <span className="font-bold text-sky-800">Aplikasi Nyata:</span>
            <p className="font-medium text-slate-600">{material.application}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onDismiss}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Lihat Papan
          </button>

          {isMyTurn ? (
            <button
              type="button"
              onClick={handleFinishReading}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Progres...</span>
                </>
              ) : (
                <>
                  <span>Selesai Membaca &amp; Lanjut Giliran</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <span className="text-[11px] text-slate-500 italic font-medium">
              Menunggu {groupName} menyelesaikan materi...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
