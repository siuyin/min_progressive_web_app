const VERSION = "v1.0.8"
const CACHE_NAME = `period-tracker-${VERSION}`
const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/icon.png",
  "/manifest.json",
  "/android-chrome-192x192.png",
]

self.addEventListener("install", (ev)=> {
  ev.waitUntil(( async () => {
    const cache = await caches.open(CACHE_NAME)
    cache.addAll(APP_STATIC_RESOURCES)
  } ))
  console.log(`${CACHE_NAME} installed`)
})

self.addEventListener("activate", (ev) => {
  ev.waitUntil(( async() => {
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
    console.log("clients claimed")
  } )() )
})


self.addEventListener("fetch", (ev) => {
  if (ev.request.mode === "navigate") {
    ev.respondWith(caches.match("/"))
    return
  }

  ev.respondWith((async() => {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(ev.request.url)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response(null, {status: 404})
  } ))

})
