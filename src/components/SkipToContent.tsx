/**
 * SkipToContent Component
 * Accessibility feature allowing keyboard users to skip navigation
 * WCAG 2.1 AA Compliance: Bypass Blocks (2.4.1)
 */

'use client';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        padding: '1rem 1.5rem',
        background: 'var(--accent-primary)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '0.375rem',
        fontWeight: 600,
        fontSize: '1rem',
        top: '1rem',
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = '1rem';
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = '-9999px';
      }}
    >
      Skip to main content
    </a>
  );
}
