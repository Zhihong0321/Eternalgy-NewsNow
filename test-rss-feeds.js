// Test RSS feeds for all new sources
const sources = [
  { name: "PV Magazine", url: "https://www.pv-magazine.com/feed/" },
  { name: "Solar Power World", url: "https://www.solarpowerworldonline.com/feed/" },
  { name: "CleanTechnica", url: "https://cleantechnica.com/feed/" },
  { name: "Renewable Energy World", url: "https://www.renewableenergyworld.com/feed/" },
  { name: "Recharge News", url: "https://www.rechargenews.com/rss" },
  { name: "Utility Dive", url: "https://www.utilitydive.com/feeds/news/" },
  { name: "Renewables Now", url: "https://renewablesnow.com/news/feed/" },
  { name: "Canary Media", url: "https://www.canarymedia.com/feed/" },
  { name: "Solar Industry Mag", url: "https://solarindustrymag.com/feed" },
  { name: "IRENA", url: "https://www.irena.org/rss" },
  { name: "U.S. EIA", url: "https://www.eia.gov/rss/todayinenergy.xml" },
  { name: "Energy Storage News", url: "https://www.energy-storage.news/feed/" },
  { name: "PV Tech", url: "https://www.pv-tech.org/feed/" },
  { name: "The Star", url: "https://www.thestar.com.my/rss/news/latest" },
  { name: "Malaysiakini", url: "https://www.malaysiakini.com/rss" },
  { name: "Free Malaysia Today", url: "https://www.freemalaysiatoday.com/feed/" },
  { name: "Malay Mail", url: "https://www.malaymail.com/rss" },
  { name: "NST", url: "https://www.nst.com.my/rss" },
  { name: "Astro Awani", url: "https://www.astroawani.com/rss" },
  { name: "The Edge Markets", url: "https://www.theedgemarkets.com/rss" },
  { name: "BERNAMA", url: "https://bernama.com/en/rss/news_covid-19.php" },
]

async function testFeed(source) {
  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return { name: source.name, status: "FAIL", error: `HTTP ${response.status}` }
    }

    const text = await response.text()
    const hasRSS = text.includes("<rss") || text.includes("<feed")

    return {
      name: source.name,
      status: hasRSS ? "OK" : "NO_RSS",
      size: text.length,
    }
  } catch (error) {
    return { name: source.name, status: "ERROR", error: error.message }
  }
}

async function testAll() {
  console.log("Testing RSS feeds...\n")

  for (const source of sources) {
    const result = await testFeed(source)
    const icon = result.status === "OK" ? "✓" : "✗"
    console.log(`${icon} ${result.name.padEnd(30)} ${result.status.padEnd(10)} ${result.error || result.size || ""}`)
  }
}

testAll()
