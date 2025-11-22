/**
 * Modal/Dialog Component
 * Accessible modal with backdrop, focus trap, and animations
 * Supports multiple sizes and custom styling
 */

'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className = '',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus first focusable element in modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    firstElement?.focus();

    // Cleanup
    return () => {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  // Focus trap - keep focus within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  // Render modal using portal
  return createPortal(
    <div className="modal-container" style={{ zIndex: 'var(--z-modal)' }}>
      {/* Backdrop */}
      <div
        className="modal-backdrop animate-fade-in"
        style={{ zIndex: 'var(--z-modal-backdrop)' }}
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`
          relative w-full ${sizeClasses[size]}
          bg-[var(--background-elevated)]
          rounded-xl shadow-2xl
          animate-scale-in
          flex flex-col
          max-h-[90vh]
          ${className}
        `}
        style={{
          border: '1px solid var(--border-primary)',
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            {title && (
              <h2
                id="modal-title"
                className="text-2xl font-bold"
                style={{ color: 'var(--foreground)' }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="btn-icon btn-ghost ml-auto"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="flex items-center justify-end gap-3 p-6 border-t"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/**
 * Confirmation Modal - Common pattern for confirmations
 */
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </p>
    </Modal>
  );
}
