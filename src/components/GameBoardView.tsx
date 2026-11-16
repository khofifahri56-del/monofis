/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  Tv,
  Shield,
} from 'lucide-react';
import { BOARD_TILES } from '../data/monofisBoardData';
import { GameSession, AuthUser, GameContentStore } from '../types/game';
import { DiceRoller } from './DiceRoller';
import { QuizModal } from './modals/QuizModal';
import { MaterialModal } from './modals/MaterialModal';
import { ChallengeModal } from './modals/ChallengeModal';
import { BonusModal } from './modals/BonusModal';
import { GameOverModal } from './GameOverModal';
import { apiClient } from '../services/apiClient';
import { soundManager } from '../services/soundEffects';

interface GameBoardViewProps {
  session: GameSession;
  role: 'teacher' | 'student' | null;
  authUser: AuthUser;
  currentGroupId: string | null;
  contentStore: GameContentStore;
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onRequestConfirm: (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => Promise<void>;
  }) => void;
  onHome: () => void;
}

// 7x7 perimeter coordinates for the 24 tiles (0 to 23)
function getTileGridCoord(index: number): { row: number; col: number } {
  if (index >= 0 && index <= 6) {
    return { row: 6, col: index };
  } else if (index >= 7 && index <= 12) {
    return { row: 6 - (index - 6), col: 6 };
  } else if (index >= 13 && index <= 18) {
    return { row: 0, col: 6 - (index - 12) };
  } else {
    return { row: index - 18, col: 0 };
  }
}

