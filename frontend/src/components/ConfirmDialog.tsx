'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Trash2, Info, HelpCircle, X } from 'lucide-react';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmState extends ConfirmOptions {
  id: string;
  resolve: (value: boolean) => void;
}

type ConfirmListener = (state: ConfirmState | null) => void;

class ConfirmManager {
  private currentState: ConfirmState | null = null;
  private listeners: Set<ConfirmListener> = new Set();

  subscribe(listener: ConfirmListener) {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentState));
  }

  ask(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const id = Math.random().toString(36).substring(2, 9);
      this.currentState = {
        ...options,
        id,
        resolve: (value: boolean) => {
          this.currentState = null;
          this.notify();
          resolve(value);
        },
      };
      this.notify();
    });
  }

  closeCurrent(result: boolean) {
    if (this.currentState) {
      const { resolve } = this.currentState;
      this.currentState = null;
      this.notify();
      resolve(result);
    }
  }
}

export const confirmManager = new ConfirmManager();

export const showConfirm = (options: ConfirmOptions | string): Promise<boolean> => {
  if (typeof options === 'string') {
    return confirmManager.ask({
      title: 'Xác Nhận Thao Tác',
      message: options,
      confirmText: 'Đồng Ý',
      cancelText: 'Hủy Bỏ',
      type: 'warning',
    });
  }
  return confirmManager.ask({
    title: options.title || 'Xác Nhận Thao Tác',
    confirmText: options.confirmText || 'Xác Nhận',
    cancelText: options.cancelText || 'Hủy Bỏ',
    type: options.type || 'warning',
    message: options.message,
  });
};

export function ConfirmDialogContainer() {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  useEffect(() => {
    return confirmManager.subscribe((state) => {
      setConfirmState(state);
    });
  }, []);

  const handleCancel = useCallback(() => {
    confirmManager.closeCurrent(false);
  }, []);

  const handleConfirm = useCallback(() => {
    confirmManager.closeCurrent(true);
  }, []);

  useEffect(() => {
    if (!confirmState) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmState, handleCancel, handleConfirm]);

  if (!confirmState) return null;

  const isDanger = confirmState.type === 'danger';
  const isWarning = confirmState.type === 'warning';

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-xs flex items-start justify-center pt-[10vh] p-4 animate-in fade-in duration-200"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-[#111928] border border-slate-200 dark:border-[#1e2d45] rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isDanger
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                : isWarning
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                : 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60'
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-5 h-5" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <HelpCircle className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {confirmState.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed break-words">
              {confirmState.message}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1e2d45] transition cursor-pointer shrink-0"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1e2d45]">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 py-2 min-h-[40px] rounded-xl border border-slate-200 dark:border-[#1e2d45] bg-slate-100 hover:bg-slate-200 dark:bg-[#162032] dark:hover:bg-[#1e2d45] text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer flex items-center justify-center"
          >
            {confirmState.cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            autoFocus
            className={`w-full sm:w-auto px-5 py-2 min-h-[40px] rounded-xl text-white text-xs font-bold transition shadow-sm flex items-center justify-center cursor-pointer ${
              isDanger
                ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-95 shadow-rose-600/20'
                : isWarning
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 shadow-amber-500/20'
                : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 shadow-teal-600/20'
            }`}
          >
            {confirmState.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
