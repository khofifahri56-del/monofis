/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface DiceRollerProps {
  currentValue: number | null;
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  currentValue,
  isRolling,
  canRoll,
  onRoll,
}) => {
  const [internalRolling, setInternalRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState<number>(currentValue || 1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!internalRolling && !isRolling && currentValue) {
      setDisplayValue(currentValue);
    }
  }, [currentValue, internalRolling, isRolling]);

  const handleClick = () => {
    if (!canRoll || isRolling || internalRolling) return;
    setInternalRolling(true);
    soundManager.playDiceRoll();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let flips = 0;
    intervalRef.current = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
      flips++;
      if (flips >= 8) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setInternalRolling(false);
        onRoll();
      }
    }, 65);
  };

  const rollingNow = isRolling || internalRolling;
  const activeValue = rollingNow ? displayValue : currentValue ?? displayValue;

  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
      {/* 3D Dice Box */}
      <div
        className={`w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-50 to-white text-slate-900 border-4 border-amber-300 shadow-2xl flex items-center justify-center relative select-none transition-transform duration-200 ${
          rollingNow
            ? 'animate-bounce scale-110 shadow-amber-400/60 rotate-12'
            : 'hover:scale-105'
        }`}
        style={{
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.9)',
        }}
      >
        {/* Render dots for 1-6 */}
        <div className="w-full h-full p-2.5 sm:p-3 grid grid-cols-3 grid-rows-3 gap-1 pointer-events-none">
          {activeValue === 1 && (
            <div className="col-start-2 row-start-2 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-rose-600 m-auto shadow-inner" />
          )}

          {activeValue === 2 && (
            <>
              <div className="col-start-1 row-start-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-3 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
            </>
          )}

          {activeValue === 3 && (
            <>
              <div className="col-start-1 row-start-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-2 row-start-2 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-3 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
            </>
          )}

          {activeValue === 4 && (
            <>
              <div className="col-start-1 row-start-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-1 row-start-3 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-3 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
            </>
          )}

          {activeValue === 5 && (
            <>
              <div className="col-start-1 row-start-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-2 row-start-2 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-1 row-start-3 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-3 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
            </>
          )}

          {activeValue === 6 && (
            <>
              <div className="col-start-1 row-start-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-1 row-start-2 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-2 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-1 row-start-3 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
              <div className="col-start-3 row-start-3 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-900 m-auto" />
            </>
          )}
        </div>
      </div>

      {/* Numeric Roll Result Pill */}
      {!rollingNow && currentValue && (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-xs font-black">
          Angka Dadu: {currentValue}
        </span>
      )}

      {/* Roll Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={!canRoll || rollingNow}
        className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-950 font-black text-[11px] sm:text-sm shadow-lg shadow-amber-500/20 uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{rollingNow ? 'Mengocok...' : 'Lempar Dadu'}</span>
      </button>
    </div>
  );
};
