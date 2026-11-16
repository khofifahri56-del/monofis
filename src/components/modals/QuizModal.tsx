/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, ArrowRight, RefreshCw, X } from 'lucide-react';
import { SafeQuiz } from '../../types/game';
import { getOpticsIllustration } from '../OpticsIllustrations';

interface QuizModalProps {
  quiz?: SafeQuiz;
  tileIndex: number;
  groupName: string;
  isMyTurn: boolean;
  isAnswered: boolean;
  resultData?: {
    isCorrect: boolean;
    pointsAwarded: number;
    explanation: string;
    correctIndex: number;
  } | null;
  onSubmitAnswer: (selectedIndex: number) => Promise<void>;
  onNextTurn: () => Promise<void> | void;
  onDismiss: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  tileIndex,
  groupName,
  isMyTurn,
  isAnswered,
  resultData,
  onSubmitAnswer,
  onNextTurn,
  onDismiss,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedIndex === null || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmitAnswer(selectedIndex);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white border-2 border-amber-300 rounded-3xl max-w-md w-full p-6 text-slate-900 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">Kotak #{tileIndex} • Kuis Fisika</h2>
            <button onClick={onDismiss} className="p-1.5 rounded-xl bg-slate-100 text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Soal kuis pada petak ini telah dihapus oleh pengelola. Posisi pion {groupName} tetap di Kotak #{tileIndex}.
          </p>
          <div className="flex justify-end gap-2">
            {isMyTurn ? (
              <button
                onClick={onNextTurn}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjut Giliran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onDismiss}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
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
      <div className="bg-white border-3 border-amber-400 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-slate-900 space-y-4 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm shrink-0">
              <HelpCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Kotak #{tileIndex} • Kuis Fisika
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-300">
                  +10 Poin
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">{quiz.title}</h2>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer shrink-0"
            aria-label="Tutup panel kuis"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Turn Group Banner */}
        <div className="bg-slate-50 px-4 py-2 rounded-2xl text-xs flex items-center justify-between text-slate-700 border border-slate-200 font-medium">
          <span>
            Giliran Menjawab: <strong className="text-amber-800 font-black">{groupName}</strong>
          </span>
          {!isMyTurn && !isAnswered && (
            <span className="text-slate-500 italic text-[11px]">
              Menunggu kelompok aktif memilih jawaban...
            </span>
          )}
        </div>

        {/* Dynamic Vector Optics Illustration */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900">
          {getOpticsIllustration(quiz.id, 'w-full h-32 sm:h-36')}
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-bold bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
            {quiz.question}
          </p>

          {/* 4 Choices */}
          <div className="space-y-2">
            {quiz.options.map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              const isCorrectOpt = resultData && resultData.correctIndex === idx;
              const isWrongOpt = resultData && selectedIndex === idx && !resultData.isCorrect;

              let btnStyle =
                'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

              if (resultData) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400 font-bold';
                } else if (isWrongOpt) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400 font-bold';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-amber-100 border-amber-500 text-slate-950 ring-2 ring-amber-400 font-bold';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!isMyTurn || isAnswered || isSubmitting}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-2xl border-2 text-xs sm:text-sm font-semibold transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-black shadow-xs ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                  {resultData && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {resultData && isWrongOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Explanation */}
        {resultData && (
          <div
            className={`p-3.5 rounded-2xl border-2 space-y-1.5 text-xs sm:text-sm ${
              resultData.isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between font-black">
              <span className="flex items-center gap-1.5">
                {resultData.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Jawaban Tepat! (+10 Poin)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Jawaban Belum Tepat (+0 Poin)</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed">
              <strong className="text-slate-900">Pembahasan Sains: </strong>
              {resultData.explanation}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onDismiss}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Lihat Papan
          </button>

          {!resultData && !isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={selectedIndex === null || !isMyTurn || isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memeriksa Jawaban...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Kirim Jawaban</span>
                </>
              )}
            </button>
          ) : isMyTurn ? (
            <button
              onClick={onNextTurn}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Giliran Berikutnya</span>
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
};
