/**
 * Breadcrumbs Component - V2.0
 * Navigation breadcrumbs with separator customization
 * Features: Custom separators, icons, overflow handling
 */

'use client';

import { ReactNode, Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHome?: boolean;
  maxItems?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Breadcrumbs({
  items,
  separator,
  showHome = true,
  maxItems,
  size = 'md',
  className = '',
}: BreadcrumbsProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Add home item if requested
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: '/', icon: <Home className={iconSizes[size]} /> }, ...items]
    : items;

  // Handle overflow
  let displayItems = allItems;
  if (maxItems && allItems.length > maxItems) {
    const firstItems = allItems.slice(0, 1);
    const lastItems = allItems.slice(-(maxItems - 2));
    displayItems = [
      ...firstItems,
      { label: '...', current: false },
      ...lastItems,
    ];
  }

  const defaultSeparator = separator || (
    <ChevronRight className={iconSizes[size]} style={{ color: 'var(--text-tertiary)' }} />
  );

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={`flex items-center gap-2 flex-wrap ${sizeClasses[size]}`}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <Fragment key={index}>
              <li className="flex items-center gap-2">
                {item.href && !isCurrent ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 hover:underline transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className="flex items-center gap-2"
                    style={{
                      color: isCurrent ? 'var(--foreground)' : 'var(--text-secondary)',
                      fontWeight: isCurrent ? 600 : 400,
                    }}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>

              {/* Separator */}
              {!isLast && (
                <li aria-hidden="true" className="flex items-center">
                  {defaultSeparator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * SimpleBreadcrumbs - Minimal breadcrumbs from path array
 */
export function SimpleBreadcrumbs({
  paths,
  baseUrl = '',
  size = 'md',
  className = '',
}: {
  paths: string[];
  baseUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const items: BreadcrumbItem[] = paths.map((path, index) => {
    const isLast = index === paths.length - 1;
    const href = isLast ? undefined : `${baseUrl}/${paths.slice(0, index + 1).join('/')}`;

    return {
      label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      href,
      current: isLast,
    };
  });

  return <Breadcrumbs items={items} size={size} className={className} showHome={!!baseUrl} />;
}
