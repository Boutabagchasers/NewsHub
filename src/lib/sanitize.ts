/**
 * Content Sanitization Library
 * Protects against XSS attacks by sanitizing HTML content
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Works in both browser and server environments
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'img', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text (strip all HTML)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize article content snippet
 * Removes all HTML but preserves line breaks
 */
export function sanitizeSnippet(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['br'],
    ALLOWED_ATTR: [],
  });
}
