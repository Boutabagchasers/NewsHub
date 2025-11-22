/**
 * ArticleCard Component - V2.0
 * Production-ready article display with bookmarking, sharing, and responsive design
 * Features: Beautiful typography, hover effects, bookmark functionality, accessibility
 */

'use client';

import Image from 'next/image';
import { Clock, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { Article } from '@/types';
import { formatArticleDate, extractDomain } from '@/lib/category-utils';
import { sanitizeSnippet } from '@/lib/sanitize';
import { useState, useId } from 'react';
import { useToast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/button';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
  variant?: 'default' | 'compact' | 'hero' | 'horizontal';
  showCategory?: boolean;
  showBookmark?: boolean;
  isBookmarked?: boolean;
  onBookmark?: (article: Article) => void;
  onRemoveBookmark?: (article: Article) => void;
}

export default function ArticleCard({
  article,
  priority = false,
  variant = 'default',
  showCategory = true,
  showBookmark = true,
  isBookmarked = false,
  onBookmark,
  onRemoveBookmark,
}: ArticleCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { toast } = useToast();
  const domain = extractDomain(article.link);
  const formattedDate = formatArticleDate(article.pubDate || article.isoDate || '');

  // Generate unique IDs for ARIA relationships
  const headingId = useId();
  const snippetId = useId();
  const imageAlt = `Featured image for article: ${article.title}${article.sourceName ? ` from ${article.sourceName}` : ''}`;

  // Calculate relative time (e.g., "2h ago")
  const getRelativeTime = () => {
    const pubDate = new Date(article.pubDate || article.isoDate || '');
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formattedDate;
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (bookmarked) {
      setBookmarked(false);
      onRemoveBookmark?.(article);
      toast.info('Bookmark removed');
    } else {
      setBookmarked(true);
      onBookmark?.(article);
      toast.success('Article bookmarked!');
    }
  };

  // Share handler with toast feedback
  const handleShare = async () => {
    const url = article.link;
    const text = article.title;

    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled - don't show error
        if ((error as Error).name !== 'AbortError') {
          await copyToClipboard(url);
        }
      }
    } else {
      await copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Hero variant (large, featured article)
  if (variant === 'hero') {
    return (
      <article
        className="article-card card-spacious animate-fade-in"
        aria-labelledby={headingId}
        aria-describedby={article.contentSnippet ? snippetId : undefined}
      >
        {/* Category Badge */}
        {showCategory && article.category && (
          <Badge variant="primary" className="mb-4" role="status" aria-label={`Category: ${article.category}`}>
            {article.category}
          </Badge>
        )}

        {/* Hero Image - 16:9 */}
        {article.imageUrl && (
          <div className="image-container image-16-9 mb-6 rounded-xl overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={imageAlt}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}

        {/* Headline - Large Serif */}
        <h2 id={headingId} className="heading-display mb-4">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="article-link hover:text-[var(--accent-primary)] transition-colors"
            aria-label={`Read article: ${article.title} from ${article.sourceName}`}
          >
            {article.title}
          </a>
        </h2>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-6 text-meta flex-wrap">
          <span className="font-semibold text-[var(--accent-primary)]">
            {article.sourceName}
          </span>
          <span className="text-[var(--text-tertiary)]">•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <time dateTime={article.isoDate || article.pubDate}>
              {getRelativeTime()}
            </time>
          </div>
        </div>

        {/* Snippet */}
        {article.contentSnippet && (
          <p
            id={snippetId}
            className="text-lg leading-relaxed mb-6 text-[var(--text-secondary)] line-clamp-3"
            dangerouslySetInnerHTML={{ __html: sanitizeSnippet(article.contentSnippet) }}
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <span>Read Full Article</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {showBookmark && (
            <IconButton
              icon={<Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />}
              onClick={handleBookmarkToggle}
              variant="secondary"
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark for later'}
            />
          )}

          <IconButton
            icon={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
            variant="ghost"
            aria-label="Share article"
            title="Share this article"
          />
        </div>
      </article>
    );
  }

  // Horizontal variant (side-by-side layout)
  if (variant === 'horizontal') {
    return (
      <article
        className="article-card animate-fade-in"
        aria-labelledby={headingId}
        aria-describedby={article.contentSnippet ? snippetId : undefined}
      >
        <div className="flex gap-4 sm:gap-6">
          {/* Image - Left side */}
          {article.imageUrl && (
            <div className="flex-shrink-0">
              <div className="image-container rounded-lg overflow-hidden w-32 h-32 sm:w-48 sm:h-32">
                <Image
                  src={article.imageUrl}
                  alt={imageAlt}
                  width={192}
                  height={128}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 640px) 128px, 192px"
                />
              </div>
            </div>
          )}

          {/* Content - Right side */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Top section */}
            <div>
              {/* Category */}
              {showCategory && article.category && (
                <Badge variant="secondary" size="sm" className="mb-2" role="status" aria-label={`Category: ${article.category}`}>
                  {article.category}
                </Badge>
              )}

              {/* Title */}
              <h3 id={headingId} className="text-lg sm:text-xl font-bold mb-2 line-clamp-2 leading-snug">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-link hover:text-[var(--accent-primary)] transition-colors"
                  aria-label={`Read article: ${article.title} from ${article.sourceName}`}
                >
                  {article.title}
                </a>
              </h3>

              {/* Snippet - hidden on mobile */}
              {article.contentSnippet && (
                <p
                  id={snippetId}
                  className="hidden sm:block text-sm text-[var(--text-secondary)] line-clamp-2 mb-3"
                  dangerouslySetInnerHTML={{ __html: sanitizeSnippet(article.contentSnippet) }}
                />
              )}
            </div>

            {/* Bottom section */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Meta */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-tertiary)]">
                <span className="font-semibold text-[var(--accent-primary)]">
                  {article.sourceName}
                </span>
                <span>•</span>
                <time dateTime={article.isoDate || article.pubDate}>
                  {getRelativeTime()}
                </time>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {showBookmark && (
                  <IconButton
                    icon={<Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />}
                    onClick={handleBookmarkToggle}
                    variant="ghost"
                    size="sm"
                    aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                  />
                )}
                <IconButton
                  icon={<Share2 className="w-4 h-4" />}
                  onClick={handleShare}
                  variant="ghost"
                  size="sm"
                  aria-label="Share article"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact variant (minimal, list-style)
  if (variant === 'compact') {
    return (
      <article
        className="article-card-compact border-b border-[var(--border-primary)] pb-4 animate-fade-in"
        aria-labelledby={headingId}
      >
        <div className="flex gap-3">
          {/* Small thumbnail */}
          {article.imageUrl && (
            <div className="flex-shrink-0">
              <div className="image-container rounded-md overflow-hidden w-20 h-20">
                <Image
                  src={article.imageUrl}
                  alt={imageAlt}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  sizes="80px"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 id={headingId} className="text-base font-semibold mb-1 line-clamp-2 leading-snug">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="article-link hover:text-[var(--accent-primary)] transition-colors"
                aria-label={`Read article: ${article.title} from ${article.sourceName}`}
              >
                {article.title}
              </a>
            </h4>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                <span className="font-medium text-[var(--accent-primary)]">
                  {article.sourceName}
                </span>
                <span>•</span>
                <time>{getRelativeTime()}</time>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {showBookmark && (
                  <IconButton
                    icon={<Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />}
                    onClick={handleBookmarkToggle}
                    variant="ghost"
                    size="sm"
                    aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default variant (balanced, card-style)
  return (
    <article
      className="article-card animate-fade-in"
      aria-labelledby={headingId}
      aria-describedby={article.contentSnippet ? snippetId : undefined}
    >
      {/* Article Image - 16:9 */}
      {article.imageUrl ? (
        <div className="image-container image-16-9 mb-4 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={imageAlt}
            width={800}
            height={450}
            className="w-full h-full object-cover"
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
        </div>
      ) : (
        <div className="image-container image-16-9 image-placeholder mb-4 rounded-lg" role="img" aria-label="No image available for this article">
          <span className="text-sm text-[var(--text-tertiary)]">No image available</span>
        </div>
      )}

      {/* Category Badge */}
      {showCategory && article.category && (
        <Badge variant="primary" size="sm" className="mb-3" role="status" aria-label={`Category: ${article.category}`}>
          {article.category}
        </Badge>
      )}

      {/* Headline */}
      <h3 id={headingId} className="text-xl sm:text-2xl font-bold mb-3 line-clamp-3 leading-tight">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="article-link hover:text-[var(--accent-primary)] transition-colors"
          aria-label={`Read article: ${article.title} from ${article.sourceName}`}
        >
          {article.title}
        </a>
      </h3>

      {/* Meta Info */}
      <div className="flex items-center gap-3 mb-4 text-sm text-[var(--text-tertiary)] flex-wrap">
        <span className="font-semibold text-[var(--accent-primary)]">
          {article.sourceName}
        </span>
        <span>•</span>
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
          id={snippetId}
          className="text-base leading-relaxed mb-4 text-[var(--text-secondary)] line-clamp-3"
          dangerouslySetInnerHTML={{ __html: sanitizeSnippet(article.contentSnippet) }}
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Read More Link */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors group"
        >
          <span>Read at {domain}</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {showBookmark && (
            <IconButton
              icon={<Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />}
              onClick={handleBookmarkToggle}
              variant="ghost"
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark for later'}
            />
          )}
          <IconButton
            icon={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
            variant="ghost"
            aria-label="Share article"
            title="Share this article"
          />
        </div>
      </div>
    </article>
  );
}
