/**
 * Badge Component
 * Small labels for categories, status, counts, etc.
 * Multiple variants and sizes with optional remove functionality
 */

'use client';

import { X } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean; // Show colored dot instead of full background
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = '',
  ...props
}: BadgeProps) {
  // Base classes
  const baseClasses = 'badge';

  // Variant classes
  const variantClasses = {
    default: 'badge-secondary',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: '', // default from globals.css
    lg: 'text-sm px-4 py-1.5',
  };

  // Dot variant (small colored circle with text)
  if (dot) {
    const dotColors = {
      default: 'bg-[var(--color-secondary-500)]',
      primary: 'bg-[var(--accent-primary)]',
      secondary: 'bg-[var(--color-secondary-500)]',
      success: 'bg-[var(--color-success)]',
      warning: 'bg-[var(--color-warning)]',
      error: 'bg-[var(--color-error)]',
      info: 'bg-[var(--color-info)]',
    };

    return (
      <span className={`inline-flex items-center gap-2 ${className}`} {...props}>
        <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`} />
        <span className="text-sm font-medium">{children}</span>
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 p-0.5 rounded-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  }

  // Regular badge
  const badgeClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses} {...props}>
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

/**
 * Live Badge - Animated "LIVE" indicator
 */
export function LiveBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`badge badge-live ${className}`}>
      <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
      LIVE
    </span>
  );
}

/**
 * Count Badge - For notification counts, etc.
 */
export function CountBadge({ count, max = 99, className = '' }: { count: number; max?: number; className?: string }) {
  const displayCount = count > max ? `${max}+` : count.toString();

  if (count === 0) return null;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[1.25rem] h-5 px-1.5
        text-xs font-bold
        bg-[var(--accent-danger)] text-white
        rounded-full
        ${className}
      `}
    >
      {displayCount}
    </span>
  );
}
