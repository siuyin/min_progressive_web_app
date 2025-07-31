const VERSION = "v1.0.0"
const CACHE_NAME = `multiconv-${VERSION}`
const BASE_URL = "/fc/"
const APP_STATIC_RESOURCES = [
  `${BASE_URL}`,
  `${BASE_URL}index.html`,
  `${BASE_URL}style.css`,
  `${BASE_URL}manifest.json`,
  `${BASE_URL}datastar.js`,
  `${BASE_URL}icon.png`,
  `${BASE_URL}android-chrome-192x192.png`,
]

self.addEventListener("install", (ev) => {
  ev.waitUntil(cacheStaticResources())
})

async function cacheStaticResources() {
  const cache = await caches.open(CACHE_NAME)
  cache.addAll(APP_STATIC_RESOURCES)
  console.log(`${CACHE_NAME} cache installed`)
}

self.addEventListener("activate", (ev) => {
  ev.waitUntil(activateServiceWorker())
})

async function activateServiceWorker() {
  const names = await caches.keys()
  await Promise.all(
    names.map( (name) => {
      if (name != CACHE_NAME) { return caches.delete(name) }
      return undefined
    }),
  )
  await clients.claim()
  console.log("clients claimed: service worker has control")
}

self.addEventListener("fetch", (ev) => {
  if (ev.request.mode === "navigate") {
    ev.respondWith(caches.match(`${BASE_URL}`))
    return
  }

  ev.respondWith( (async () => {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(ev.request.url)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response(null, {status: 404})
  })() )

})
