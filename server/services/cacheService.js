const { LRUCache } = require("lru-cache");

const cache = new LRUCache({
  max: parseInt(process.env.CACHE_MAX_ITEMS || "200", 10),
  ttl: parseInt(process.env.CACHE_TTL_MS || "86400000", 10) // ms
});

module.exports = cache;
