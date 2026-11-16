/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Trash2, RefreshCw, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const borderClass =
    variant === 'danger'
      ? 'border-rose-300'
      : variant === 'warning'
      ? 'border-amber-300'
      : 'border-indigo-300';

  const iconWrapClass =
    variant === 'danger'
      ? 'bg-rose-100 text-rose-600'
      : variant === 'warning'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-indigo-100 text-indigo-700';

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
      : variant === 'warning'
      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20';

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white border-2 ${borderClass} rounded-3xl max-w-md w-full p-5 sm:p-6 text-slate-900 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconWrapClass}`}>
              {variant === 'danger' ? (
                <Trash2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer disabled:opacity-50"
            aria-label="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{message}</p>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${confirmBtnClass}`}
          >
            {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isLoading ? 'Memproses...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
