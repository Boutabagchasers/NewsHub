/**
 * Button Component
 * Professional, accessible button with multiple variants and sizes
 * Supports loading states, icons, and full customization
 */

'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base button classes
    const baseClasses = 'btn';

    // Variant classes
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      danger: 'btn-danger',
    };

    // Size classes
    const sizeClasses = {
      xs: 'btn-sm text-xs px-3 py-1.5',
      sm: 'btn-sm',
      md: '', // default size
      lg: 'btn-lg',
      xl: 'btn-lg text-lg px-10 py-5',
    };

    // Combine classes
    const buttonClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && <span>{leftIcon}</span>}

        {/* Button text */}
        <span>
          {isLoading && loadingText ? loadingText : children}
        </span>

        {/* Right icon */}
        {!isLoading && rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Icon Button Component
 * Square button for icons only
 */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  isLoading?: boolean;
  'aria-label': string; // Required for accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'ghost',
      size = 'md',
      icon,
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Variant classes
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      danger: 'btn-danger',
    };

    // Size classes
    const sizeClasses = {
      sm: 'btn-icon-sm',
      md: 'btn-icon',
      lg: 'btn-icon-lg',
    };

    const buttonClasses = [
      'btn',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
