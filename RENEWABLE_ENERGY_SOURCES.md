# Renewable Energy News Sources

This document lists the renewable and solar energy news sources that have been added to NewsNow.

## Added Sources (18 total)

All sources are configured in the "renewable" (可再生能源) column with RSS feed integration.

| Source ID | Name | Website | RSS Feed |
|-----------|------|---------|----------|
| pvmagazine | PV Magazine | https://www.pv-magazine.com | ✓ |
| solarpowerworld | Solar Power World | https://www.solarpowerworldonline.com | ✓ |
| cleantechnica | CleanTechnica | https://cleantechnica.com | ✓ |
| renewableenergyworld | Renewable Energy World | https://www.renewableenergyworld.com | ✓ |
| rechargenews | Recharge News | https://www.rechargenews.com | ✓ |
| utilitydive | Utility Dive | https://www.utilitydive.com | ✓ |
| renewablesnow | Renewables Now | https://renewablesnow.com | ✓ |
| canarymedia | Canary Media | https://www.canarymedia.com | ✓ |
| solarindustrymag | Solar Industry Magazine | https://solarindustrymag.com | ✓ |
| irena | IRENA | https://www.irena.org | ✓ |
| eia | U.S. EIA | https://www.eia.gov | ✓ |
| energystoragenews | Energy-Storage.news | https://www.energy-storage.news | ✓ |
| pvtech | PV Tech | https://www.pv-tech.org | ✓ |
| renewableenergyindustry | Renewable Energy Industry | https://www.renewable-energy-industry.com | ✓ |
| solarbuildermag | Solar Builder Magazine | https://solarbuildermag.com | ✓ |
| europeanenergyinnovation | European Energy Innovation | https://www.europeanenergyinnovation.eu | ✓ |
| solarquarter | SolarQuarter | https://solarquarter.com | ✓ |
| renewableenergyfocus | Renewable Energy Focus | https://www.renewableenergyfocus.com | ✓ |

## Configuration Details

- **Column**: renewable (可再生能源)
- **Update Interval**: 30 minutes (1800000ms) for most sources, 60 minutes for IRENA
- **Implementation**: RSS feed parsing using the `rss2json` utility
- **Colors**: Various colors (yellow, orange, green, emerald, teal, cyan, lime, amber, blue, indigo, violet) for visual distinction

## Files Modified

1. `shared/metadata.ts` - Added "renewable" column definition
2. `shared/pre-sources.ts` - Added 18 renewable energy source configurations
3. `shared/sources.json` - Added compiled source entries
4. `server/sources/*.ts` - Created 18 RSS feed handler files

## Notes

- Sources marked as "No active public RSS feed" in the original list were excluded:
  - Greentech Media (now integrated into Wood Mackenzie)
  - Solar Magazine

## Testing

To test the sources, start the development server:

```bash
npm run dev
```

Then navigate to the "可再生能源" (Renewable) column in the application.
