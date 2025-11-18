# News Sources Summary

This document provides an overview of all custom news sources added to the NewsNow application.

## Overview

**Total Sources Added**: 26 sources across 2 new categories

### Categories Added

1. **Renewable Energy** (可再生能源) - 18 sources
2. **Malaysia** (马来西亚) - 8 sources

---

## Renewable Energy Sources (18)

International renewable and solar energy news coverage.

| # | Source | Type | Region |
|---|--------|------|--------|
| 1 | PV Magazine | Solar | Global |
| 2 | Solar Power World | Solar | USA |
| 3 | CleanTechnica | Clean Energy | Global |
| 4 | Renewable Energy World | Renewable | Global |
| 5 | Recharge News | Renewable | Global |
| 6 | Utility Dive | Energy/Utilities | USA |
| 7 | Renewables Now | Renewable | Global |
| 8 | Canary Media | Clean Energy | USA |
| 9 | Solar Industry Magazine | Solar | USA |
| 10 | IRENA | Policy/Research | Global |
| 11 | U.S. EIA | Energy Data | USA |
| 12 | Energy-Storage.news | Storage | Global |
| 13 | PV Tech | Solar | Global |
| 14 | Renewable Energy Industry | Renewable | Europe |
| 15 | Solar Builder Magazine | Solar | USA |
| 16 | European Energy Innovation | Energy | Europe |
| 17 | SolarQuarter | Solar | India/Asia |
| 18 | Renewable Energy Focus | Renewable | Global |

**Update Frequency**: 30 minutes (60 minutes for IRENA)

---

## Malaysian News Sources (8)

Top Malaysian news outlets covering national and regional news.

| # | Source | Language | Focus |
|---|--------|----------|-------|
| 1 | The Star Online | English | General News |
| 2 | Malaysiakini | English/BM | Independent News |
| 3 | Free Malaysia Today | English | General News |
| 4 | Malay Mail | English | General News |
| 5 | New Straits Times | English | General News |
| 6 | Astro Awani | BM/English | Broadcast News |
| 7 | The Edge Markets | English | Business/Finance |
| 8 | BERNAMA | English/BM | National Agency |

**Update Frequency**: 30 minutes

---

## Technical Implementation

### Architecture

All sources use RSS feed integration via the `rss2json` utility:

```typescript
export default defineSource(async () => {
  const rss = await rss2json("RSS_FEED_URL")
  if (!rss) return []

  return rss.items.slice(0, 30).map((item): NewsItem => ({
    id: item.link,
    title: item.title,
    url: item.link,
    pubDate: new Date(item.created).valueOf(),
  }))
})
```

### Files Structure

```
newsnow/
├── shared/
│   ├── metadata.ts          # Column definitions
│   ├── pre-sources.ts       # Source configurations
│   └── sources.json         # Compiled sources
└── server/
    └── sources/
        ├── pvmagazine.ts
        ├── thestar.ts
        └── ... (24 more files)
```

### Configuration

Each source includes:
- **name**: Display name
- **column**: Category assignment
- **home**: Website URL
- **color**: UI color theme
- **interval**: Update frequency (milliseconds)

---

## Excluded Sources

### Renewable Energy
- Greentech Media (integrated into Wood Mackenzie, no public RSS)
- Solar Magazine (no active public RSS feed)

### Malaysia
- Berita Harian (no readily available public RSS)
- Harian Metro (no readily available public RSS)

---

## Usage

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Testing Sources
Navigate to the respective columns in the application:
- "可再生能源" for renewable energy news
- "马来西亚" for Malaysian news

---

## Maintenance

### Adding New Sources

1. Add source configuration to `shared/pre-sources.ts`
2. Add compiled entry to `shared/sources.json`
3. Create RSS handler in `server/sources/[source-id].ts`
4. Test the source in development mode

### Updating RSS Feeds

If an RSS feed URL changes, update:
1. The handler file in `server/sources/`
2. Documentation in this file

---

## Documentation Files

- `RENEWABLE_ENERGY_SOURCES.md` - Detailed renewable energy sources
- `MALAYSIA_NEWS_SOURCES.md` - Detailed Malaysian news sources
- `NEWS_SOURCES_SUMMARY.md` - This file (overview)

---

**Last Updated**: 2025-01-18
