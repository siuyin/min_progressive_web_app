const VERSION = "v1.0.9"
const CACHE_NAME = `period-tracker-${VERSION}`
const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/android-chrome-192x192.png",
]

self.addEventListener("install", (ev)=> {
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
      if (name != CACHE_NAME) {
        return caches.delete(name)
      }
      return undefined
    }),
  )
  await clients.claim()
  console.log("clients claimed: service worker has control")
}


self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("/"))
    return
  }

  event.respondWith((async() => {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(event.request.url)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response(null, {status: 404})
  } )() )

})

async function fetchFromCache(event) {
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("/"))
    return
  }

  event.respondWith(fetchFromCacheRequestUrl(event))
}

async function fetchFromCacheRequestUrl(event) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(event.request.url)
  if (cachedResponse) {
    console.log(`cached: ${event.request.url}`)
    return cachedResponse
  }
  return new Response(null, {status: 404})
}
