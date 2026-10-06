'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  show(
    type: ToastType,
    message: string,
    title?: string,
    duration: number = 2200,
    icon?: React.ComponentType<{ className?: string }>
  ) {
    const id = Math.random().toString(36).substring(2, 9) + Date.now();
    const newToast: ToastItem = { id, type, message, title, duration, icon };
    this.toasts = [newToast, ...this.toasts].slice(0, 5); // Tối đa 5 toast cùng lúc
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastManager = new ToastManager();

export const toast = {
  success: (
    message: string,
    title: string = 'Thành công',
    duration: number = 2200,
    icon?: React.ComponentType<{ className?: string }>
  ) => toastManager.show('success', message, title, duration, icon),
  error: (
    message: string,
    title: string = 'Lỗi',
    duration: number = 2200,
    icon?: React.ComponentType<{ className?: string }>
  ) => toastManager.show('error', message, title, duration, icon),
  warning: (
    message: string,
    title: string = 'Thông báo',
    duration: number = 2500,
    icon?: React.ComponentType<{ className?: string }>
  ) => toastManager.show('warning', message, title, duration, icon),
  info: (
    message: string,
    title: string = 'Thông tin',
    duration: number = 2200,
    icon?: React.ComponentType<{ className?: string }>
  ) => toastManager.show('info', message, title, duration, icon),
  dismiss: (id: string) => toastManager.dismiss(id),
};

// Ghi đè window.alert để không bao giờ xuất hiện hộp thoại xám xịt mặc định của trình duyệt
if (typeof window !== 'undefined') {
  (window as any).etcToast = toast;
  window.alert = (message?: any) => {
    toast.warning(String(message ?? ''));
  };
}

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    border: 'border-emerald-500/40 dark:border-emerald-500/30',
    glow: 'shadow-[0_8px_30px_rgb(16,185,129,0.15)]',
    progressBar: 'bg-emerald-500',
    titleColor: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    icon: AlertCircle,
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    border: 'border-rose-500/40 dark:border-rose-500/30',
    glow: 'shadow-[0_8px_30px_rgb(244,63,94,0.15)]',
    progressBar: 'bg-rose-500',
    titleColor: 'text-rose-600 dark:text-rose-400',
  },
  warning: {
    icon: AlertTriangle,
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    border: 'border-amber-500/40 dark:border-amber-500/30',
    glow: 'shadow-[0_8px_30px_rgb(245,158,11,0.15)]',
    progressBar: 'bg-amber-500',
    titleColor: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    icon: Info,
    badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    border: 'border-teal-500/40 dark:border-teal-500/30',
    glow: 'shadow-[0_8px_30px_rgb(20,184,166,0.15)]',
    progressBar: 'bg-teal-500',
    titleColor: 'text-teal-600 dark:text-teal-400',
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Thông báo hệ thống"
      className="fixed top-4 right-4 left-4 sm:left-auto z-[99999] flex flex-col gap-2.5 sm:max-w-sm pointer-events-none"
    >
      {toasts.map((t) => {
        const config = TYPE_CONFIG[t.type] || TYPE_CONFIG.info;
        const IconComponent = t.icon || config.icon;

        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto relative overflow-hidden rounded-xl bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border ${config.border} ${config.glow} p-3.5 shadow-xl transition-all duration-300 animate-in slide-in-from-top-2 fade-in`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-1.5 rounded-lg border shrink-0 ${config.badgeBg}`}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                {t.title && (
                  <h5
                    className={`text-xs font-bold leading-tight ${config.titleColor}`}
                  >
                    {t.title}
                  </h5>
                )}
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5 leading-relaxed break-words font-medium">
                  {t.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toastManager.dismiss(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 cursor-pointer"
                title="Đóng"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtle countdown progress line */}
            {t.duration && t.duration > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${config.progressBar}`}
                  style={{
                    animation: `toastProgress ${t.duration}ms linear forwards`,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
