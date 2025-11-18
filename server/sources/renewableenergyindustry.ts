import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const rss = await rss2json("https://www.renewable-energy-industry.com/28-news-and-rss/233-rss-feed-rei")
  if (!rss) return []

  return rss.items.slice(0, 30).map((item): NewsItem => ({
    id: item.link,
    title: item.title,
    url: item.link,
    pubDate: new Date(item.created).valueOf(),
  }))
})
