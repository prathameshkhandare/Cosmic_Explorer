// services/nasaService.js
const axios = require("axios");

const NASA_BASE = "https://api.nasa.gov/planetary/apod";
const NASA_KEY = process.env.NASA_API_KEY;

async function fetchAPOD(params) {
  const response = await axios.get(NASA_BASE, {
    params: { api_key: NASA_KEY, ...params },
    timeout: 10000
  });
  return response.data;
}

module.exports = { fetchAPOD };
