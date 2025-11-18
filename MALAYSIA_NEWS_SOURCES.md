# Malaysian News Sources

This document lists the Malaysian news sources that have been added to NewsNow.

## Added Sources (8 total)

All sources are configured in the "malaysia" (马来西亚) column with RSS feed integration.

| Source ID | Name | Website | RSS Feed |
|-----------|------|---------|----------|
| thestar | The Star Online | https://www.thestar.com.my | ✓ |
| malaysiakini | Malaysiakini | https://www.malaysiakini.com | ✓ |
| freemalaysiatoday | Free Malaysia Today (FMT) | https://www.freemalaysiatoday.com | ✓ |
| malaymail | Malay Mail | https://www.malaymail.com | ✓ |
| nst | New Straits Times (NST) | https://www.nst.com.my | ✓ |
| astroawani | Astro Awani | https://www.astroawani.com | ✓ |
| theedgemarkets | The Edge Markets | https://www.theedgemarkets.com | ✓ |
| bernama | BERNAMA (National News Agency) | https://bernama.com | ✓ |

## Configuration Details

- **Column**: malaysia (马来西亚)
- **Update Interval**: 30 minutes (1800000ms) for all sources
- **Implementation**: RSS feed parsing using the `rss2json` utility
- **Colors**: Various colors (blue, red, orange, indigo, slate, purple, emerald, cyan) for visual distinction

## Files Modified

1. `shared/metadata.ts` - Added "malaysia" column definition
2. `shared/pre-sources.ts` - Added 8 Malaysian news source configurations
3. `shared/sources.json` - Added compiled source entries
4. `server/sources/*.ts` - Created 8 RSS feed handler files

## Notes

- Sources without readily available public RSS feeds were excluded:
  - Berita Harian (BH) - www.bharian.com.my
  - Harian Metro - www.hmetro.com.my

These sources may require custom scraping implementations if needed in the future.

## Testing

To test the sources, start the development server:

```bash
npm run dev
```

Then navigate to the "马来西亚" (Malaysia) column in the application.

## Language Support

Most Malaysian news sources provide content in:
- English (primary for most sources)
- Bahasa Malaysia (for some sources like Astro Awani, BERNAMA)

The RSS feeds will automatically pull the latest articles in their respective languages.
