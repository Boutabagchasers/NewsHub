/**
 * NewsHub V2 - Homepage
 * Clean, traditional homepage with featured stories and platform information
 */

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types';
import { getAllCategories } from '@/lib/category-utils';
import { diversifyArticles } from '@/lib/diversification-utils';
import { Sparkles, Loader2, Shield, Zap, Globe, TrendingUp, CheckCircle2 } from 'lucide-react';
import { logger } from '@/lib/logger';

// Dynamic imports for below-fold sections (reduces initial bundle size)
const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  loading: () => <div className="section-spacing text-center" style={{ color: 'var(--text-secondary)' }}>Loading...</div>,
  ssr: false,
});

const ComingSoonSection = dynamic(() => import('@/components/ComingSoonSection'), {
  loading: () => <div className="section-spacing text-center" style={{ color: 'var(--text-secondary)' }}>Loading...</div>,
  ssr: false,
});

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(20);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const categories = getAllCategories();

  // Fetch articles from all categories
  useEffect(() => {
    async function fetchAllArticles() {
      setLoading(true);
      try {
        const response = await fetch('/api/articles');

        if (!response.ok) {
          logger.error('API error fetching articles', { status: response.status, statusText: response.statusText });
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
          // Sort by date, newest first
          const sorted = data.articles.sort((a: Article, b: Article) => {
            const dateA = new Date(a.pubDate || a.isoDate || 0).getTime();
            const dateB = new Date(b.pubDate || b.isoDate || 0).getTime();
            return dateB - dateA;
          });
          setArticles(sorted);
          setFilteredArticles(sorted);
        }
      } catch (error) {
        logger.error('Error fetching articles', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllArticles();
  }, []);

  // Filter articles by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      // Apply diversification algorithm for 'all' tab
      // Ensures balanced representation across categories and prevents source dominance
      // Enable debug mode to see distribution stats in browser console
      const diversified = diversifyArticles(articles, true);
      setFilteredArticles(diversified);
    } else {
      // For specific categories, just filter and sort by date
      const filtered = articles.filter(
        (article) => article.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredArticles(filtered);
    }
    setDisplayCount(20); // Show 20 articles by default
    setShowLoadMore(false);
  }, [selectedCategory, articles]);

  // Update "Load More" button visibility
  useEffect(() => {
    setShowLoadMore(displayCount < filteredArticles.length);
  }, [displayCount, filteredArticles.length]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 20, filteredArticles.length));
  };

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const heroArticle = displayedArticles[0];
  const feedArticles = displayedArticles.slice(1);

  return (
    <div className="min-h-screen">
      {/* Dashboard Overview Section */}
      <section className="py-8 border-b" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4 hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Total Articles</span>
                <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <div className="text-3xl font-bold mb-1">{filteredArticles.length}</div>
              <p className="text-xs text-[var(--text-muted)]">Across all categories</p>
            </div>

            <div className="card p-4 hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Active Sources</span>
                <Globe className="w-5 h-5 text-[var(--accent-secondary)]" />
              </div>
              <div className="text-3xl font-bold mb-1">{new Set(articles.map(a => a.source)).size}</div>
              <p className="text-xs text-[var(--text-muted)]">Trusted publishers</p>
            </div>

            <div className="card p-4 hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Categories</span>
                <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <div className="text-3xl font-bold mb-1">8</div>
              <p className="text-xs text-[var(--text-muted)]">Topic areas</p>
            </div>

            <div className="card p-4 hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Last Updated</span>
                <Zap className="w-5 h-5 text-[var(--accent-warning)]" />
              </div>
              <div className="text-3xl font-bold mb-1">Live</div>
              <p className="text-xs text-[var(--text-muted)]">Real-time updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-spacing" style={{ background: 'var(--background-subtle)' }}>
        <div className="container">
          {/* Welcome Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="heading-hero mb-4">
              Welcome to NewsHub
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Your trusted source for global news. Aggregating stories from the world&apos;s leading news organizations.
            </p>
          </div>

          {/* Hero Article - Two Column Layout on Large Screens */}
          {!loading && heroArticle && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Left Column - Featured Story (2/3 width on large screens) */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h2 className="text-xl font-bold">Featured Story</h2>
                </div>
                <ArticleCard article={heroArticle} variant="hero" priority />
              </div>

              {/* Right Column - Top Headlines Sidebar (1/3 width on large screens) */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    <h2 className="text-xl font-bold">Top Headlines</h2>
                  </div>
                  <div className="space-y-4">
                    {feedArticles.slice(0, 5).map((article, index) => (
                      <a
                        key={article.id}
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block card p-4 hover:shadow-lg transition-all duration-200"
                        style={{ borderLeft: '3px solid var(--accent-primary)' }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--accent-primary)', color: 'white' }}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                              <span className="truncate">{article.sourceName || article.source}</span>
                              <span>•</span>
                              <span>{new Date(article.pubDate || article.isoDate || '').toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
            </div>
          )}
        </div>
      </section>

      {/* Feed Section */}
      <section className="section-spacing">
        <div className="container">
          {/* Category Filters */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Latest News</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.slug
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {!loading && feedArticles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {feedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>

              {/* Load More Button */}
              {showLoadMore && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    className="btn btn-primary"
                  >
                    Load More Articles
                  </button>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                    Showing {displayCount} of {filteredArticles.length} articles
                  </p>
                </div>
              )}

              {/* End of Articles */}
              {!showLoadMore && (
                <div className="text-center py-4">
                  <p style={{ color: 'var(--text-muted)' }}>
                    Showing all {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </>
          )}

          {/* No Articles Message */}
          {!loading && filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                No articles found in this category. Try another category or check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About NewsHub Section */}
      <section className="section-spacing" style={{ background: 'var(--background-subtle)' }}>
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="heading-section mb-3">About NewsHub</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
              NewsHub is your comprehensive news aggregation platform, bringing together trusted journalism from around the world in one beautiful, easy-to-use interface.
            </p>
          </div>

          {/* What We Do */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">Global Coverage</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                We aggregate news from leading sources worldwide including CNN, BBC, The New York Times, Reuters, and more.
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">Real-Time Updates</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Stay informed with the latest breaking news and trending stories updated throughout the day.
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">Trusted Sources</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Every article comes from verified, reputable news organizations with established journalistic standards.
              </p>
            </div>
          </div>

          {/* Why Choose NewsHub */}
          <div className="card p-8">
            <h3 className="text-xl font-bold mb-6 text-center">Why Choose NewsHub?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 className="font-semibold mb-1">Curated Quality</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    We carefully select only the most reputable news sources, ensuring you receive accurate, reliable information.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 className="font-semibold mb-1">Ad-Free Experience</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Enjoy a clean, distraction-free reading experience without intrusive advertisements or pop-ups.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 className="font-semibold mb-1">8 Major Categories</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Browse news across U.S. News, World News, Technology, Business, Sports, Entertainment, Health, and Science.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 className="font-semibold mb-1">Privacy Focused</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    We respect your privacy. No tracking, no data collection, no account required to read the news.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 className="font-semibold mb-1">Beautiful Design</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Experience news in a modern, elegantly designed interface optimized for reading comfort.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 className="font-semibold mb-1">Always Free</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    NewsHub is completely free to use. No subscriptions, no paywalls, no hidden fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="section-spacing">
        <div className="container max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              <h2 className="heading-section">Coming Soon</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              We&apos;re constantly improving NewsHub with exciting new features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* iOS Widget */}
            <div className="card p-6">
              <div className="mb-4">
                <div
                  className="mx-auto rounded-2xl p-4 flex items-center justify-center"
                  style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  }}
                >
                  <div className="text-white text-center">
                    <div className="text-xs font-bold mb-1">NEWSHUB</div>
                    <div className="text-2xl font-bold mb-1">5</div>
                    <div className="text-xs">New Stories</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold mb-2">iOS Widget</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Get your news at a glance with Lock Screen and Home Screen widgets
              </p>
            </div>

            {/* Personalization */}
            <div className="card p-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--background-hover)' }}>
                <Sparkles className="w-12 h-12" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h3 className="font-bold mb-2">Personalization</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Save your favorite sources and categories for a customized news feed tailored to your interests
              </p>
            </div>

            {/* AI Summaries */}
            <div className="card p-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--background-hover)' }}>
                <Zap className="w-12 h-12" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h3 className="font-bold mb-2">AI Summaries</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Get quick AI-generated summaries of long articles to save time while staying informed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Categories CTA */}
      <section className="section-spacing" style={{ background: 'var(--background-subtle)' }}>
        <div className="container max-w-3xl text-center">
          <h2 className="heading-section mb-4">
            Explore News by Category
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Dive deeper into the topics that matter most to you
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="btn btn-secondary"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
