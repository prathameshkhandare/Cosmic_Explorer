import axios from "axios";

const API = axios.create({
//   baseURL: "http://localhost:4000",
baseURL:import.meta.env.VITE_API_BASE_URL,
});

export const getTodayApod = () => API.get("/api/apod");
export const getApodByDate = (date) => API.get("/api/apod", { params: { date } });
export const getRecentApods = (count = 10) =>
  API.get("/api/apod/recent", { params: { count } });
export const getApodRange = (start, end) =>
  API.get("/api/apod/range", { params: { start, end } });
