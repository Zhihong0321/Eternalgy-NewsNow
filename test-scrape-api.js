// Test script for the new URL scraping API
// Run with: node test-scrape-api.js

const testUrls = [
  "https://www.pv-magazine.com/",
  "https://www.thestar.com.my/",
  "https://cleantechnica.com/",
]

async function testBasicScraping() {
  console.log("Testing Basic URL Scraping API...\n")

  try {
    const response = await fetch("http://localhost:3000/api/scrape/urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: testUrls,
        sourceId: "test-scrape",
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    console.log("✓ API Response:")
    console.log(`  Status: ${data.status}`)
    console.log(`  Source ID: ${data.id}`)
    console.log(`  Updated: ${new Date(data.updatedTime).toISOString()}`)
    console.log(`  Articles scraped: ${data.items.length}/${testUrls.length}\n`)

    console.log("✓ Sample Articles:")
    data.items.slice(0, 3).forEach((item, i) => {
      console.log(`\n  ${i + 1}. ${item.title}`)
      console.log(`     URL: ${item.url}`)
      console.log(`     Source: ${item.extra?.info || "N/A"}`)
      if (item.pubDate) {
        console.log(`     Date: ${new Date(item.pubDate).toLocaleDateString()}`)
      }
    })

    console.log("\n✓ Basic scraping test PASSED!\n")
    return true
  } catch (error) {
    console.error("✗ Basic scraping test FAILED:", error.message)
    return false
  }
}

async function testDetailedScraping() {
  console.log("Testing Detailed URL Scraping API...\n")

  try {
    const response = await fetch("http://localhost:3000/api/scrape/urls-detailed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: [testUrls[0]], // Test with just one URL
        sourceId: "test-scrape-detailed",
        extractContent: true,
        extractImages: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    console.log("✓ API Response:")
    console.log(`  Status: ${data.status}`)
    console.log(`  Articles scraped: ${data.items.length}\n`)

    if (data.items.length > 0) {
      const item = data.items[0]
      console.log("✓ Detailed Article Data:")
      console.log(`  Title: ${item.title}`)
      console.log(`  URL: ${item.url}`)
      console.log(`  Source: ${item.extra?.info || "N/A"}`)
      console.log(`  Content length: ${item.extra?.content?.length || 0} chars`)
      console.log(`  Images found: ${item.extra?.images?.length || 0}`)
      console.log(`  Keywords: ${item.extra?.keywords?.join(", ") || "N/A"}`)
    }

    console.log("\n✓ Detailed scraping test PASSED!\n")
    return true
  } catch (error) {
    console.error("✗ Detailed scraping test FAILED:", error.message)
    return false
  }
}

async function testErrorHandling() {
  console.log("Testing Error Handling...\n")

  try {
    // Test with invalid URLs
    const response = await fetch("http://localhost:3000/api/scrape/urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: ["not-a-valid-url", "also-invalid"],
      }),
    })

    const data = await response.json()

    if (response.status === 400) {
      console.log("✓ Correctly rejected invalid URLs")
      console.log(`  Error: ${data.message}\n`)
      return true
    } else {
      console.log("✗ Should have returned 400 for invalid URLs\n")
      return false
    }
  } catch (error) {
    console.error("✗ Error handling test FAILED:", error.message)
    return false
  }
}

async function runAllTests() {
  console.log("=".repeat(60))
  console.log("NewsNow URL Scraping API Tests")
  console.log("=".repeat(60))
  console.log()

  const results = []

  results.push(await testBasicScraping())
  results.push(await testDetailedScraping())
  results.push(await testErrorHandling())

  console.log("=".repeat(60))
  console.log("Test Summary")
  console.log("=".repeat(60))

  const passed = results.filter(r => r).length
  const total = results.length

  console.log(`\nPassed: ${passed}/${total}`)

  if (passed === total) {
    console.log("\n✓ All tests PASSED! 🎉\n")
  } else {
    console.log(`\n✗ ${total - passed} test(s) FAILED\n`)
  }
}

// Run tests
runAllTests().catch(console.error)
