# NewsHub V1 - User Guide

Complete guide to using all features of NewsHub V1.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Homepage](#homepage)
3. [Browsing Categories](#browsing-categories)
4. [Using Search](#using-search)
5. [Daily Brief](#daily-brief)
6. [International News](#international-news)
7. [Settings & Preferences](#settings--preferences)
8. [RSS Feed Management](#rss-feed-management)
9. [Tips & Tricks](#tips--tricks)
10. [Keyboard Shortcuts](#keyboard-shortcuts)

---

## Getting Started

### Accessing NewsHub

1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Navigate to: http://localhost:3000
3. You'll see the NewsHub homepage

### First Time Setup

When you first open NewsHub:
1. Explore the homepage and category cards
2. Try clicking on a category to see articles
3. Visit Settings to customize your experience
4. No account or login required!

---

## Homepage

### Overview

The homepage is your starting point. It features:

- **Header**: NewsHub logo and branding
- **Welcome Section**: Introduction to NewsHub
- **Category Grid**: 8 news categories to explore
- **Feature Highlights**: Key features of NewsHub

### Category Cards

Each category card shows:
- **Icon**: Visual representation of the category
- **Category Name**: e.g., "U.S. News", "Technology"
- **Description**: Brief explanation of what's included

**To browse a category:**
1. Click any category card
2. View articles in that category
3. Use the back button to return to homepage

### Available Categories

1. **U.S. News** - Latest news from across the United States
2. **World News** - International news and global events
3. **Sports** - Sports news, scores, and analysis
4. **Technology** - Tech news, gadgets, and innovations
5. **Business** - Business and financial news
6. **Entertainment** - Movies, music, and culture
7. **Health** - Health, wellness, and medical news
8. **Science** - Scientific discoveries and research

---

## Browsing Categories

### Category Page Layout

When you click a category, you'll see:

1. **Header Section**
   - Category name and icon
   - Number of articles available
   - Last updated timestamp

2. **Article Display**
   - Main article cards with images
   - Article titles (clickable)
   - Source attribution
   - Publication time
   - Brief description

3. **Related Articles**
   - Suggested articles in the same category
   - Quick links to related stories

### Reading Articles

**To read an article:**
1. Click the article title or headline
2. Opens in a new browser tab
3. Displays the original article on the source's website

**Article Information:**
- **Title**: Main headline
- **Source**: News outlet (e.g., "The New York Times")
- **Time**: When it was published (e.g., "2 hours ago")
- **Image**: Accompanying photo (if available)
- **Excerpt**: Brief preview of the article content

### View Modes

Some category pages offer multiple view modes:

1. **Report View** (Default)
   - Broadcast-style layout
   - Highlighted top story
   - Grid of additional articles

2. **List View**
   - Compact list format
   - More articles visible at once
   - Easier for quick scanning

3. **Compact View**
   - Minimal design
   - Text-focused
   - Maximum articles per page

---

## Using Search

### Accessing Search

**Three ways to open search:**
1. Click the search icon in navigation
2. Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)
3. Navigate to `/search`

### Performing a Search

1. **Enter your search query**
   - Type keywords, topics, or phrases
   - Example: "climate change", "NFL", "artificial intelligence"

2. **View results**
   - See number of articles found
   - Articles ranked by relevance
   - Matched terms highlighted

3. **Refine your search**
   - Use filters (see below)
   - Try different keywords
   - Check "Did You Mean" suggestions

### Search Filters

**Filter by Category:**
- Select one or more categories
- Only show articles from those categories
- Example: Filter to only "Technology" and "Business"

**Filter by Source:**
- Choose specific news outlets
- Example: Show only BBC and CNN articles

**Filter by Date:**
- Last 24 hours
- Last 3 days
- Last 7 days
- Custom date range

**Sort Options:**
- **Relevance** (default) - Best matches first
- **Date** - Newest articles first
- **Source** - Alphabetically by outlet

### Search Tips

**Best Practices:**
- Use specific keywords for better results
- Try different word variations if no results
- Use quotes for exact phrases: "electric vehicles"
- Combine multiple keywords: "climate policy africa"

**What you can search:**
- Article titles
- Article content/excerpts
- Source names
- Author names
- Categories

---

## Daily Brief

### What is Daily Brief?

A curated summary of today's top news across all categories. Perfect for:
- Morning catch-up
- Quick overview of the day
- Sharing with others
- Archiving important news

### Accessing Daily Brief

Navigate to: http://localhost:3000/daily-brief

### Daily Brief Features

**Header Section:**
- Today's date (formatted)
- Total article count
- Number of categories included
- Last updated time

**Article Sections:**
- Organized by category
- Top 5 articles per category
- Numbered for easy reference
- Clean, readable format

**Action Buttons:**

1. **Print**
   - Creates printer-friendly version
   - Removes navigation and buttons
   - Optimized black and white layout

2. **Share**
   - Uses native browser sharing
   - Share via email, messages, social media
   - Falls back to clipboard copy

3. **Refresh**
   - Reloads all articles
   - Updates timestamps
   - Gets latest news

4. **Download**
   - Saves as text file (.txt)
   - Includes all articles
   - Easy to archive or email

### Using Daily Brief

**Morning Routine:**
1. Open Daily Brief first thing
2. Scan headlines by category
3. Click to read full articles of interest
4. Download for later reference

**Sharing with Others:**
1. Click "Share" button
2. Choose sharing method
3. Send to family/friends

**Printing:**
1. Click "Print" button
2. Review print preview
3. Adjust printer settings
4. Print or save as PDF

---

## International News

### Overview

Access news outlets from around the world, organized by region.

**Navigate to:** http://localhost:3000/international

### Features

**Browse by Region:**
- Asia
- Europe
- Americas
- Middle East & Africa
- Oceania

**Each region includes:**
- Country flags and names
- News outlet cards
- Language information
- RSS feed links

### Using International Directory

**Expand/Collapse Regions:**
1. Click region name to expand
2. Click again to collapse
3. All countries in region shown

**View Outlet Details:**
- **Name**: Official news outlet name
- **Country**: Flag and country name
- **Language**: Primary language
- **Category**: General/Business/Sports etc.
- **Description**: Brief about the outlet

**Add to Favorites:**
1. Click the heart icon on outlet card
2. Marked as favorite
3. Easy to find later

**Search Outlets:**
1. Use search bar at top
2. Search by:
   - Outlet name
   - Country
   - Description
   - Language

**Filter Options:**
- **By Language**: Show only outlets in specific language
- **By Category**: Filter by news type
- **Clear Filters**: Reset all filters

### Connecting RSS Feeds

**To add an international source to your feed:**
1. Find the outlet in International directory
2. Copy the RSS URL
3. Go to Settings → RSS Feed Management
4. Add new source with the URL

---

## Settings & Preferences

### Accessing Settings

Navigate to: http://localhost:3000/settings

### Settings Sections

#### 1. Favorite Categories

**Purpose**: Prioritize categories you care about most

**How to use:**
1. Click category cards to mark as favorites
2. Favorited categories highlighted in blue
3. Select multiple categories
4. Click "Save Category Preferences"

**Benefits:**
- Favorite categories appear first
- Future: Customized homepage
- Better Daily Brief organization

#### 2. Favorite Sources

**Purpose**: Mark preferred news outlets

**How to use:**
1. View list of all configured sources
2. Click heart icon to favorite
3. Favorited sources highlighted
4. Click "Save Source Preferences"

**Benefits:**
- Quick access to preferred outlets
- Future: Prioritize these sources in feed
- Filter by favorites

#### 3. Display Preferences

**Articles Per Page:**
- Choose: 10, 20, 30, 50, or 100
- Affects category pages
- Lower = faster loading, Higher = less scrolling

**Default View Mode:**
- Grid (default) - Card-based layout
- List - Compact list view
- Compact - Minimal design

**Article Age Filter:**
- Show articles from last: 1, 3, 7, 14, or 30 days
- Filters out old articles
- Keeps feed fresh

**Save changes:**
Click "Save Display Preferences" button

#### 4. Refresh Settings

**Auto-Refresh Interval:**
- Every 5, 15, 30 minutes
- Every 1 or 2 hours
- Manual only (disabled)

**Manual Refresh:**
- Click "Refresh All Articles Now"
- Immediately fetches latest news
- Updates all sources

#### 5. RSS Feed Management

See [RSS Feed Management](#rss-feed-management) section below.

### Saving Changes

**Per-Section Save:**
- Each section has own save button
- Saves only that section's changes
- Shows confirmation briefly

**Save All Changes:**
- Top-right "Save All Changes" button
- Saves all unsaved changes at once
- Use when editing multiple sections

### Reset to Defaults

**Warning**: This cannot be undone!

1. Click "Reset to Defaults" button
2. Confirm in popup dialog
3. All preferences reset to original values

---

## RSS Feed Management

### What are RSS Feeds?

RSS feeds let you add custom news sources to NewsHub. Any website with an RSS feed can be added.

### Finding RSS Feeds

**Common locations:**
- Look for "RSS" icon on news websites
- Check website footer for "RSS" or "Feed"
- Add `/rss` or `/feed` to end of website URL
- Use browser extensions to find feeds

**Example RSS URLs:**
- `https://feeds.npr.org/1001/rss.xml`
- `https://rss.nytimes.com/services/xml/rss/nyt/US.xml`
- `https://feeds.bbci.co.uk/news/world/rss.xml`

### Adding a New Source

1. **Go to Settings** → RSS Feed Management
2. **Click "Add New Source"**
3. **Fill out the form:**
   - **Name**: Descriptive name (e.g., "TechCrunch")
   - **RSS URL**: Full feed URL
   - **Category**: Select appropriate category
   - **Status**: Active/Inactive

4. **Click "Test Source"** (optional)
   - Verifies URL is valid
   - Shows number of articles found
   - Displays any errors

5. **Click "Save Source"**
   - Source added to your list
   - Articles will appear in category pages

### Managing Sources

**Edit a Source:**
1. Find source in list
2. Click "Edit" button
3. Modify any field
4. Click "Save Changes"

**Delete a Source:**
1. Find source in list
2. Click "Delete" button
3. Confirm deletion
4. Source removed (articles remain until refresh)

**Activate/Deactivate:**
1. Use toggle switch on source card
2. Inactive sources not fetched
3. Useful for temporary disabling

**Test a Source:**
1. Click "Test" button
2. Verifies feed is working
3. Shows article count
4. Displays errors if any

### Source Configuration

**Required Fields:**
- Name: Display name for source
- URL: RSS feed URL
- Category: Which category articles appear in

**Optional Fields:**
- Subcategory: More specific categorization
- Update Frequency: How often to check (future use)
- Custom filters: Filter specific content (future use)

### Troubleshooting RSS Feeds

**Feed won't add:**
- Verify URL is correct
- Check URL returns XML (open in browser)
- Ensure feed uses standard RSS/Atom format
- Try "Test Source" to see error

**No articles appearing:**
- Check source is "Active"
- Wait for next auto-refresh
- Try manual refresh in settings
- Verify category is correct

**Feed stopped working:**
- Source may have changed URL
- Website may have removed RSS
- Test the source to diagnose
- Update URL or remove source

---

## Tips & Tricks

### Power User Features

**Quick Navigation:**
- Use browser back/forward buttons
- Bookmark favorite categories
- Open multiple categories in tabs

**Reading Efficiency:**
- Scan headlines first
- Use Daily Brief for overview
- Middle-click titles to open in background tabs
- Bookmark interesting articles in browser

**Search Mastery:**
- Save common searches as bookmarks
- Use keyboard shortcut (Ctrl/Cmd+K)
- Combine filters for precise results
- Try "Did You Mean" suggestions

**Organization:**
- Favorite your top 3-5 categories
- Favorite most trusted sources
- Set refresh interval based on usage
- Use article age filter to reduce clutter

### Best Practices

**For Daily News Reading:**
1. Check Daily Brief in morning
2. Scan favorite categories
3. Use search for specific topics
4. Save important articles to browser bookmarks

**For Research:**
1. Use search with multiple keywords
2. Filter by date range
3. Check multiple sources for same story
4. Download Daily Brief for archiving

**For Staying Current:**
1. Set auto-refresh to 15-30 minutes
2. Favorite categories you care about
3. Check International section for global perspective
4. Enable dark mode for comfortable evening reading

### Hidden Features

**Dark Mode:**
- Automatically detects system preference
- Manually toggle in some browsers
- Better for evening reading
- Reduces eye strain

**Print Optimization:**
- Daily Brief optimized for printing
- Removes unnecessary elements
- Black and white friendly
- Can save as PDF

**Keyboard Navigation:**
- Tab through clickable elements
- Enter to activate links
- Arrow keys to scroll
- Escape to close modals

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` (Win/Linux) or `Cmd+K` (Mac) | Open search |
| `Escape` | Close search/modal |
| `Ctrl+P` (Win/Linux) or `Cmd+P` (Mac) | Print (on Daily Brief) |
| `Tab` | Navigate through interactive elements |
| `Enter` | Activate link/button |

### Browser Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Click` (Win/Linux) or `Cmd+Click` (Mac) | Open link in new tab |
| `Ctrl+W` (Win/Linux) or `Cmd+W` (Mac) | Close current tab |
| `Ctrl+T` (Win/Linux) or `Cmd+T` (Mac) | New tab |
| `Ctrl+Tab` | Switch to next tab |
| `F5` | Refresh page |

### Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+←` | Go back |
| `Alt+→` | Go forward |
| `Home` | Scroll to top |
| `End` | Scroll to bottom |
| `Space` | Page down |
| `Shift+Space` | Page up |

---

## Frequently Asked Questions

### How do I update NewsHub?
Pull latest changes from repository and run `npm install`.

### Can I use NewsHub offline?
No, NewsHub requires internet to fetch RSS feeds.

### How often is news updated?
Based on your refresh interval setting (default: 30 minutes).

### Can I customize the color scheme?
Yes! See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for instructions.

### Is my data private?
All data is stored locally in your browser. Nothing is sent to external servers.

### Can I export my sources?
Currently no, but you can manually copy URLs from Settings.

### How many RSS sources can I add?
Unlimited! However, too many sources may slow down loading.

---

## Getting Help

Need more assistance?

- **Technical Setup**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Development**: See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Common Issues**: See [FAQ.md](./FAQ.md)
- **Contact**: Reach out to Matt or Joel

---

**Happy news reading! Enjoy NewsHub V1!**
