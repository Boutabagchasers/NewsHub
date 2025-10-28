/**
 * Mock Article Data
 * Sample articles for testing and development
 */

import { Article } from '@/types';

const now = new Date();

/**
 * Mock articles with images
 */
export const mockArticlesWithImages: Article[] = [
  {
    id: 'mock-1',
    title: 'NASA Announces Discovery of Earth-Like Planet in Habitable Zone',
    link: 'https://example.com/nasa-planet-discovery',
    pubDate: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    isoDate: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    content: 'NASA scientists have announced the discovery of an Earth-like exoplanet located in the habitable zone of its star system, approximately 100 light-years from Earth. The planet, designated K2-315b, shows promising signs of atmospheric conditions that could support liquid water.\n\nThe discovery was made using advanced spectroscopy techniques that analyzed light passing through the planet\'s atmosphere. Preliminary data suggests the presence of water vapor and potentially oxygen, though more observations are needed to confirm these findings.\n\n"This is one of the most exciting discoveries in recent years," said Dr. Sarah Chen, lead researcher on the project. "While we can\'t definitively say if life exists there, this planet has all the right conditions for habitability."',
    contentSnippet: 'NASA scientists have announced the discovery of an Earth-like exoplanet located in the habitable zone of its star system, approximately 100 light-years from Earth. The planet shows promising signs of atmospheric conditions that could support liquid water.',
    source: 'nasa',
    sourceName: 'NASA',
    category: 'science',
    imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=450&fit=crop',
    imageCaption: 'Artist\'s rendering of the newly discovered exoplanet K2-315b, showing a rocky world with potential water clouds in its atmosphere.',
    relatedArticles: [
      {
        id: 'related-1',
        title: 'How Scientists Search for Habitable Planets',
        link: 'https://example.com/searching-habitable-planets',
        source: 'Scientific American',
      },
      {
        id: 'related-2',
        title: 'The James Webb Space Telescope\'s Role in Exoplanet Research',
        link: 'https://example.com/jwst-exoplanets',
        source: 'Space.com',
      },
    ],
  },
  {
    id: 'mock-2',
    title: 'Global Stock Markets Surge on Strong Economic Data',
    link: 'https://example.com/stock-market-surge',
    pubDate: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    isoDate: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    content: 'Stock markets around the world rallied today following the release of better-than-expected economic data from major economies. The S&P 500 gained 2.3%, while European and Asian markets also posted significant gains.\n\nThe positive sentiment was driven by strong employment figures and signs of easing inflation pressures. Investors interpreted the data as indicating a "soft landing" scenario where economic growth continues without triggering aggressive monetary policy responses.\n\nAnalysts noted that technology and consumer discretionary sectors led the gains, suggesting renewed confidence in growth-oriented investments. However, some experts cautioned that volatility could return if economic conditions change.',
    contentSnippet: 'Stock markets around the world rallied today following the release of better-than-expected economic data from major economies. The S&P 500 gained 2.3%, while European and Asian markets also posted significant gains.',
    source: 'bloomberg',
    sourceName: 'Bloomberg',
    category: 'business',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
    imageCaption: 'Trading floor at the New York Stock Exchange showing electronic displays with rising market indicators.',
    relatedArticles: [
      {
        id: 'related-3',
        title: 'Fed Officials Signal Cautious Approach to Future Rate Changes',
        link: 'https://example.com/fed-rates',
        source: 'CNBC',
      },
    ],
  },
];

/**
 * Mock articles without images
 */
export const mockArticlesWithoutImages: Article[] = [
  {
    id: 'mock-3',
    title: 'Supreme Court Hears Arguments on Major Environmental Regulation Case',
    link: 'https://example.com/supreme-court-environment',
    pubDate: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    isoDate: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    content: 'The Supreme Court heard oral arguments today in a case that could significantly impact federal environmental regulations. At issue is the extent of the EPA\'s authority to regulate carbon emissions from power plants.\n\nThe case, brought by a coalition of states and energy companies, challenges regulations implemented under the Clean Air Act. Justices questioned both sides extensively about the scope of agency authority and the separation of powers.',
    contentSnippet: 'The Supreme Court heard oral arguments today in a case that could significantly impact federal environmental regulations. At issue is the extent of the EPA\'s authority to regulate carbon emissions.',
    source: 'scotus',
    sourceName: 'SCOTUSblog',
    category: 'us-news',
    relatedArticles: [
      {
        id: 'related-4',
        title: 'Understanding the EPA\'s Carbon Regulation Framework',
        link: 'https://example.com/epa-framework',
        source: 'Environmental Law Institute',
      },
    ],
  },
  {
    id: 'mock-4',
    title: 'Championship Game Ends in Dramatic Overtime Victory',
    link: 'https://example.com/championship-game',
    pubDate: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
    isoDate: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
    content: 'In one of the most thrilling championship games in recent memory, the home team secured victory with a last-second field goal in overtime. The game featured multiple lead changes and outstanding performances from star players on both sides.\n\nThe winning quarterback completed 28 of 35 passes for 342 yards and three touchdowns, earning MVP honors. The dramatic finish capped off a season filled with unexpected twists and memorable moments.',
    contentSnippet: 'In one of the most thrilling championship games in recent memory, the home team secured victory with a last-second field goal in overtime.',
    source: 'espn',
    sourceName: 'ESPN',
    category: 'sports',
  },
];

