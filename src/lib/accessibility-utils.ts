/**
 * Accessibility Utilities
 * Helper functions for WCAG 2.1 AA compliance
 */

/**
 * Generate unique IDs for ARIA relationships
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Announce message to screen readers
 * Uses ARIA live regions for dynamic content updates
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Visually hidden but accessible
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get accessible label for article date
 */
export function getAccessibleDateLabel(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `Published on ${dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

/**
 * Get keyboard shortcut hint text
 */
export function getKeyboardShortcut(key: string, modifier?: 'ctrl' | 'cmd' | 'shift'): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  let shortcut = '';
  if (modifier === 'ctrl' || modifier === 'cmd') {
    shortcut = isMac ? '⌘' : 'Ctrl';
  } else if (modifier === 'shift') {
    shortcut = 'Shift';
  }

  return shortcut ? `${shortcut}+${key.toUpperCase()}` : key.toUpperCase();
}

/**
 * Focus trap for modals and dialogs
 */
export class FocusTrap {
  private element: HTMLElement;
  private focusableElements: HTMLElement[];
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private previouslyFocusedElement: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.focusableElements = [];
    this.updateFocusableElements();
  }

  private updateFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    this.focusableElements = Array.from(
      this.element.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement =
      this.focusableElements[this.focusableElements.length - 1] || null;
  }

  activate() {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.updateFocusableElements();

    // Focus first element
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }

    // Add event listener for tab key
    this.element.addEventListener('keydown', this.handleKeyDown);
  }

  deactivate() {
    this.element.removeEventListener('keydown', this.handleKeyDown);

    // Restore focus to previously focused element
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    // Shift + Tab
    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault();
        this.lastFocusableElement?.focus();
      }
    }
    // Tab
    else {
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault();
        this.firstFocusableElement?.focus();
      }
    }
  };
}

/**
 * Check if an element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  return (
    !element.hasAttribute('aria-hidden') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    window.getComputedStyle(element).display !== 'none' &&
    window.getComputedStyle(element).visibility !== 'hidden'
  );
}

/**
 * Create visually hidden element (accessible to screen readers)
 */
export function createVisuallyHidden(text: string): HTMLElement {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
}

/**
 * Get reading time estimate
 */
export function getReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} minute read`;
}

/**
 * Format number for screen readers
 */
export function formatNumberForScreenReader(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} million`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} thousand`;
  }
  return num.toString();
}
