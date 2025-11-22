/**
 * Toast Notification System
 * Beautiful, accessible toast notifications with variants
 * Auto-dismiss, stackable, with smooth animations
 */

'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Toast types
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, variant: ToastVariant, duration?: number) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook to use toast notifications
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// Toast Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant, duration = 5000) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast: Toast = { id, message, variant, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods
  const toast = {
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// Toast Container - renders all toasts
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          index={index}
        />
      ))}
    </div>
  );
}

// Individual Toast Item
function ToastItem({
  toast,
  onRemove,
  index
}: {
  toast: Toast;
  onRemove: (id: string) => void;
  index: number;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 200); // Match animation duration
  };

  // Touch handlers for swipe-to-dismiss
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      handleRemove();
    }
  };

  // Get icon and colors based on variant
  const getToastStyles = () => {
    switch (toast.variant) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          bgClass: 'bg-[var(--color-success-light)] dark:bg-[var(--color-success-dark)]',
          textClass: 'text-[var(--color-success-dark)] dark:text-white',
          borderClass: 'border-[var(--color-success)]',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgClass: 'bg-[var(--color-error-light)] dark:bg-[var(--color-error-dark)]',
          textClass: 'text-[var(--color-error-dark)] dark:text-white',
          borderClass: 'border-[var(--color-error)]',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgClass: 'bg-[var(--color-warning-light)] dark:bg-[var(--color-warning-dark)]',
          textClass: 'text-[var(--color-warning-dark)] dark:text-white',
          borderClass: 'border-[var(--color-warning)]',
        };
      case 'info':
        return {
          icon: <Info className="w-5 h-5" />,
          bgClass: 'bg-[var(--color-info-light)] dark:bg-[var(--color-info-dark)]',
          textClass: 'text-[var(--color-info-dark)] dark:text-white',
          borderClass: 'border-[var(--color-info)]',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      role="alert"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        animation: isExiting
          ? 'slideOutRight 0.2s ease-out forwards'
          : 'slideInRight 0.3s ease-out forwards',
        animationDelay: isExiting ? '0ms' : `${index * 50}ms`,
      }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-xl
        ${styles.bgClass} ${styles.borderClass}
        backdrop-blur-md
        transition-all duration-200
        cursor-pointer
        max-w-md w-full
      `}
    >
      {/* Icon */}
      <div className={styles.textClass}>
        {styles.icon}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-relaxed ${styles.textClass}`}>
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleRemove}
        className={`
          flex-shrink-0 p-1 rounded-md
          ${styles.textClass}
          hover:bg-black/10 dark:hover:bg-white/10
          transition-colors
        `}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Add animations to global styles (these will be in globals.css but defining here for reference)
// @keyframes slideInRight {
//   from {
//     opacity: 0;
//     transform: translateX(100%);
//   }
//   to {
//     opacity: 1;
//     transform: translateX(0);
//   }
// }

// @keyframes slideOutRight {
//   from {
//     opacity: 1;
//     transform: translateX(0);
//   }
//   to {
//     opacity: 0;
//     transform: translateX(100%);
//   }
// }
