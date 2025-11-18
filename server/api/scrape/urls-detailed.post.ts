import * as cheerio from "cheerio"
import type { NewsItem, SourceResponse } from "@shared/types"
import { logger } from "#/utils/logger"

import { myFetch } from "#/utils/fetch"

interface DetailedScrapeRequest {
  urls: string[]
  sourceId?: string
  extractContent?: boolean // Extract full article content
  extractImages?: boolean // Extract article images
}

interface DetailedArticleMetadata {
  title?: string
  description?: string
  image?: string
  author?: string
  publishedDate?: string
  siteName?: string
  content?: string
  images?: string[]
  keywords?: string[]
}

async function scrapeDetailedArticle(
  url: string,
  options: { extractContent?: boolean, extractImages?: boolean },
): Promise<NewsItem | null> {
  try {
    const html: any = await myFetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })

    const $ = cheerio.load(html)
    const metadata: DetailedArticleMetadata = {}

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
      || $("[rel=\"author\"]").text()

    metadata.publishedDate = $("meta[property=\"article:published_time\"]").attr("content")
      || $("meta[name=\"publish_date\"]").attr("content")
      || $("time[datetime]").attr("datetime")
      || $("meta[name=\"date\"]").attr("content")

    metadata.siteName = $("meta[property=\"og:site_name\"]").attr("content")
      || new URL(url).hostname

    metadata.keywords = $("meta[name=\"keywords\"]").attr("content")?.split(",").map(k => k.trim())

    // Extract article content if requested
    if (options.extractContent) {
      // Try common article selectors
      const contentSelectors = [
        "article",
        "[role=\"article\"]",
        ".article-content",
        ".post-content",
        ".entry-content",
        ".content",
        "main",
      ]

      for (const selector of contentSelectors) {
        const $content = $(selector).first()
        if ($content.length > 0) {
          // Remove unwanted elements
          $content.find("script, style, nav, aside, .advertisement, .ad, .social-share").remove()

          // Get text content
          metadata.content = $content.text()
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 5000) // Limit to 5000 characters

          break
        }
      }
    }

    // Extract images if requested
    if (options.extractImages) {
      metadata.images = []
      $("article img, .article-content img, .post-content img").each((_, el) => {
        const src = $(el).attr("src")
        if (src && !src.includes("data:image")) {
          try {
            const imageUrl = new URL(src, url).href
            metadata.images!.push(imageUrl)
          } catch {
            // Invalid URL, skip
          }
        }
      })
      metadata.images = metadata.images.slice(0, 10) // Limit to 10 images
    }

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

    const newsItem: NewsItem = {
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

    // Add extended metadata if available
    if (metadata.content || metadata.images || metadata.keywords) {
      newsItem.extra = {
        ...newsItem.extra,
        // @ts-expect-error - Extended metadata
        content: metadata.content,
        images: metadata.images,
        keywords: metadata.keywords,
        author: metadata.author,
      }
    }

    return newsItem
  } catch (error) {
    logger.error(`Failed to scrape ${url}:`, error)
    return null
  }
}

export default defineEventHandler(async (event): Promise<SourceResponse> => {
  try {
    const body: DetailedScrapeRequest = await readBody(event)

    if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
      throw createError({
        statusCode: 400,
        message: "urls array is required and must not be empty",
      })
    }

    if (body.urls.length > 50) {
      throw createError({
        statusCode: 400,
        message: "Maximum 50 URLs allowed per request for detailed scraping",
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

    logger.info(`Scraping ${validUrls.length} URLs with detailed extraction...`)

    // Scrape all URLs with rate limiting
    const items: NewsItem[] = []
    const batchSize = 3 // Process 3 URLs at a time for detailed scraping
    const delay = 1000 // 1 second delay between batches

    for (let i = 0; i < validUrls.length; i += batchSize) {
      const batch = validUrls.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(url => scrapeDetailedArticle(url, {
          extractContent: body.extractContent,
          extractImages: body.extractImages,
        })),
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
      id: body.sourceId || "custom-scrape-detailed",
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
