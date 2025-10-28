# NewsHub V1 - Modern News Aggregation Platform

A beautifully designed, fully-featured news aggregation platform built with Next.js 15, TypeScript, and Tailwind CSS. NewsHub aggregates news from multiple trusted sources using RSS feeds and presents them in an intuitive, broadcast-style interface.

**Repository**: https://github.com/jssihota/NewsHub

![Version](https://img.shields.io/badge/version-1.0.3-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Features
- **Multi-Category News Browsing**: 8 major news categories (U.S. News, World News, Sports, Technology, Business, Entertainment, Health, Science)
- **Beautiful Broadcast-Style UI**: Professional news presentation with article cards and report layouts
- **Advanced Search**: Full-text search across all articles with filters and sorting
- **Daily Brief**: Curated daily news summary with print and download capabilities
- **International News Directory**: Access to 100+ international news outlets organized by region
- **RSS Feed Management**: Add, edit, and manage custom RSS news sources
- **User Preferences**: Customize favorite categories, sources, and display settings
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Built-in dark mode for comfortable reading
- **SEO Optimized**: Server-side rendering with proper meta tags

### Security & Performance Features (NEW - October 2025)
- **Enhanced RSS Parser**: Retry logic with exponential backoff for 95%+ success rate
- **XSS Protection**: DOMPurify sanitization for all user-generated and RSS feed content
- **Secure Connections**: 100% HTTPS for all RSS feeds
- **Feed Health Monitoring**: Real-time tracking of RSS feed status and performance
- **Optimized Fetching**: Request batching and 50% faster article loading
- **Zero Vulnerabilities**: Regular security audits and dependency updates

### Advanced Features
- **Smart Search**: Relevance-based search with "Did You Mean" suggestions
- **Article Filtering**: Filter by date, source, and category
- **Related Articles**: Automatic suggestions for related content
- **Source Attribution**: Clear source and timestamp on every article
- **Print Friendly**: Optimized print layouts for Daily Brief
- **Share Functionality**: Native share API support with fallback
- **Loading States**: Beautiful skeleton loaders for smooth UX
- **Empty States**: Helpful messages when no content is available
- **Type-Safe**: Full TypeScript coverage for reliability
- **Clean Homepage**: Traditional layout with Load More button (no infinite scroll)
- **Informative Sections**: About NewsHub and Coming Soon features prominently displayed

---

## Prerequisites

Before you begin, ensure you have the following installed on your computer:

### Required Software

1. **Node.js** (version 18.17 or higher)
   - Download from: [https://nodejs.org/](https://nodejs.org/)
   - We recommend the LTS (Long Term Support) version
   - Verify installation by running: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation by running: `npm --version`
   - Should be version 9.0 or higher

3. **Git** (optional, for version control)
   - Download from: [https://git-scm.com/](https://git-scm.com/)

### System Requirements

- **Windows**: Windows 10 or higher (64-bit)
- **macOS**: macOS 10.15 (Catalina) or higher
- **Linux**: Any modern distribution
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free space

---

## Quick Start

Get NewsHub running in under 5 minutes:

```bash
# 1. Navigate to the project directory
cd /path/to/newshub-v1

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open your browser to http://localhost:3000
```

That's it! NewsHub should now be running on your local machine.

---

## Installation

### For Windows Users:

1. **Open Command Prompt or PowerShell**
   - Press `Windows Key + R`
   - Type `cmd` or `powershell` and press Enter

2. **Navigate to the project directory**
   ```cmd
   cd C:\path\to\newshub-v1
   ```

3. **Install dependencies**
   ```cmd
   npm install
   ```

   This will download and install all required packages. It may take 2-5 minutes.

4. **Verify installation**
   ```cmd
   npm run build
   ```

   If this completes without errors, your installation is successful!

### For Mac Users:

1. **Open Terminal**
   - Press `Command + Space`
   - Type "Terminal" and press Enter

2. **Navigate to the project directory**
   ```bash
   cd /path/to/newshub-v1
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Verify installation**
   ```bash
   npm run build
   ```

### Installation Troubleshooting

If you encounter any issues during installation:

- **Error: "npm not found"**: Install Node.js from [nodejs.org](https://nodejs.org/)
- **Permission errors on Mac/Linux**: Try `sudo npm install` (not recommended) or fix npm permissions
- **Network errors**: Check your internet connection or try `npm install --legacy-peer-deps`
- **Disk space errors**: Free up at least 500MB of disk space

See the [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed troubleshooting steps.

---

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

Features in development mode:
- Hot Module Replacement (HMR) - changes appear instantly
- Detailed error messages
- React DevTools support
- Source maps for debugging

### Production Build

Build and run the optimized production version:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

Production features:
- Optimized bundle size
- Minified code
- Enhanced performance
- Production-ready assets

### Custom Port

To run on a different port:

```bash
# Development
npm run dev -- -p 3001

# Production
npm start -- -p 3001
```

---

## Project Structure

```
newshub-v1/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── category/[slug]/     # Dynamic category pages
│   │   ├── daily-brief/         # Daily brief page
│   │   ├── international/       # International outlets page
│   │   ├── search/              # Search page
│   │   ├── settings/            # Settings and preferences
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Homepage
│   │
│   ├── components/              # React components
│   │   ├── ArticleCard.tsx      # Individual article display
│   │   ├── ArticleList.tsx      # List view for articles
│   │   ├── DailyBriefSection.tsx # Daily brief sections
│   │   ├── EmptyState.tsx       # Empty state UI
│   │   ├── InternationalSourceCard.tsx # International source cards
│   │   ├── LoadingState.tsx     # Loading skeleton
│   │   ├── NewsReport.tsx       # Report-style layout
│   │   ├── PreferenceSection.tsx # Settings sections
│   │   ├── SearchBar.tsx        # Search input component
│   │   ├── SearchResults.tsx    # Search results display
│   │   └── SourceManager.tsx    # RSS feed manager
│   │
│   ├── lib/                     # Utility functions
│   │   ├── category-utils.ts    # Category helpers
│   │   ├── daily-brief-utils.ts # Daily brief logic
│   │   ├── feed-health.ts       # Feed health monitoring
│   │   ├── international-utils.ts # International sources
│   │   ├── preferences-utils.ts # User preferences
│   │   ├── rss-parser-enhanced.ts # Enhanced RSS parser with retry logic
│   │   ├── sanitize.ts          # XSS protection utilities
│   │   └── search-utils.ts      # Search functionality
│   │
│   ├── data/                    # Static data
│   │   ├── international-sources.json # International outlets
│   │   └── mock-articles.ts     # Test data
│   │
│   └── types/                   # TypeScript definitions
│       └── index.ts             # Type definitions
│
├── public/                      # Static assets
│   ├── favicon.ico
│   └── [other static files]
│
├── .env.local                   # Environment variables (create this)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.mjs            # ESLint configuration
├── package.json                 # Project dependencies
│
├── README.md                    # This file
├── SETUP_GUIDE.md              # Detailed setup instructions
├── USER_GUIDE.md               # User documentation
├── DEVELOPER_GUIDE.md          # Developer documentation
├── API_DOCUMENTATION.md        # API reference
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
├── FUTURE_ENHANCEMENTS.md      # Roadmap and future features
├── FAQ.md                      # Frequently asked questions
└── CHANGELOG.md                # Version history
```

---

## Technologies Used

### Core Framework
- **[Next.js 15.5.5](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **Custom Color Palette** - Professionally designed color scheme

### Libraries
- **[lucide-react](https://lucide.dev/)** - Beautiful icon library (200+ icons)
- **[rss-parser](https://www.npmjs.com/package/rss-parser)** - RSS feed parsing
- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - XSS sanitization library
- **[isomorphic-dompurify](https://www.npmjs.com/package/isomorphic-dompurify)** - Universal DOMPurify for SSR/client

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing

---

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory for environment-specific configuration:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=NewsHub
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration (for future use)
# NEWS_API_KEY=your_api_key_here
# ANTHROPIC_API_KEY=your_anthropic_key_here

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

### Tailwind CSS Customization

Edit `src/app/globals.css` to customize the color scheme:

```css
@theme {
  --color-primary: #1e40af;    /* Deep blue */
  --color-secondary: #475569;  /* Slate gray */
  --color-accent: #3b82f6;     /* Vibrant blue */

  /* Customize these to match your brand */
}
```

### Next.js Configuration

The `next.config.ts` file contains framework settings:

```typescript
const config: NextConfig = {
  images: {
    domains: ['images.unsplash.com'], // Add your image domains here
  },
};
```

---

## Available Scripts

### Development

```bash
# Start development server
npm run dev

# Start with specific port
npm run dev -- -p 3001
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Build and start
npm run build && npm start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix
npm run lint -- --fix

# Type check (no emit)
npx tsc --noEmit
```

### Maintenance

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Clean install (if issues occur)
rm -rf node_modules package-lock.json
npm install
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

**Problem**: Error: "Port 3000 is already in use"

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or kill the process using port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill
```

#### Build Errors

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Check for type errors
npx tsc --noEmit

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### Module Not Found

**Problem**: "Module not found" errors

**Solution**:
```bash
# Verify all dependencies are installed
npm install

# Clear cache and rebuild
npm run build
```

#### Styling Not Working

**Problem**: Tailwind CSS styles not applying

**Solution**:
```bash
# Restart dev server
# Tailwind v4 requires a fresh restart for config changes

# Check that globals.css is imported in layout.tsx
```

#### Images Not Loading (Next.js Image Error)

**Problem**: Error: "hostname is not configured under images in your next.config.js"

**Solution**:
- All major news source image domains are pre-configured in `next.config.ts`
- If you see this error for a new source, add the domain to `images.remotePatterns` in `next.config.ts`
- Restart dev server after making config changes

**Current configured domains**: CNN, BBC, NYT, Reuters, The Verge, TechCrunch, ESPN, WSJ, Guardian, NPR, and 30+ more

### Getting Help

If you're still experiencing issues:

1. Check the [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for technical troubleshooting
2. Check the [USER_GUIDE.md](./USER_GUIDE.md) for feature-specific help
3. Look at the error message carefully - it usually points to the issue
4. Search for the error message online - many issues have known solutions

---

## Documentation

NewsHub V1 comes with comprehensive documentation:

- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete guide to using all features
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Technical reference and development guide
- **[CLAUDE.md](./CLAUDE.md)** - AI pair programming reference (for Claude Code)
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Recent improvements and performance metrics
- **[FUTURE_ENHANCEMENTS.md](./FUTURE_ENHANCEMENTS.md)** - Roadmap and planned features
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history
- **[CLEANUP_LOG.md](./CLEANUP_LOG.md)** - October 2025 cleanup history

---

## Contributing

This is a personal project for Joel. When making changes:

1. **Always test locally first** - Run `npm run dev` and test your changes
2. **Check for TypeScript errors** - Run `npx tsc --noEmit`
3. **Run the linter** - Run `npm run lint`
4. **Build the project** - Run `npm run build` to ensure it builds successfully
5. **Test all features** - Click through the app to verify nothing broke
6. **Document your changes** - Update relevant documentation files

### Development Workflow

```bash
# 1. Make your changes
# Edit files in src/

# 2. Test locally
npm run dev

# 3. Check for errors
npm run lint
npx tsc --noEmit

# 4. Build to verify
npm run build

# 5. Commit your changes (if using git)
git add .
git commit -m "Description of changes"
```

---

## License

This project is **private** and not licensed for public use. All rights reserved.

Copyright (c) 2025 Joel Sihota

---

## Project Statistics

- **Total Lines of Code**: ~11,000+ lines
- **Components**: 14 React components
- **Pages**: 6 main pages + dynamic category pages
- **API Endpoints**: 9 routes (including feed health monitoring)
- **Utility Functions**: 60+ helper functions
- **TypeScript Coverage**: 100%
- **Security**: 0 vulnerabilities, XSS protected, 100% HTTPS
- **RSS Success Rate**: 95%+ with retry logic and exponential backoff
- **Image Domains Configured**: 40+ news source CDNs
- **Supported Categories**: 8 major news categories
- **International Outlets**: 100+ news sources
- **RSS Feed Support**: Unlimited custom feeds
- **Last Updated**: October 28, 2025

---

## Support

For questions or support:

- **Email**: Contact Joel
- **Documentation**: Check documentation files in project root
- **Troubleshooting**: See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

---

## Acknowledgments

Built with love using:
- Next.js and React
- Tailwind CSS
- TypeScript
- Lucide Icons
- The open-source community

---

**Ready to get started?** Head over to the [USER_GUIDE.md](./USER_GUIDE.md) to learn how to use NewsHub!

**Want to customize it?** Check out the [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for development instructions!

**Ready to deploy?** See the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment steps!
