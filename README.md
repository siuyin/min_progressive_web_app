# multiconv : cf and fc under the same origin

- localhost:8080/cf
- localhost:8080/fc

This does not work. As service workers, applications and caches are tied to the origin.

Instead use subdomains.

- cf.example.com/
- fc.example.com/

## One PWA with cf and fc cached

To get the above working, use one manifest and one service worker and
cache the requried paths:

- /
- /cf/
- /fc/
