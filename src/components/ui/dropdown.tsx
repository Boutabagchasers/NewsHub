/**
 * Dropdown Component - V2.0
 * Accessible dropdown menu with keyboard navigation and positioning
 * Features: Multi-level support, keyboard navigation, click outside handling
 */

'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  selected?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right' | 'center';
  width?: 'auto' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Dropdown({ trigger, items, align = 'left', width = 'auto', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex(0);
      }
      return;
    }

    const flatItems = items.filter((item) => !item.divider && !item.disabled);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
          const item = flatItems[selectedIndex];
          if (item.onClick) {
            item.onClick();
            setIsOpen(false);
          } else if (item.href) {
            window.location.href = item.href;
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const widthClasses = {
    auto: 'w-auto min-w-48',
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
      return;
    }

    if (item.onClick) {
      item.onClick();
    }

    setIsOpen(false);
    setOpenSubmenu(null);
  };

  const renderItem = (item: DropdownItem, index: number, isSubmenu = false) => {
    if (item.divider) {
      return (
        <div
          key={item.id}
          className="my-1 h-px"
          style={{ background: 'var(--border-primary)' }}
        />
      );
    }

    const hasSubmenu = item.children && item.children.length > 0;
    const isSubmenuOpen = openSubmenu === item.id;

    return (
      <div key={item.id} className="relative">
        {item.href ? (
          <a
            href={item.href}
            className={`
              flex items-center justify-between gap-3 px-3 py-2 text-sm rounded-md transition-colors
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${item.danger ? '' : ''}
              ${selectedIndex === index && !isSubmenu ? '' : ''}
            `}
            style={{
              background:
                selectedIndex === index && !isSubmenu ? 'var(--background-subtle)' : 'transparent',
              color: item.danger ? 'var(--color-error)' : 'var(--foreground)',
            }}
            onMouseEnter={() => !isSubmenu && setSelectedIndex(index)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </div>
            {item.selected && (
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
            )}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            className={`
              w-full flex items-center justify-between gap-3 px-3 py-2 text-sm rounded-md transition-colors
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              background:
                selectedIndex === index && !isSubmenu ? 'var(--background-subtle)' : 'transparent',
              color: item.danger ? 'var(--color-error)' : 'var(--foreground)',
            }}
            onMouseEnter={() => !isSubmenu && setSelectedIndex(index)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className="truncate text-left">{item.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.selected && (
                <Check className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              )}
              {hasSubmenu && (
                <ChevronRight
                  className="w-4 h-4"
                  style={{ color: 'var(--text-tertiary)' }}
                />
              )}
            </div>
          </button>
        )}

        {/* Submenu */}
        {hasSubmenu && isSubmenuOpen && (
          <div
            className="absolute left-full top-0 ml-1 rounded-lg shadow-xl p-1 animate-scale-in z-10"
            style={{
              background: 'var(--background-elevated)',
              border: '1px solid var(--border-primary)',
              minWidth: '192px',
            }}
          >
            {item.children!.map((subitem, subindex) => renderItem(subitem, subindex, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`
            absolute top-full mt-2 ${alignClasses[align]} ${widthClasses[width]}
            rounded-lg shadow-xl p-1 animate-scale-in z-50
          `}
          style={{
            background: 'var(--background-elevated)',
            border: '1px solid var(--border-primary)',
          }}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </div>
  );
}

/**
 * DropdownButton - Pre-styled dropdown trigger button
 */
export function DropdownButton({
  children,
  items,
  variant = 'secondary',
  size = 'md',
  ...props
}: DropdownProps & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variantStyles = {
    primary: {
      background: 'var(--accent-primary)',
      color: 'white',
    },
    secondary: {
      background: 'var(--background-subtle)',
      color: 'var(--foreground)',
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--border-primary)',
      color: 'var(--foreground)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Dropdown
      {...props}
      items={items}
      trigger={
        <button
          className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${sizeStyles[size]}`}
          style={variantStyles[variant]}
        >
          {children}
          <ChevronDown className="w-4 h-4" />
        </button>
      }
    />
  );
}
