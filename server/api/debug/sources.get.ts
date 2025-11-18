import { getters } from "#/getters"

export default defineEventHandler(() => {
  const loadedSources = Object.keys(getters)
  const configuredSources = Object.keys(sources)

  const missing = configuredSources.filter(id => !loadedSources.includes(id))
  const extra = loadedSources.filter(id => !configuredSources.includes(id))

  return {
    loaded: loadedSources.sort(),
    configured: configuredSources.sort(),
    missing,
    extra,
    counts: {
      loaded: loadedSources.length,
      configured: configuredSources.length,
    },
  }
})
