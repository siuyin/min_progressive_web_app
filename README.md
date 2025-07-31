# multiconv : cf and fc under the same origin

- localhost:8080/cf
- localhost:8080/fc

This does not work. As service workers, applications and caches are tied to the origin.

Instead use subdomains.

- cf.example.com/
- fc.example.com/
