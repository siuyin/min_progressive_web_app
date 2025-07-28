const VERSION = "v1.0.7"
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
