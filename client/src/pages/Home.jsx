import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

import {
  getTodayApod,
  getApodByDate,
  getRecentApods,
  getApodRange,
} from "../api/api";

// Helpers
const formatDisplayDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDate = (date) => new Date(date).toISOString().split("T")[0];

export default function Home() {
  const [todayAPOD, setTodayAPOD] = useState(null);
  const [recentAPODs, setRecentAPODs] = useState([]);
  const [rangeResults, setRangeResults] = useState([]);

  const [selectedAPOD, setSelectedAPOD] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [searchMode, setSearchMode] = useState("single");
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Load Today + Recent
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [todayRes, recentRes] = await Promise.all([
        getTodayApod(),
        getRecentApods(6),
      ]);

      setTodayAPOD(todayRes.data);
      setRecentAPODs(recentRes.data);
    } catch (error) {
      console.error("Initial load failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // SEARCH: Single
  const handleSingleSearch = async (e) => {
    e.preventDefault();
    if (!singleDate) return;

    setIsSearching(true);
    try {
      const res = await getApodByDate(singleDate);
      setSelectedAPOD(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Single search failed:", error);
    }
    setIsSearching(false);
  };

  // SEARCH: Range
  const handleRangeSearch = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setIsSearching(true);
    try {
      const res = await getApodRange(startDate, endDate);
      setRangeResults(res.data);
    } catch (error) {
      console.error("Range search failed:", error);
    }
    setIsSearching(false);
  };

  const openModal = (apod) => {
    setSelectedAPOD(apod);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAPOD(null);
  };

  // LOADING SCREEN
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
          <p className="text-white text-lg">Loading cosmic wonders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              🌌
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NASA APOD</h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Astronomy Picture of the Day
              </p>
            </div>
          </div>

          <nav className="flex gap-2">
            <span className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm font-medium">
              Home
            </span>

            <Link
              to={createPageUrl("Gallery")}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm"
            >
              Gallery
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-12">

        {/* HERO - Today's APOD */}
        {todayAPOD && (
          <section
            className="relative rounded-3xl overflow-hidden min-h-[60vh] group cursor-pointer"
            onClick={() => openModal(todayAPOD)}
          >
            <img
              src={todayAPOD.hdurl || todayAPOD.url}
              alt={todayAPOD.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 md:p-12">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium">
                ✨ Today's Picture
              </span>

              <h2 className="text-3xl md:text-5xl mt-4 font-bold text-white max-w-3xl">
                {todayAPOD.title}
              </h2>

              <p className="text-slate-300 max-w-2xl line-clamp-3">
                {todayAPOD.explanation}
              </p>
            </div>
          </section>
        )}

        {/* SEARCH SECTION */}
        <section className="bg-gradient-to-r from-slate-900/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold text-white mb-2">Explore the Cosmos</h2>
          <p className="text-slate-400 mb-6">
            Search for astronomical pictures by date or date range.
          </p>

          {/* Search Tabs */}
          <div className="flex gap-2 mb-6  ">
            <button
              onClick={() => setSearchMode("single")}
              className={` cursor-pointer px-4 py-2 rounded-lg ${
                searchMode === "single"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              📅 Single Date
            </button>

            <button
              onClick={() => setSearchMode("range")}
              className={` cursor-pointer px-4 py-2 rounded-lg ${
                searchMode === "range"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              📆 Date Range
            </button>
          </div>

          {/* SINGLE DATE SEARCH */}
          {searchMode === "single" && (
            <form onSubmit={handleSingleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
              />

              <button
                type="submit"
                disabled={!singleDate || isSearching}
                className=" cursor-pointer px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white"
              >
                {isSearching ? "Searching..." : "🔍 Get Picture"}
              </button>
            </form>
          )}

          {/* RANGE SEARCH */}
          {searchMode === "range" && (
            <form onSubmit={handleRangeSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
                />

                <span className="text-slate-500 hidden sm:block">to</span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
                />

                <button
                  type="submit"
                  disabled={!startDate || !endDate || isSearching}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white"
                >
                  {isSearching ? "Searching..." : "🔍 Get Pictures"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* RANGE RESULTS */}
        {rangeResults.length > 0 && (
          <section className="space-y-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-white">Search Results</h2>
              <button
                onClick={() => setRangeResults([])}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕ Clear
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rangeResults.map((apod) => (
                <div
                  key={apod.date}
                  onClick={() => openModal(apod)}
                  className="group cursor-pointer bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={apod.url}
                      alt={apod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-white line-clamp-1">
                      {apod.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {formatDisplayDate(apod.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECENT DISCOVERIES */}
        <section className="space-y-6">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Discoveries</h2>
              <p className="text-slate-400">Last 6 images</p>
            </div>

            <Link
              to={createPageUrl("Gallery")}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAPODs.map((apod) => (
              <div
                key={apod.date}
                onClick={() => openModal(apod)}
                className="group cursor-pointer bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-1">
                    {apod.title}
                  </h3>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{formatDisplayDate(apod.date)}</span>
                    {apod.copyright && (
                      <span className="text-slate-500 text-xs truncate max-w-[100px]">
                        © {apod.copyright}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-500">
          <p>Data provided by NASA APOD API</p>
        </div>
      </footer>

      {/* MODAL */}
      {isModalOpen && selectedAPOD && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
            >
              ✕
            </button>

            <div className="overflow-y-auto max-h-[90vh]">
              <img
                src={selectedAPOD.hdurl || selectedAPOD.url}
                alt={selectedAPOD.title}
                className="w-full max-h-[50vh] object-contain bg-black"
              />

              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white">{selectedAPOD.title}</h2>

                <p className="text-slate-400">📅 {formatDisplayDate(selectedAPOD.date)}</p>

                <p className="text-slate-300">{selectedAPOD.explanation}</p>

                <div className="flex gap-3 pt-2">
                  {selectedAPOD.hdurl && (
                    <a
                      href={selectedAPOD.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      HD Image
                    </a>
                  )}

                  <a
                    href={selectedAPOD.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Open Original
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
