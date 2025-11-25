// controllers/apodController.js
const cache = require("../services/cacheService");
const { fetchAPOD } = require("../services/nasaService");

function keyForDate(date) {
  return `apod:${date}`;
}

module.exports.getTodayOrByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const targetDate = date ? date : new Date().toISOString().slice(0, 10);
    const key = keyForDate(targetDate);

    if (cache.has(key)) {
      return res.json(cache.get(key));
    }

    const data = await fetchAPOD({ date: targetDate });
    cache.set(key, data);
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch APOD" });
  }
};

module.exports.getRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "start and end are required" });
    }

    const key = `apod_range:${start}:${end}`;
    if (cache.has(key)) {
      return res.json(cache.get(key));
    }

    const data = await fetchAPOD({ start_date: start, end_date: end });
    cache.set(key, data);
    return res.json(data);
  } catch (error) {
    return res.status(502).json({ error: "Failed to fetch APOD range" });
  }
};

module.exports.getRecent = async (req, res) => {
  try {
    const count = parseInt(req.query.count || "10", 10);

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (count - 1));

    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const key = `apod_recent:${count}`;

    if (cache.has(key)) {
      return res.json(cache.get(key));
    }

    const data = await fetchAPOD({ start_date: startStr, end_date: endStr });
    cache.set(key, data);
    return res.json(data);
  } catch (error) {
    return res.status(502).json({ error: "Failed to fetch recent APODs" });
  }
};
