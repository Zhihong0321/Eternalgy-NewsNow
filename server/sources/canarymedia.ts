import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const rss = await rss2json("https://www.canarymedia.com/rss-feed")
  if (!rss) return []

  return rss.items.slice(0, 30).map((item): NewsItem => ({
    id: item.link,
    title: item.title,
    url: item.link,
    pubDate: new Date(item.created).valueOf(),
  }))
})
