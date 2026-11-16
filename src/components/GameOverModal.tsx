/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Trophy, Award, Sparkles, RotateCcw, Home, Download, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSession, Group } from '../types/game';
import { soundManager } from '../services/soundEffects';

interface GameOverModalProps {
  session: GameSession;
  onReset: () => Promise<void>;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  session,
  onReset,
  onHome,
}) => {
  const groupsList = Object.values(session.groups).sort((a, b) => b.score - a.score);
  const winner = groupsList[0] as Group | undefined;

  useEffect(() => {
    soundManager.playVictoryFanfare();
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        startVelocity: 35,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleExportReport = () => {
    const reportData = {
      gameName: session.gameName,
      gameCode: session.gameCode,
      teacherName: session.teacherName,
      date: new Date(session.createdAt).toLocaleString('id-ID'),
      winner: winner ? { name: winner.name, score: winner.score } : null,
      leaderboard: groupsList.map((g, idx) => ({
        rank: idx + 1,
        name: g.name,
        totalScore: g.score,
        quizPoints: g.quizPoints,
        bonusPoints: g.bonusPoints,
        challengePoints: g.challengePoints,
        correctAnswers: g.correctAnswersCount,
        wrongAnswers: g.wrongAnswersCount,
      })),
      answersLog: Object.values(session.answers),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MONOFIS_Laporan_${session.gameCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border-3 border-amber-400 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-slate-900 space-y-5 shadow-2xl text-center relative">
        {/* Header */}
        <div className="space-y-1">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-md ring-2 ring-amber-300">
            <Trophy className="w-8 h-8 animate-bounce text-amber-600" />
          </div>
          <span className="text-[11px] uppercase font-black tracking-widest text-amber-800 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
            Permainan Selesai
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            PODIUM JUARA MONOFIS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Materi: Cahaya dan Alat Optik • {session.gameName}
          </p>
        </div>

        {/* Winner Highlight Card */}
        {winner && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-400 shadow-md space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> JUARA 1
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {winner.name}
            </div>
            <div className="text-4xl font-black text-amber-600">
              {winner.score} <span className="text-lg font-bold text-slate-600">Poin</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-600 font-semibold pt-1 border-t border-amber-200">
              <span>Kuis: {winner.quizPoints} pts</span>
              <span>•</span>
              <span>Bonus: {winner.bonusPoints} pts</span>
              <span>•</span>
              <span>Tantangan: {winner.challengePoints} pts</span>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Hasil Akhir Seluruh Kelompok:
          </h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {groupsList.map((g, idx) => (
              <div
                key={g.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-white"
                    style={{ backgroundColor: g.color }}
                  />
                  <div>
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm">{g.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Benar: {g.correctAnswersCount} | Salah: {g.wrongAnswersCount}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-amber-600">{g.score}</span>
                  <span className="text-xs text-slate-500 ml-0.5">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 border-t border-slate-100">
          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>Unduh Laporan Nilai (JSON)</span>
          </button>

          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang Sesi</span>
          </button>

          <button
            onClick={onHome}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
