const VERSION = "v1.0.1"
const CACHE_NAME = `tempconv-${VERSION}`
const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.json",
  "/datastar.js",
  "/icon.png",
  "/android-chrome-192x192.png",
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
    ev.respondWith(caches.match("/"))
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
