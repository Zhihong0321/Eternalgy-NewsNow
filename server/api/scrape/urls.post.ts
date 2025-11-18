import * as cheerio from "cheerio"
import type { NewsItem, SourceResponse } from "@shared/types"
import { logger } from "#/utils/logger"

import { myFetch } from "#/utils/fetch"

interface ScrapeRequest {
  urls: string[]
  sourceId?: string
}

interface ArticleMetadata {
  title?: string
  description?: string
  image?: string
  author?: string
  publishedDate?: string
  siteName?: string
}

async function scrapeArticle(url: string): Promise<NewsItem | null> {
  try {
    const html: any = await myFetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })

    const $ = cheerio.load(html)
    const metadata: ArticleMetadata = {}

    // Extract Open Graph metadata
    metadata.title = $("meta[property=\"og:title\"]").attr("content")
      || $("meta[name=\"twitter:title\"]").attr("content")
      || $("title").text()
      || $("h1").first().text()

    metadata.description = $("meta[property=\"og:description\"]").attr("content")
      || $("meta[name=\"twitter:description\"]").attr("content")
      || $("meta[name=\"description\"]").attr("content")

    metadata.image = $("meta[property=\"og:image\"]").attr("content")
      || $("meta[name=\"twitter:image\"]").attr("content")

    metadata.author = $("meta[name=\"author\"]").attr("content")
      || $("meta[property=\"article:author\"]").attr("content")

    metadata.publishedDate = $("meta[property=\"article:published_time\"]").attr("content")
      || $("meta[name=\"publish_date\"]").attr("content")
      || $("time[datetime]").attr("datetime")

    metadata.siteName = $("meta[property=\"og:site_name\"]").attr("content")
      || new URL(url).hostname

    // Clean up title
    const title = metadata.title?.trim() || url

    // Parse date
    let pubDate: number | undefined
    if (metadata.publishedDate) {
      try {
        pubDate = new Date(metadata.publishedDate).valueOf()
      } catch {
        pubDate = undefined
      }
    }

    return {
      id: url,
      title,
      url,
      pubDate,
      extra: {
        hover: metadata.description?.trim(),
        info: metadata.siteName,
        icon: metadata.image
          ? {
              url: metadata.image,
              scale: 1,
            }
          : undefined,
      },
    }
  } catch (error) {
    logger.error(`Failed to scrape ${url}:`, error)
    return null
  }
}

export default defineEventHandler(async (event): Promise<SourceResponse> => {
  try {
    const body: ScrapeRequest = await readBody(event)

    if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
      throw createError({
        statusCode: 400,
        message: "urls array is required and must not be empty",
      })
    }

    if (body.urls.length > 100) {
      throw createError({
        statusCode: 400,
        message: "Maximum 100 URLs allowed per request",
      })
    }

    // Validate URLs
    const validUrls = body.urls.filter((url) => {
      try {
        const _ = new URL(url)
        return true
      } catch {
        logger.warn(`Invalid URL: ${url}`)
        return false
      }
    })

    if (validUrls.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No valid URLs provided",
      })
    }

    logger.info(`Scraping ${validUrls.length} URLs...`)

    // Scrape all URLs with rate limiting
    const items: NewsItem[] = []
    const batchSize = 5 // Process 5 URLs at a time
    const delay = 500 // 500ms delay between batches

    for (let i = 0; i < validUrls.length; i += batchSize) {
      const batch = validUrls.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(url => scrapeArticle(url)),
      )

      // Filter out null results and add to items
      items.push(...results.filter((item): item is NewsItem => item !== null))

      // Add delay between batches (except for the last batch)
      if (i + batchSize < validUrls.length) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    logger.success(`Successfully scraped ${items.length}/${validUrls.length} URLs`)

    return {
      status: "success",
      id: body.sourceId || "custom-scrape",
      updatedTime: Date.now(),
      items,
    }
  } catch (e: any) {
    logger.error(e)
    throw createError({
      statusCode: e.statusCode || 500,
      message: e instanceof Error ? e.message : "Internal Server Error",
    })
  }
})
