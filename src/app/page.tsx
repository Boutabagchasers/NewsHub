/**
 * NewsHub V2 - Homepage
 * Clean, traditional homepage with featured stories and platform information
 */

'use client';

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types';
import { getAllCategories } from '@/lib/category-utils';
import { Sparkles, Loader2, Shield, Zap, Globe, TrendingUp, CheckCircle2 } from 'lucide-react';
import { logger } from '@/lib/logger';

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
      setFilteredArticles(articles);
    } else {
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
    <div className="min-h-screen" style={{ paddingTop: '64px' }}>
      {/* Hero Section */}
      <section className="section-spacing" style={{ background: 'var(--background-subtle)' }}>
        <div className="container">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="heading-hero mb-4">
              Welcome to NewsHub
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Your trusted source for global news. Aggregating stories from the world&apos;s leading news organizations.
            </p>
          </div>

          {/* Hero Article */}
          {!loading && heroArticle && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h2 className="text-xl font-bold">Featured Story</h2>
              </div>
              <ArticleCard article={heroArticle} variant="hero" priority />
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
