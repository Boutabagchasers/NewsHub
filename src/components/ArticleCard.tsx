/**
 * ArticleCard Component - V2
 * Modern, ESPN/Bleacher Report-inspired article display
 * Features: Bold headlines, captivating images, social sharing
 */

'use client';

import Image from 'next/image';
import { Clock, ExternalLink, Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { Article } from '@/types';
import { formatArticleDate, extractDomain } from '@/lib/category-utils';
import { sanitizeSnippet } from '@/lib/sanitize';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
  variant?: 'default' | 'compact' | 'hero';
}

export default function ArticleCard({
  article,
  priority = false,
  variant = 'default',
}: ArticleCardProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const domain = extractDomain(article.link);
  const formattedDate = formatArticleDate(article.pubDate || article.isoDate || '');

  // Calculate relative time (e.g., "2h ago")
  const getRelativeTime = () => {
    const pubDate = new Date(article.pubDate || article.isoDate || '');
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formattedDate;
  };

  // Share handlers
  const handleShare = async (platform?: 'twitter' | 'facebook') => {
    const url = article.link;
    const text = article.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      // Try native share API, fallback to clipboard
      if (navigator.share) {
        try {
          await navigator.share({ title: text, url });
        } catch {
          // User cancelled or error
        }
      } else {
        // Copy to clipboard
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    }
    setShareOpen(false);
  };

  // Hero variant (large, featured)
  if (variant === 'hero') {
    return (
      <article className="article-card card-spacious">
        {/* Large Hero Image */}
        {article.imageUrl && (
          <div className="image-container image-16-9 mb-4">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              priority={priority}
            />
          </div>
        )}

        {/* Content */}
        <div>
          {/* Category Badge (if available) */}
          {article.category && (
            <span className="badge badge-new mb-3">
              {article.category}
            </span>
          )}

          {/* Headline */}
          <h2 className="heading-section mb-3">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="article-link">
              {article.title}
            </a>
          </h2>

          {/* Meta Info */}
          <div className="flex items-center gap-3 mb-4 text-meta flex-wrap">
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              {article.sourceName}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <time dateTime={article.isoDate || article.pubDate}>
                {getRelativeTime()}
              </time>
            </div>
          </div>

          {/* Snippet */}
          {article.contentSnippet && (
            <p
              className="text-body line-clamp-3 mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizeSnippet(article.contentSnippet) }}
            />
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <span>Read Article</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Share Button */}
            <button
              onClick={() => handleShare()}
              className="btn btn-ghost"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Compact variant (for lists/feeds)
  if (variant === 'compact') {
    return (
      <article className="article-card">
        <div className="flex gap-4">
          {/* Thumbnail Image */}
          {article.imageUrl && (
            <div className="flex-shrink-0">
              <div className="image-container" style={{ width: '160px', height: '90px', borderRadius: '6px' }}>
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={160}
                  height={90}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="heading-card mb-2">
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="article-link line-clamp-2">
                {article.title}
              </a>
            </h3>

            <div className="flex items-center gap-2 text-meta mb-2">
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                {article.sourceName}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <time>{getRelativeTime()}</time>
            </div>

            {article.contentSnippet && (
              <p
                className="text-sm line-clamp-2 mb-2"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: sanitizeSnippet(article.contentSnippet) }}
              />
            )}

            {/* Share Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('twitter')}
                className="btn-ghost btn-icon"
                style={{ padding: '0.25rem' }}
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="btn-ghost btn-icon"
                style={{ padding: '0.25rem' }}
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare()}
                className="btn-ghost btn-icon"
                style={{ padding: '0.25rem' }}
                title="Copy link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default variant (balanced)
  return (
    <article className="article-card">
      {/* Article Image - 16:9 Ratio */}
      {article.imageUrl ? (
        <div className="image-container image-16-9 mb-4">
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={800}
            height={450}
            className="w-full h-full object-cover"
            priority={priority}
          />
        </div>
      ) : (
        // Placeholder if no image
        <div className="image-container image-16-9 image-placeholder mb-4">
          <span className="text-sm">No image available</span>
        </div>
      )}

      {/* Headline - Bold & Gripping */}
      <h3 className="heading-card mb-3">
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="article-link">
          {article.title}
        </a>
      </h3>

      {/* Meta Info - Source & Timestamp */}
      <div className="flex items-center gap-3 mb-4 text-meta flex-wrap">
        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
          {article.sourceName}
        </span>
        <span style={{ color: 'var(--text-muted)' }}>•</span>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <time dateTime={article.isoDate || article.pubDate}>
            {getRelativeTime()}
          </time>
        </div>
      </div>

      {/* Snippet - 2-3 lines */}
      {article.contentSnippet && (
        <p
          className="text-body line-clamp-3 mb-4"
          style={{ color: 'var(--text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: sanitizeSnippet(article.contentSnippet) }}
        />
      )}

      {/* Actions Row */}
      <div className="flex items-center justify-between">
        {/* Read More Link */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold group"
          style={{ color: 'var(--accent-primary)' }}
        >
          <span>Read at {domain}</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* Share Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShareOpen(!shareOpen)}
            className="btn-ghost btn-icon"
            title="Share article"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {shareOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShareOpen(false)}
              />
              {/* Dropdown Menu */}
              <div
                className="absolute right-0 mt-2 p-2 rounded-lg shadow-xl border z-20"
                style={{
                  background: 'var(--background-elevated)',
                  borderColor: 'var(--border)',
                  minWidth: '160px',
                }}
              >
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-[var(--background-hover)] transition-colors text-sm"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-[var(--background-hover)] transition-colors text-sm"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShare()}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-[var(--background-hover)] transition-colors text-sm"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