/**
 * Mock articles with varying lengths
 */
export const mockArticlesVariedLength: Article[] = [
  {
    id: 'mock-5',
    title: 'Short Article: New Coffee Shop Opens Downtown',
    link: 'https://example.com/coffee-shop',
    pubDate: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    isoDate: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    content: 'A new artisan coffee shop opened its doors downtown this morning, offering locally roasted beans and handcrafted pastries.',
    contentSnippet: 'A new artisan coffee shop opened its doors downtown this morning, offering locally roasted beans and handcrafted pastries.',
    source: 'local',
    sourceName: 'Local News',
    category: 'entertainment',
  },
  {
    id: 'mock-6',
    title: 'Long Article: Comprehensive Analysis of Renewable Energy Transition',
    link: 'https://example.com/renewable-energy',
    pubDate: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    isoDate: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    content: 'The global transition to renewable energy sources represents one of the most significant technological and economic shifts of the 21st century. This comprehensive analysis examines the current state of renewable energy adoption, technological advances, economic implications, and policy frameworks driving this transformation.\n\nSolar and wind power have seen remarkable growth over the past decade, with costs declining dramatically while efficiency improvements continue. According to recent data, renewable energy now accounts for nearly 30% of global electricity generation, up from just 20% five years ago.\n\nHowever, the transition faces numerous challenges. Energy storage technology, while improving, still struggles to provide reliable backup for intermittent renewable sources. Grid infrastructure needs massive upgrades to handle distributed generation. And political opposition in some regions continues to slow progress.\n\nExperts predict that achieving net-zero carbon emissions by 2050 will require unprecedented investment and coordination. Some estimates suggest over $100 trillion in infrastructure spending will be needed globally over the next three decades.\n\nDespite these challenges, the momentum behind renewable energy continues to build. Corporate commitments to carbon neutrality, government policies supporting clean energy, and continued technological innovation all point toward an accelerating transition in the coming years.',
    contentSnippet: 'The global transition to renewable energy sources represents one of the most significant technological and economic shifts of the 21st century. This comprehensive analysis examines the current state of renewable energy adoption.',
    source: 'nature',
    sourceName: 'Nature Energy',
    category: 'science',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=450&fit=crop',
    imageCaption: 'Wind turbines generating clean energy against a sunset sky, symbolizing the renewable energy transition.',
    relatedArticles: [
      {
        id: 'related-5',
        title: 'Battery Technology Breakthroughs Enable Better Energy Storage',
        link: 'https://example.com/battery-tech',
        source: 'MIT Technology Review',
      },
      {
        id: 'related-6',
        title: 'Solar Panel Efficiency Reaches New Record',
        link: 'https://example.com/solar-efficiency',
        source: 'IEEE Spectrum',
      },
    ],
  },
];

/**
 * Complete mock dataset combining all articles
 */
export const allMockArticles: Article[] = [
  ...mockArticlesWithImages,
  ...mockArticlesWithoutImages,
  ...mockArticlesVariedLength,
];

/**
 * Mock articles by category
 */
export const mockArticlesByCategory: Record<string, Article[]> = {
  'us-news': allMockArticles.filter((a) => a.category === 'us-news'),
  'world-news': allMockArticles.filter((a) => a.category === 'world-news'),
  sports: allMockArticles.filter((a) => a.category === 'sports'),
  technology: allMockArticles.filter((a) => a.category === 'technology'),
  business: allMockArticles.filter((a) => a.category === 'business'),
  entertainment: allMockArticles.filter((a) => a.category === 'entertainment'),
  health: allMockArticles.filter((a) => a.category === 'health'),
  science: allMockArticles.filter((a) => a.category === 'science'),
};

/**
 * Get mock articles for a specific category
 */
export function getMockArticlesForCategory(category: string): Article[] {
  return mockArticlesByCategory[category] || [];
}

/**
 * Get a single mock article by ID
 */
export function getMockArticleById(id: string): Article | undefined {
  return allMockArticles.find((article) => article.id === id);
}
