/**
 * Card Component - V2.0
 * Base card component for content containers
 * Features: Multiple variants, interactive states, headers/footers
 */

'use client';

import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: {
      background: 'var(--background-elevated)',
      border: '1px solid var(--border-primary)',
    },
    elevated: {
      background: 'var(--background-elevated)',
      boxShadow: 'var(--shadow-sm)',
    },
    bordered: {
      background: 'var(--background-primary)',
      border: '2px solid var(--border-primary)',
    },
    flat: {
      background: 'var(--background-subtle)',
    },
  };

  const Component = clickable || onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        rounded-lg transition-all
        ${paddingClasses[padding]}
        ${hoverable || clickable ? 'hover:shadow-lg cursor-pointer' : ''}
        ${clickable ? 'w-full text-left' : ''}
        ${className}
      `}
      style={variantStyles[variant]}
    >
      {children}
    </Component>
  );
}

/**
 * CardHeader - Card header section
 */
export function CardHeader({
  children,
  className = '',
  actions,
}: {
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 mb-4 pb-4 border-b ${className}`}
      style={{ borderColor: 'var(--border-primary)' }}
    >
      <div className="flex-1">{children}</div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}

/**
 * CardTitle - Card title
 */
export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-xl font-bold ${className}`}
      style={{ color: 'var(--foreground)' }}
    >
      {children}
    </h3>
  );
}

/**
 * CardDescription - Card description/subtitle
 */
export function CardDescription({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-sm mt-1 ${className}`}
      style={{ color: 'var(--text-secondary)' }}
    >
      {children}
    </p>
  );
}

/**
 * CardContent - Card body content
 */
export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

/**
 * CardFooter - Card footer section
 */
export function CardFooter({
  children,
  className = '',
  justify = 'end',
}: {
  children: ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between';
}) {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex items-center gap-3 mt-4 pt-4 border-t ${justifyClasses[justify]} ${className}`}
      style={{ borderColor: 'var(--border-primary)' }}
    >
      {children}
    </div>
  );
}

/**
 * StatsCard - Card for displaying statistics
 */
export function StatsCard({
  label,
  value,
  icon,
  change,
  changeType,
  variant = 'default',
  className = '',
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  variant?: CardProps['variant'];
  className?: string;
}) {
  const changeColors = {
    increase: 'var(--color-success)',
    decrease: 'var(--color-error)',
    neutral: 'var(--text-tertiary)',
  };

  return (
    <Card variant={variant} padding="md" className={className}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>
            {label}
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            {value}
          </p>
          {change && changeType && (
            <p className="text-sm mt-2" style={{ color: changeColors[changeType] }}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="p-3 rounded-lg"
            style={{
              background: 'var(--background-subtle)',
              color: 'var(--accent-primary)',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * FeatureCard - Card for displaying features/benefits
 */
export function FeatureCard({
  icon,
  title,
  description,
  href,
  variant = 'default',
  className = '',
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
  variant?: CardProps['variant'];
  className?: string;
}) {
  const Component = href ? 'a' : 'div';

  return (
    <Card
      variant={variant}
      padding="lg"
      hoverable={!!href}
      className={className}
    >
      <Component href={href} className={href ? 'block' : ''}>
        {icon && (
          <div
            className="inline-flex p-3 rounded-lg mb-4"
            style={{
              background: 'var(--accent-primary)',
              color: 'white',
            }}
          >
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          {title}
        </h3>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      </Component>
    </Card>
  );
}
