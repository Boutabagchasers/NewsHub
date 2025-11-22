/**
 * Avatar Component - V2.0
 * User avatars with fallback initials, status indicators, and image support
 * Features: Multiple sizes, status dots, image fallback, initials generation
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  shape?: 'circle' | 'square';
  showStatus?: boolean;
  className?: string;
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  shape = 'circle',
  showStatus = false,
  className = '',
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Status colors
  const statusColors = {
    online: 'bg-[var(--color-success)]',
    offline: 'bg-[var(--text-tertiary)]',
    away: 'bg-[var(--color-warning)]',
    busy: 'bg-[var(--color-error)]',
  };

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <div
        className={`
          ${sizeClasses[size]} ${shapeClass}
          flex items-center justify-center font-semibold overflow-hidden
        `}
        style={{
          background: 'var(--background-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || name || 'Avatar'}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes={
              size === 'xs'
                ? '24px'
                : size === 'sm'
                  ? '32px'
                  : size === 'md'
                    ? '40px'
                    : size === 'lg'
                      ? '48px'
                      : size === 'xl'
                        ? '64px'
                        : '96px'
            }
          />
        ) : name ? (
          <span style={{ color: 'var(--foreground)' }}>{getInitials(name)}</span>
        ) : (
          <User
            className={size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : size === 'lg' ? 'w-6 h-6' : size === 'xl' ? 'w-8 h-8' : 'w-12 h-12'}
            style={{ color: 'var(--text-tertiary)' }}
          />
        )}
      </div>

      {/* Status Indicator */}
      {showStatus && status && (
        <span
          className={`
            absolute bottom-0 right-0 ${statusSizeClasses[size]} ${shapeClass}
            ${statusColors[status]}
          `}
          style={{
            border: '2px solid var(--background-primary)',
          }}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

/**
 * AvatarGroup - Display multiple avatars in a stack
 */
export function AvatarGroup({
  avatars,
  max = 3,
  size = 'md',
  shape = 'circle',
  className = '',
}: {
  avatars: Array<{ src?: string; alt?: string; name?: string }>;
  max?: number;
  size?: AvatarProps['size'];
  shape?: AvatarProps['shape'];
  className?: string;
}) {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  const negativeMarginClasses = {
    xs: '-ml-2',
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-3',
    xl: '-ml-4',
    '2xl': '-ml-6',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className={`${index > 0 ? negativeMarginClasses[size!] : ''}`}
          style={{
            zIndex: displayAvatars.length - index,
          }}
        >
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            name={avatar.name}
            size={size}
            shape={shape}
            className="ring-2"
            style={{ ringColor: 'var(--background-primary)' } as React.CSSProperties}
          />
        </div>
      ))}

      {/* Remaining Count */}
      {remainingCount > 0 && (
        <div
          className={`
            ${sizeClasses[size!]} ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
            ${negativeMarginClasses[size!]}
            flex items-center justify-center font-semibold ring-2
          `}
          style={{
            background: 'var(--background-subtle)',
            color: 'var(--text-secondary)',
            zIndex: 0,
          } as React.CSSProperties}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

/**
 * AvatarWithName - Avatar with name and optional subtitle
 */
export function AvatarWithName({
  src,
  name,
  subtitle,
  size = 'md',
  status,
  showStatus = false,
  direction = 'horizontal',
  className = '',
}: {
  src?: string;
  name: string;
  subtitle?: string;
  size?: AvatarProps['size'];
  status?: AvatarProps['status'];
  showStatus?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}) {
  const textSizeClasses = {
    xs: { name: 'text-xs', subtitle: 'text-xs' },
    sm: { name: 'text-sm', subtitle: 'text-xs' },
    md: { name: 'text-base', subtitle: 'text-sm' },
    lg: { name: 'text-lg', subtitle: 'text-base' },
    xl: { name: 'text-xl', subtitle: 'text-lg' },
    '2xl': { name: 'text-2xl', subtitle: 'text-xl' },
  };

  return (
    <div
      className={`
        flex items-center gap-3
        ${direction === 'vertical' ? 'flex-col text-center' : 'flex-row'}
        ${className}
      `}
    >
      <Avatar src={src} name={name} size={size} status={status} showStatus={showStatus} />
      <div className={`flex flex-col ${direction === 'vertical' ? 'items-center' : ''}`}>
        <div
          className={`font-semibold ${textSizeClasses[size!].name}`}
          style={{ color: 'var(--foreground)' }}
        >
          {name}
        </div>
        {subtitle && (
          <div
            className={`${textSizeClasses[size!].subtitle}`}
            style={{ color: 'var(--text-tertiary)' }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
