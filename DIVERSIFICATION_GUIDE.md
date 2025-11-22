# Content Diversification System

## Overview

The NewsHub homepage now uses an intelligent content diversification system that **moderates** (not limits) content distribution using a multi-factor scoring algorithm. This ensures balanced representation across all categories while respecting recency, quality, and natural content flow.

## Philosophy: Moderation, Not Limitation

**No hard caps or restrictions** - instead, the system uses:
- **Smooth penalty curves** that gradually discourage over-representation
- **Weighted scoring** that naturally balances competing factors
- **Context-aware penalties** that consider surrounding articles

This approach is **considerate of all context and surrounding factors** while gently guiding toward diversity.

---

## How It Works

### Phase 1: Category Guarantee
Ensures EVERY category (all 8) has at least 1 article by selecting the most recent from each.

### Phase 2: Multi-Factor Scoring
Each article receives a composite score (0-1) based on:

```
Final Score = (Recency × 0.35) + (Diversity × 0.35) + (Quality × 0.20) + (Category Balance × 0.10)
```

#### Recency (35% weight)
- Exponential decay: articles lose score over time
- Half-life: 24 hours (score halves every day)
- Formula: `e^(-hours / 24)`

#### Source Diversity (35% weight)
**Smooth sigmoid penalty** for over-representation:
- 0% of feed = 1.0 score (full bonus)
- 25% of feed = ~0.7 score
- 50% of feed = ~0.3 score
- 75%+ of feed = ~0.1 score

**Consecutive article penalty**:
- First consecutive from same source: 0.6× multiplier
- Second consecutive: 0.36× multiplier (0.6²)
- Third consecutive: 0.216× multiplier (0.6³)

These penalties combine multiplicatively for stronger moderation.

#### Quality (20% weight)
Content quality signals:
- Has image: +0.3
- Substantial content (200+ chars): +0.4
- Has author: +0.2
- Optimal title length (40-120 chars): +0.1

#### Category Balance (10% weight)
Boosts underrepresented categories:
- Expected: 12.5% per category (1/8)
- Below expected: bonus
- Above expected: small penalty

### Phase 3: Sort by Score
Articles ranked by composite score - highest scores appear first.

No hard cutoffs means ESPN can still appear frequently if they're producing the most recent, high-quality content, but they'll naturally be moderated if over-represented.

---

## Debug Monitoring

When viewing the "All" tab, open your browser's **Developer Console** to see:

```
📊 Content Diversification Stats (First 20 Articles)
Total Articles: 20
Category Distribution: {
  'sports': 4,
  'technology': 3,
  'us-news': 3,
  'world-news': 2,
  ...
}
Source Distribution: {
  'ESPN': 5,
  'The New York Times': 4,
  'TechCrunch': 3,
  ...
}
Top Source: ESPN (5 articles, 25.0%)
```

This helps monitor how the algorithm is performing in real-time.

---

## Configuration

All parameters can be tuned in `src/lib/diversification-utils.ts`:

```typescript
const DIVERSIFICATION_CONFIG = {
  minArticlesPerCategory: 1,    // Guaranteed articles per category

  weights: {
    recency: 0.35,      // Increase to favor newer content
    diversity: 0.35,    // Increase to push more source diversity
    quality: 0.20,      // Increase to favor high-quality articles
    category: 0.10,     // Increase to enforce category balance
  },

  recencyHalfLife: 24,  // Hours until recency score halves
};
```

### Tuning Recommendations

**If ESPN still dominates too much:**
- Increase `diversity` weight to 0.40-0.45
- Decrease `recency` weight to 0.30-0.35

**If content feels too old:**
- Increase `recency` weight to 0.40-0.45
- Decrease `diversity` weight to 0.30

**If you want more varied categories:**
- Increase `category` weight to 0.15-0.20
- Increase `minArticlesPerCategory` to 2

---

## Algorithm Advantages

✅ **Natural flow** - No jarring interruptions from hard limits
✅ **Context-aware** - Considers all surrounding factors
✅ **Responsive** - Adapts to actual content availability
✅ **Transparent** - Debug stats show exactly what's happening
✅ **Tunable** - Easy to adjust behavior via config

---

## Future Enhancements

When database integration is complete, you can enhance scoring with:

1. **Popularity scores** - Track article views/clicks
2. **User engagement** - Time spent reading, shares
3. **Source credibility ratings** - Manual ratings for quality
4. **Trending topics** - Boost articles on trending subjects
5. **Personalization** - Adjust weights based on user preferences

These can all feed into the existing scoring system without changing the architecture.

---

## Testing the System

1. **Start dev server**: `npm run dev`
2. **Open browser console**: F12 or Cmd+Option+I (Mac)
3. **Navigate to homepage**
4. **Click "All" tab** to trigger diversification
5. **Check console output** for distribution stats
6. **Scroll through articles** to verify diversity
7. **Compare to individual category pages** (chronological order)

Look for:
- ✅ All 8 categories represented
- ✅ ESPN moderated (typically 3-6 articles in first 20)
- ✅ No more than 2-3 consecutive from same source
- ✅ Recent, quality content still prioritized

---

**Last Updated**: October 28, 2025
**Version**: 1.0.4 (Content Diversification)