export const GameBoardView: React.FC<GameBoardViewProps> = ({
  session,
  role,
  authUser,
  currentGroupId,
  contentStore,
  onNotify,
  onRequestConfirm,
  onHome,
}) => {
  const [activeTab, setActiveTab] = useState<'scoreboard' | 'events' | 'answers'>('scoreboard');
  const [isRolling, setIsRolling] = useState(false);
  const [animatingPawnGroupId, setAnimatingPawnGroupId] = useState<string | null>(null);
  const [displayPawnPositions, setDisplayPawnPositions] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const [id, grp] of Object.entries(session.groups)) {
      initial[id] = grp.pionPosition;
    }
    return initial;
  });
  const [activeModal, setActiveModal] = useState<'quiz' | 'material' | 'challenge' | 'bonus' | null>(null);
  const [quizResult, setQuizResult] = useState<{
    isCorrect: boolean;
    pointsAwarded: number;
    explanation: string;
    correctIndex: number;
  } | null>(null);
  const [challengeResult, setChallengeResult] = useState<{
    isCorrect: boolean;
    pointsAwarded: number;
    explanation: string;
  } | null>(null);

  const isLocalAnimatingRef = useRef(false);
  const lastAutoOpenedTurnRef = useRef<string | null>(null);

  // Sync displayed pawn positions when session changes (unless local animation is running)
  useEffect(() => {
    if (isLocalAnimatingRef.current || animatingPawnGroupId) return;
    const positions: Record<string, number> = {};
    for (const [id, grp] of Object.entries(session.groups)) {
      positions[id] = grp.pionPosition;
    }
    setDisplayPawnPositions(positions);
  }, [session.groups, animatingPawnGroupId]);

  // Clear stale modal & local result state when turn changes
  useEffect(() => {
    if (session.currentAction?.type === 'roll_dice') {
      setActiveModal(null);
      setQuizResult(null);
      setChallengeResult(null);
    }
  }, [session.turnNumber, session.currentAction?.type]);

  const currentGroup = session.currentTurnGroupId ? session.groups[session.currentTurnGroupId] : null;
  const isManager = authUser.role === 'admin' || authUser.role === 'moderator';
  const canManageSession = isManager || session.createdByUserId === authUser.id;

  // All logged-in users (admin, moderator, user) can roll dice when permitted:
  // - Admin / Moderator / Teacher host can roll any active turn
  // - Regular User can roll on their group's turn, or when on a shared board without locked group, or for groups they registered
  const isMyTurn =
    isManager ||
    role === 'teacher' ||
    currentGroupId === null ||
    session.currentTurnGroupId === currentGroupId ||
    currentGroup?.ownerUserId === authUser.id;

  const groupsList = Object.values(session.groups).sort((a, b) => b.score - a.score);

  // Step-by-step pawn hopping animation
  const animatePawnMovement = async (groupId: string, fromPos: number, toPos: number, diceVal: number) => {
    isLocalAnimatingRef.current = true;
    setAnimatingPawnGroupId(groupId);
    try {
      let currentStep = fromPos;
      for (let i = 0; i < diceVal; i++) {
        currentStep = (currentStep + 1) % 24;
        setDisplayPawnPositions((prev) => ({ ...prev, [groupId]: currentStep }));
        soundManager.playPawnMove();
        await new Promise((r) => setTimeout(r, 175));
      }
      setDisplayPawnPositions((prev) => ({ ...prev, [groupId]: toPos }));
    } finally {
      isLocalAnimatingRef.current = false;
      setAnimatingPawnGroupId(null);
    }
  };

  // Roll Dice handler
  const handleRollDice = async () => {
    if (!session.currentTurnGroupId || isRolling) return;
    const activeGrpId = session.currentTurnGroupId;
    const oldPos = session.groups[activeGrpId]?.pionPosition ?? 0;

    setIsRolling(true);
    setAnimatingPawnGroupId(activeGrpId);
    isLocalAnimatingRef.current = true;
    setQuizResult(null);
    setChallengeResult(null);

    try {
      const res = await apiClient.rollDice(session.id, activeGrpId);

      // Keep pawn at oldPos during step-by-step hop
      setDisplayPawnPositions((prev) => ({ ...prev, [activeGrpId]: oldPos }));
      await animatePawnMovement(activeGrpId, oldPos, res.newPosition, res.diceValue);

      lastAutoOpenedTurnRef.current = `${res.game.turnNumber}_${res.tile.type}`;

      // Automatically trigger modal based on landed tile
      setTimeout(() => {
        if (res.tile.type === 'quiz') {
          setActiveModal('quiz');
        } else if (res.tile.type === 'material') {
          setActiveModal('material');
        } else if (res.tile.type === 'challenge') {
          setActiveModal('challenge');
        } else if (res.tile.type === 'bonus') {
          setActiveModal('bonus');
        } else if (res.tile.type === 'start') {
          onNotify(
            'info',
            `${session.groups[activeGrpId]?.name || 'Pion'} mendarat di Kotak Start/Finish (#0) dengan dadu ${res.diceValue}.`
          );
        }
      }, 220);
    } catch (err: any) {
      isLocalAnimatingRef.current = false;
      setAnimatingPawnGroupId(null);
      onNotify('error', err.message || 'Gagal melempar dadu.');
    } finally {
      setIsRolling(false);
    }
  };

  // Submit Quiz Answer
  const handleSubmitQuizAnswer = async (selectedIndex: number) => {
    if (!session.currentAction?.contentId || !session.currentTurnGroupId) return;
    try {
      const res = await apiClient.submitQuizAnswer(
        session.id,
        session.currentTurnGroupId,
        session.currentAction.contentId,
        selectedIndex
      );
      if (res.isCorrect) {
        soundManager.playCorrectAnswer();
      } else {
        soundManager.playWrongAnswer();
      }
      setQuizResult(res);
    } catch (err: any) {
      onNotify('error', err.message || 'Gagal mengirimkan jawaban.');
    }
  };

  // Complete Challenge
  const handleCompleteChallenge = async (selectedOptionIndex: number) => {
    if (!session.currentAction?.contentId || !session.currentTurnGroupId) return;
    try {
      const res = await apiClient.completeChallenge(
        session.id,
        session.currentTurnGroupId,
        session.currentAction.contentId,
        selectedOptionIndex
      );
      if (res.isCorrect) {
        soundManager.playCorrectAnswer();
      } else {
        soundManager.playWrongAnswer();
      }
      setChallengeResult(res);
    } catch (err: any) {
      onNotify('error', err.message || 'Gagal menyelesaikan tantangan.');
    }
  };

  // Complete reading Material -> mark material read + advance turn while preserving pawn position!
  const handleCompleteMaterial = async () => {
    const activeGrpId = session.currentTurnGroupId;
    const contentId = session.currentAction?.contentId || '';
    const landedTile = currentGroup?.pionPosition ?? session.currentAction?.tileIndex ?? 0;

    setActiveModal(null);
    try {
      if (activeGrpId) {
        await apiClient.readMaterial(session.id, activeGrpId, contentId);
        await apiClient.nextTurn(session.id, activeGrpId, session.turnNumber);
        onNotify(
          'success',
          `Materi selesai dibaca. Pion ${currentGroup?.name || ''} tetap di Kotak #${landedTile} & giliran berlanjut.`
        );
      }
    } catch (err: any) {
      onNotify('error', err.message || 'Gagal melanjutkan alur permainan setelah materi.');
    }
  };

  // Next Turn (for Quiz, Challenge, Bonus, Start, or Force Next Turn)
  const handleNextTurn = async () => {
    setActiveModal(null);
    setQuizResult(null);
    setChallengeResult(null);
    try {
      await apiClient.nextTurn(
        session.id,
        session.currentTurnGroupId || undefined,
        session.turnNumber
      );
    } catch (err: any) {
      onNotify('error', err.message || 'Gagal beralih giliran.');
    }
  };

  // Manager / Host Controls
  const handleTogglePause = async () => {
    try {
      await apiClient.togglePauseGame(session.id);
    } catch (err: any) {
      onNotify('error', err.message || 'Gagal mengubah status permainan.');
    }
  };

  const handleEndGame = () => {
    onRequestConfirm({
      title: 'Akhiri Sesi Permainan?',
      message:
        'Apakah Anda yakin ingin mengakhiri permainan sekarang dan menampilkan podium pemenang?',
      confirmLabel: 'Ya, Akhiri Sesi',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await apiClient.endGame(session.id);
          onNotify('info', 'Sesi permainan telah diakhiri.');
        } catch (err: any) {
          onNotify('error', err.message || 'Gagal mengakhiri permainan.');
        }
      },
    });
  };

  const handleResetGame = async () => {
    onRequestConfirm({
      title: 'Reset Permainan ke Awal?',
      message: 'Reset permainan akan mengembalikan skor seluruh kelompok dan posisi pion ke Kotak #0. Lanjutkan?',
      confirmLabel: 'Reset Permainan',
      variant: 'warning',
      onConfirm: async () => {
        try {
          await apiClient.resetGame(session.id);
          onNotify('success', 'Permainan berhasil di-reset ke posisi awal.');
        } catch (err: any) {
          onNotify('error', err.message || 'Gagal mereset permainan.');
        }
      },
    });
  };

  // Current active tile info
  const activeTileIndex = session.currentAction?.tileIndex ?? currentGroup?.pionPosition ?? 0;
  const activeTile = BOARD_TILES[activeTileIndex] || BOARD_TILES[0];

  const actionType = session.currentAction?.type;

  return (
    <div className="max-w-[1400px] mx-auto py-2 px-2 sm:px-4 space-y-2.5">
      {/* Top Bar Status - Compact, High Impact */}
      <div className="bg-white border-2 border-sky-200 rounded-2xl p-2.5 sm:p-3 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-2.5 select-none">
        {/* Left: Active Turn Card */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md ring-3 ring-white transform hover:scale-105 transition-transform shrink-0"
            style={{ backgroundColor: currentGroup?.color || '#3b82f6' }}
          >
            {currentGroup?.name.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                Putaran #{session.turnNumber}
              </span>
              {session.status === 'paused' && (
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                  Permainan Dijeda
                </span>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                <Shield className="w-3 h-3 text-indigo-500" />
                {authUser.name} ({authUser.role})
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5 leading-tight">
              <span className="text-slate-600 font-bold">Giliran:</span>
              <span className="text-sky-700">{currentGroup?.name || 'Menunggu'}</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Posisi: Kotak #{currentGroup?.pionPosition ?? 0} ({activeTile.title})
            </p>
          </div>
        </div>

        {/* Center / Right: Quick Actions & Manager Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Open landed tile modal when not yet answered/completed */}
          {actionType &&
            actionType !== 'roll_dice' &&
            actionType !== 'waiting_next' &&
            !session.currentAction?.answered && (
              <button
                onClick={() => {
                  if (actionType === 'quiz') setActiveModal('quiz');
                  else if (actionType === 'material') setActiveModal('material');
                  else if (actionType === 'challenge') setActiveModal('challenge');
                  else if (actionType === 'bonus') setActiveModal('bonus');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>
                  {actionType === 'quiz'
                    ? 'Buka Kuis Fisika (+10 Pts)'
                    : actionType === 'material'
                    ? 'Buka Materi Pembelajaran'
                    : actionType === 'challenge'
                    ? 'Buka Misi Tantangan'
                    : 'Lihat Bonus Foton (+20 Pts)'}
                </span>
              </button>
            )}

          {session.currentAction?.answered && isMyTurn && (
            <button
              onClick={handleNextTurn}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Selesai &amp; Giliran Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Host / Manager Quick Controls */}
          {canManageSession && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={handleTogglePause}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title={session.status === 'paused' ? 'Lanjutkan Permainan' : 'Jeda Permainan'}
              >
                {session.status === 'paused' ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span className="hidden sm:inline">Lanjut</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    <span className="hidden sm:inline">Jeda</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNextTurn}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Lanjut ke giliran kelompok berikutnya"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Giliran Berikutnya</span>
              </button>

              <button
                onClick={handleEndGame}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                title="Akhiri permainan dan buka podium pemenang"
              >
                <span>Akhiri Sesi</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main One-Screen Playfield: 24-Tile Board + Side Scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Left 8 Cols: Colorful 24-Tile Board (7x7 Perimeter Grid) */}
        <div className="lg:col-span-8 bg-gradient-to-tr from-sky-50 via-white to-amber-50 border-3 border-sky-300 rounded-3xl p-1.5 sm:p-3 shadow-xl flex items-center justify-center select-none overflow-hidden">
          <div className="aspect-square w-full max-w-[660px] grid grid-cols-7 grid-rows-7 gap-1 sm:gap-1.5 relative">
            {/* 24 Perimeter Tiles */}
            {BOARD_TILES.map((tile) => {
              const { row, col } = getTileGridCoord(tile.index);
              const isActive = activeTileIndex === tile.index;

              const occupants = Object.values(session.groups).filter(
                (g) => (displayPawnPositions[g.id] ?? g.pionPosition) === tile.index
              );

              let tileTheme = 'bg-white border-slate-200 text-slate-800';
              let badgeColor = 'bg-slate-100 text-slate-700';

              if (tile.type === 'start') {
                tileTheme = 'bg-gradient-to-br from-rose-50 to-red-100 border-rose-400 text-rose-900';
                badgeColor = 'bg-rose-500 text-white';
              } else if (tile.type === 'quiz') {
                tileTheme = 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-400 text-amber-900';
                badgeColor = 'bg-amber-500 text-slate-950 font-black';
              } else if (tile.type === 'material') {
                tileTheme = 'bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-400 text-purple-900';
                badgeColor = 'bg-purple-600 text-white font-bold';
              } else if (tile.type === 'challenge') {
                tileTheme = 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-400 text-orange-900';
                badgeColor = 'bg-orange-500 text-white font-bold';
              } else if (tile.type === 'bonus') {
                tileTheme = 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-400 text-emerald-900';
                badgeColor = 'bg-emerald-600 text-white font-black';
              }

              return (
                <div
                  key={tile.index}
                  style={{
                    gridRowStart: row + 1,
                    gridColumnStart: col + 1,
                  }}
                  className={`rounded-lg sm:rounded-2xl p-0.5 sm:p-1.5 flex flex-col justify-between border-2 transition-all duration-300 relative select-none shadow-sm ${tileTheme} ${
                    isActive
                      ? 'ring-3 ring-amber-400 scale-[1.03] z-20 shadow-lg shadow-amber-400/30'
                      : 'hover:scale-[1.01]'
                  }`}
                >
                  {/* Tile Header: Index + Category Badge */}
                  <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-black leading-none">
                    <span className={`px-1 sm:px-1.5 py-0.5 rounded-md font-mono shadow-xs ${badgeColor}`}>
                      #{tile.index}
                    </span>

                    <span className="text-[8px] sm:text-[9px] uppercase tracking-tighter opacity-80 hidden sm:inline">
                      {tile.type === 'quiz'
                        ? 'Kuis'
                        : tile.type === 'material'
                        ? 'Materi'
                        : tile.type === 'challenge'
                        ? 'Tantang'
                        : tile.type === 'bonus'
                        ? 'Bonus'
                        : 'Start'}
                    </span>
                  </div>

                  {/* Tile Title */}
                  <div className="my-auto py-0.5 text-center leading-tight">
                    <h4 className="text-[8px] sm:text-[11px] font-black leading-tight line-clamp-2">
                      {tile.title}
                    </h4>
                  </div>

                  {/* Occupants Pawns Container */}
                  <div className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1 min-h-[14px] sm:min-h-[22px]">
                    {occupants.map((occ) => {
                      const isCurrentActive = occ.id === session.currentTurnGroupId;
                      return (
                        <div
                          key={occ.id}
                          style={{ backgroundColor: occ.color }}
                          className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[7px] sm:text-[10px] font-black text-white shadow-md ring-1 sm:ring-2 ring-white transition-all transform ${
                            isCurrentActive
                              ? 'scale-120 ring-2 ring-amber-400 animate-bounce z-10'
                              : ''
                          }`}
                          title={`${occ.name} (Kotak #${displayPawnPositions[occ.id] ?? occ.pionPosition} • Skor: ${occ.score} pts)`}
                        >
                          {occ.name.charAt(0).toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Center Area (5x5 Grid Space - Board Interior) */}
            <div
              style={{
                gridRow: '2 / span 5',
                gridColumn: '2 / span 5',
              }}
              className="rounded-xl sm:rounded-3xl bg-gradient-to-b from-sky-50 via-white to-indigo-50 border-2 border-sky-200 p-1.5 sm:p-4 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-inner select-none"
            >
              {/* Center Board Title */}
              <div className="space-y-0.5 z-10">
                <span className="text-[8px] sm:text-xs font-black uppercase tracking-widest text-indigo-700 block">
                  MONOPOLY FISIKA • 24 KOTAK
                </span>
                <h3 className="text-xs sm:text-2xl font-black text-slate-900 leading-tight">
                  Cahaya &amp; Alat Optik
                </h3>
              </div>

              {/* 3D Animated Dice Roller in Center */}
              <div className="my-auto z-10 py-0.5">
                <DiceRoller
                  currentValue={session.currentAction?.diceValue || null}
                  isRolling={isRolling}
                  canRoll={
                    session.status === 'playing' &&
                    isMyTurn &&
                    session.currentAction?.type === 'roll_dice'
                  }
                  onRoll={handleRollDice}
                />
              </div>

              {/* Active Tile Card & Instructions */}
              <div className="w-full z-10 space-y-1">
                <div className="bg-white/90 border border-sky-300 rounded-lg sm:rounded-xl p-1 sm:p-2 text-xs text-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-bold">
                    <span className="text-slate-500">Kotak #{activeTile.index}:</span>
                    <span className="text-amber-700 font-black truncate ml-1">{activeTile.title}</span>
                  </div>
                  <p className="text-[9px] sm:text-[11px] text-slate-600 truncate font-medium hidden sm:block">
                    {activeTile.subtitle} • {activeTile.topic}
                  </p>
                </div>

                {/* Instruction Banner */}
                <div className="text-[9px] sm:text-[11px] font-bold text-center leading-tight">
                  {session.status !== 'playing' ? (
                    <span className="text-amber-800">Permainan sedang dijeda.</span>
                  ) : !isMyTurn ? (
                    <span className="text-slate-600">
                      Giliran <strong className="text-sky-700">{currentGroup?.name || 'kelompok'}</strong>...
                    </span>
                  ) : session.currentAction?.type === 'roll_dice' ? (
                    <span className="text-emerald-700 animate-pulse">
                      Siap! Klik <strong>Lempar Dadu</strong> untuk melangkah.
                    </span>
                  ) : session.currentAction?.answered ? (
                    <span className="text-sky-700">
                      Selesai! Klik <strong>Selesai &amp; Giliran Berikutnya</strong>.
                    </span>
                  ) : (
                    <span className="text-indigo-700">
                      Pion berhenti di #{activeTile.index}. Buka panel kotak!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Scoreboard / Feed / Answers Log */}
        <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-3xl p-3 sm:p-4 space-y-3 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            {/* Tabs Header */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
              <button
                onClick={() => setActiveTab('scoreboard')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'scoreboard'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Papan Skor
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'events'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aktivitas
              </button>
              <button
                onClick={() => setActiveTab('answers')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'answers'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Jawaban
              </button>
            </div>

            {/* Tab 1: Real-time Scoreboard */}
            {activeTab === 'scoreboard' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-slate-700 uppercase tracking-wider">
                    Peringkat Kelompok ({groupsList.length}):
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync
                  </span>
                </div>

                <div className="space-y-2 max-h-[360px] sm:max-h-[450px] overflow-y-auto pr-1">
                  {groupsList.map((grp, idx) => {
                    const isCurrent = grp.id === session.currentTurnGroupId;
                    const isMyGroup = grp.id === currentGroupId;
                    const livePos = displayPawnPositions[grp.id] ?? grp.pionPosition;

                    return (
                      <div
                        key={grp.id}
                        className={`p-3 rounded-2xl border-2 transition-all shadow-xs ${
                          isCurrent
                            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-400 ring-2 ring-amber-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-xs ${
                                idx === 0
                                  ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-500'
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
                              className="w-3.5 h-3.5 rounded-full shrink-0 border border-white shadow-xs"
                              style={{ backgroundColor: grp.color }}
                            />

                            <div className="min-w-0">
                              <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate flex items-center gap-1">
                                <span>{grp.name}</span>
                                {isMyGroup && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                                    Kelompok Anda
                                  </span>
                                )}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium">
                                Kotak #{livePos} • Benar: {grp.correctAnswersCount} / Salah: {grp.wrongAnswersCount}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-lg font-black text-amber-600">
                              {grp.score} <span className="text-[10px] font-bold text-slate-500">pts</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-200/80 text-[10px] text-slate-600 font-semibold">
                          <span>Kuis: <strong className="text-slate-900">{grp.quizPoints}</strong></span>
                          <span>•</span>
                          <span>Bonus: <strong className="text-emerald-700">{grp.bonusPoints}</strong></span>
                          <span>•</span>
                          <span>Misi: <strong className="text-purple-700">{grp.challengePoints}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Activity Events Log */}
            {activeTab === 'events' && (
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Riwayat Aksi Real-time:
                </span>
                <div className="space-y-2 max-h-[360px] sm:max-h-[450px] overflow-y-auto pr-1">
                  {session.events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                        <span className="font-bold text-slate-800">{evt.groupName}</span>
                        <span>{new Date(evt.timestamp).toLocaleTimeString('id-ID')}</span>
                      </div>
                      <p className="text-slate-800 font-medium leading-snug">{evt.description}</p>
                      {evt.pointsAwarded !== undefined && evt.pointsAwarded > 0 && (
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-300">
                          +{evt.pointsAwarded} Poin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Answers Log */}
            {activeTab === 'answers' && (
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Rekap Jawaban Kuis ({Object.keys(session.answers).length}):
                </span>
                <div className="space-y-2 max-h-[360px] sm:max-h-[450px] overflow-y-auto pr-1">
                  {Object.keys(session.answers).length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-8 text-center font-medium">
                      Belum ada kuis yang dijawab pada sesi ini.
                    </p>
                  ) : (
                    Object.values(session.answers)
                      .sort((a, b) => b.answeredAt - a.answeredAt)
                      .map((ans) => (
                        <div
                          key={ans.id}
                          className={`p-2.5 rounded-2xl border text-xs space-y-1 shadow-xs ${
                            ans.isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-rose-50 border-rose-300 text-rose-900'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-black">
                            <span>{ans.groupName}</span>
                            <span className={ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                              {ans.isCorrect ? '+10 Poin' : '+0 Poin'}
                            </span>
                          </div>
                          <p className="font-bold text-slate-900">{ans.questionTitle}</p>
                          <p className="text-[11px] text-slate-600 font-medium">
                            Pilihan: <strong className="text-slate-800">{ans.selectedAnswer}</strong>
                          </p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick TV / Fullscreen Helper Button at bottom */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>MONOFIS v2.1 • Real-Time</span>
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="flex items-center gap-1 text-sky-700 font-bold hover:underline cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Layar TV / Proyektor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up Modals for interactive tile action */}
      {activeModal === 'quiz' && session.currentAction?.contentId && (
        <QuizModal
          quiz={contentStore.quizzes[session.currentAction.contentId]}
          tileIndex={session.currentAction.tileIndex}
          groupName={currentGroup?.name || 'Kelompok'}
          isMyTurn={isMyTurn}
          isAnswered={!!session.currentAction.answered}
          resultData={quizResult}
          onSubmitAnswer={handleSubmitQuizAnswer}
          onNextTurn={handleNextTurn}
          onDismiss={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'material' && session.currentAction?.contentId && (
        <MaterialModal
          material={contentStore.materials[session.currentAction.contentId]}
          tileIndex={session.currentAction.tileIndex}
          groupName={currentGroup?.name || 'Kelompok'}
          isMyTurn={isMyTurn}
          onComplete={handleCompleteMaterial}
          onDismiss={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'challenge' && session.currentAction?.contentId && (
        <ChallengeModal
          challenge={contentStore.challenges[session.currentAction.contentId]}
          tileIndex={session.currentAction.tileIndex}
          groupName={currentGroup?.name || 'Kelompok'}
          isMyTurn={isMyTurn}
          isCompleted={!!session.currentAction.answered}
          resultData={challengeResult}
          onComplete={handleCompleteChallenge}
          onNextTurn={handleNextTurn}
          onDismiss={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'bonus' && (
        <BonusModal
          groupName={currentGroup?.name || 'Kelompok'}
          points={20}
          isMyTurn={isMyTurn}
          onNextTurn={handleNextTurn}
          onDismiss={() => setActiveModal(null)}
        />
      )}

      {/* Game Finished Modal */}
      {session.status === 'finished' && (
        <GameOverModal
          session={session}
          onReset={handleResetGame}
          onHome={onHome}
        />
      )}
    </div>
  );
};
