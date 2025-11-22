/**
 * Progress Component - V2.0
 * Progress indicators and loading spinners
 * Features: Circular spinner, linear progress bar, determinate/indeterminate modes
 */

'use client';

import { ReactNode } from 'react';

export interface ProgressProps {
  value?: number; // 0-100 for determinate, undefined for indeterminate
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

/**
 * LinearProgress - Horizontal progress bar
 */
export function LinearProgress({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  className = '',
}: ProgressProps) {
  const percentage = value !== undefined ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const isIndeterminate = value === undefined;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  const colorVars = {
    primary: 'var(--accent-primary)',
    secondary: 'var(--text-secondary)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              {label}
            </span>
          )}
          {showLabel && !isIndeterminate && (
            <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full rounded-full overflow-hidden ${sizeClasses[size]}`}
        style={{ background: 'var(--background-subtle)' }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={!isIndeterminate ? value : undefined}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isIndeterminate ? 'animate-progress-indeterminate' : ''
          }`}
          style={{
            width: isIndeterminate ? '30%' : `${percentage}%`,
            background: colorVars[variant],
          }}
        />
      </div>
    </div>
  );
}

/**
 * Spinner - Circular loading spinner
 */
export function Spinner({ size = 'md', variant = 'primary', className = '' }: SpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const borderSizes = {
    xs: '2px',
    sm: '2px',
    md: '3px',
    lg: '3px',
    xl: '4px',
  };

  const colorVars = {
    primary: 'var(--accent-primary)',
    secondary: 'var(--text-secondary)',
    white: '#ffffff',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} animate-spin rounded-full`}
      style={{
        border: `${borderSizes[size]} solid var(--background-subtle)`,
        borderTopColor: colorVars[variant],
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * CircularProgress - Circular progress indicator with percentage
 */
export function CircularProgress({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = true,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: { dimension: 48, stroke: 4, fontSize: 'text-xs' },
    md: { dimension: 64, stroke: 5, fontSize: 'text-sm' },
    lg: { dimension: 96, stroke: 6, fontSize: 'text-base' },
    xl: { dimension: 128, stroke: 7, fontSize: 'text-lg' },
  };

  const config = sizes[size];
  const center = config.dimension / 2;
  const radius = center - config.stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorVars = {
    primary: 'var(--accent-primary)',
    secondary: 'var(--text-secondary)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg
        width={config.dimension}
        height={config.dimension}
        className="transform -rotate-90"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--background-subtle)"
          strokeWidth={config.stroke}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colorVars[variant]}
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: 'var(--foreground)' }}
        >
          <span className={`font-bold ${config.fontSize}`}>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

/**
 * LoadingSpinner - Full-page or section loading spinner with optional text
 */
export function LoadingSpinner({
  text,
  size = 'lg',
  fullPage = false,
  className = '',
}: {
  text?: string;
  size?: SpinnerProps['size'];
  fullPage?: boolean;
  className?: string;
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <Spinner size={size} variant="primary" />
      {text && (
        <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: 'var(--background-primary)' }}
      >
        {content}
      </div>
    );
  }

  return content;
}

/**
 * ProgressSteps - Multi-step progress indicator
 */
export function ProgressSteps({
  steps,
  currentStep,
  variant = 'primary',
  orientation = 'horizontal',
  className = '',
}: {
  steps: Array<{ id: string; label: string; description?: string }>;
  currentStep: string;
  variant?: 'primary' | 'success';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  const colorVars = {
    primary: 'var(--accent-primary)',
    success: 'var(--color-success)',
  };

  return (
    <div
      className={`flex ${orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col'} ${className}`}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div
            key={step.id}
            className={`flex ${orientation === 'horizontal' ? 'flex-col items-center' : 'flex-row items-start'} ${
              orientation === 'horizontal' && index < steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`flex items-center ${orientation === 'horizontal' ? 'w-full' : 'flex-col'}`}
            >
              {/* Step Circle */}
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                  transition-all flex-shrink-0
                `}
                style={{
                  background:
                    isCompleted || isCurrent ? colorVars[variant] : 'var(--background-subtle)',
                  color: isCompleted || isCurrent ? 'white' : 'var(--text-tertiary)',
                }}
              >
                {isCompleted ? '✓' : index + 1}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    ${orientation === 'horizontal' ? 'flex-1 h-0.5 mx-2' : 'w-0.5 h-8 mx-4 my-2'}
                  `}
                  style={{
                    background: isCompleted ? colorVars[variant] : 'var(--background-subtle)',
                  }}
                />
              )}
            </div>

            {/* Step Label */}
            <div
              className={`${orientation === 'horizontal' ? 'mt-2 text-center' : 'ml-4'} ${
                orientation === 'vertical' && index < steps.length - 1 ? 'mb-4' : ''
              }`}
            >
              <div
                className="text-sm font-medium"
                style={{
                  color: isCurrent ? 'var(--foreground)' : 'var(--text-secondary)',
                }}
              >
                {step.label}
              </div>
              {step.description && (
                <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * SkeletonLoader - Skeleton loading placeholder
 */
export function SkeletonLoader({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}: {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}) {
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'rounded-lg h-48',
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`animate-pulse ${variantClasses[variant]} ${className}`}
      style={{
        background: 'var(--background-subtle)',
        width: width || (variant === 'circle' ? height : '100%'),
        height: height || (variant === 'text' ? '1rem' : variant === 'circle' ? width : undefined),
      }}
    />
  ));

  return count > 1 ? <div className="space-y-3">{skeletons}</div> : <>{skeletons}</>;
}
