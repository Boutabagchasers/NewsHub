/**
 * Tabs Component - V2.0
 * Accessible tabs with keyboard navigation and animations
 * Features: Horizontal/vertical orientation, icons, badges, underline/pills style
 */

'use client';

import { useState, ReactNode, useEffect } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
  content?: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'bordered';
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  orientation = 'horizontal',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;

    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentEnabledIndex = enabledTabs.findIndex((t) => t.id === tabs[currentIndex].id);

    let nextIndex = currentEnabledIndex;

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1;
      } else if (e.key === 'ArrowRight') {
        nextIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0;
      }
    } else {
      if (e.key === 'ArrowUp') {
        nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1;
      } else if (e.key === 'ArrowDown') {
        nextIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0;
      }
    }

    if (nextIndex !== currentEnabledIndex) {
      e.preventDefault();
      handleTabChange(enabledTabs[nextIndex].id);
    }
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  // Underline variant
  if (variant === 'underline') {
    return (
      <div className={className}>
        {/* Tab List */}
        <div
          className={`
            flex ${orientation === 'horizontal' ? 'flex-row border-b' : 'flex-col border-r'}
            ${fullWidth && orientation === 'horizontal' ? 'w-full' : ''}
          `}
          style={{ borderColor: 'var(--border-primary)' }}
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`
                  relative flex items-center gap-2 ${sizeClasses[size]} font-medium transition-colors
                  ${fullWidth && orientation === 'horizontal' ? 'flex-1 justify-center' : ''}
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${orientation === 'horizontal' ? '-mb-px' : '-mr-px'}
                `}
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className="px-2 py-0.5 text-xs font-bold rounded-full"
                    style={{
                      background: isActive ? 'var(--accent-primary)' : 'var(--background-subtle)',
                      color: isActive ? 'white' : 'var(--text-tertiary)',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <div
                    className={`
                      absolute ${orientation === 'horizontal' ? 'bottom-0 left-0 right-0 h-0.5' : 'right-0 top-0 bottom-0 w-0.5'}
                      transition-all
                    `}
                    style={{ background: 'var(--accent-primary)' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        {activeContent && (
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={activeTab}
            className="mt-4 animate-fade-in"
          >
            {activeContent}
          </div>
        )}
      </div>
    );
  }

  // Pills variant
  if (variant === 'pills') {
    return (
      <div className={className}>
        {/* Tab List */}
        <div
          className={`
            flex gap-2 p-1 rounded-lg
            ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}
            ${fullWidth && orientation === 'horizontal' ? 'w-full' : ''}
          `}
          style={{
            background: 'var(--background-subtle)',
          }}
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`
                  flex items-center justify-center gap-2 ${sizeClasses[size]} font-medium rounded-md transition-all
                  ${fullWidth && orientation === 'horizontal' ? 'flex-1' : ''}
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  background: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                }}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className="px-2 py-0.5 text-xs font-bold rounded-full"
                    style={{
                      background: isActive ? 'white' : 'var(--background-elevated)',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        {activeContent && (
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={activeTab}
            className="mt-4 animate-fade-in"
          >
            {activeContent}
          </div>
        )}
      </div>
    );
  }

  // Bordered variant
  return (
    <div className={className}>
      {/* Tab List */}
      <div
        className={`
          flex gap-2
          ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}
          ${fullWidth && orientation === 'horizontal' ? 'w-full' : ''}
        `}
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                flex items-center justify-center gap-2 ${sizeClasses[size]} font-medium rounded-lg transition-all
                ${fullWidth && orientation === 'horizontal' ? 'flex-1' : ''}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                background: isActive ? 'var(--background-elevated)' : 'transparent',
                border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className="px-2 py-0.5 text-xs font-bold rounded-full"
                  style={{
                    background: isActive ? 'var(--accent-primary)' : 'var(--background-subtle)',
                    color: isActive ? 'white' : 'var(--text-tertiary)',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      {activeContent && (
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={activeTab}
          className="mt-4 animate-fade-in"
        >
          {activeContent}
        </div>
      )}
    </div>
  );
}

/**
 * SimpleTabs - Minimal tabs without content panels
 */
export function SimpleTabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
}: {
  tabs: Omit<Tab, 'content'>[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills';
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Tabs
      tabs={tabs.map((t) => ({ ...t, content: undefined }))}
      defaultTab={activeTab}
      onChange={onChange}
      variant={variant}
      size={size}
    />
  );
}
