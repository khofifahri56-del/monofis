/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastItem } from '../types/game';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[80] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
    >
      {toasts.map((toast) => {
        const style =
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
            : toast.type === 'error'
            ? 'bg-rose-50 border-rose-400 text-rose-950'
            : 'bg-sky-50 border-sky-400 text-sky-950';

        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : Info;

        const iconColor =
          toast.type === 'success'
            ? 'text-emerald-600'
            : toast.type === 'error'
            ? 'text-rose-600'
            : 'text-sky-600';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-2xl border-2 shadow-xl backdrop-blur-sm text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200 ${style}`}
          >
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
