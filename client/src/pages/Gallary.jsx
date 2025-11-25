import React, { useState, useEffect } from "react";
import { getRecentApods } from "../api/api";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

const formatDisplayDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Gallery() {
  const [apods, setApods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAPOD, setSelectedAPOD] = useState(null);

  const [days, setDays] = useState(10); // default

  useEffect(() => {
    loadGallery(days);
  }, [days]);

  const loadGallery = async (count) => {
    setIsLoading(true);
    try {
      const res = await getRecentApods(count);
      setApods(res.data);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (apod) => {
    setSelectedAPOD(apod);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAPOD(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              🖼️
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">APOD Gallery</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Browse cosmic images</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-2">
            <Link
              to={"/"}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition"
            >
              Home
            </Link>
            <span className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm font-medium">
              Gallery
            </span>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-10 space-y-10">
        
        <h2 className="text-3xl font-bold text-white text-center">
          Cosmic Gallery
        </h2>
        <p className="text-center text-slate-400">
          Select how many recent APOD images to view
        </p>

        {/* Days Selector */}
        <div className="flex justify-center gap-3 mb-8">
          {[10, 15, 20].map((option) => (
            <button
              key={option}
              onClick={() => setDays(option)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
                ${
                  days === option
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400"
                    : "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              Last {option} Days
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-slate-400 text-center">Loading gallery...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apods.map((apod) => (
              <div
                key={apod.date}
                onClick={() => openModal(apod)}
                className="group cursor-pointer bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:-translate-y-1 transition-all"
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
                  <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {apod.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {formatDisplayDate(apod.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white rounded-full"
            >
              ✕
            </button>

            <div className="overflow-y-auto max-h-[90vh]">
              {/* Image */}
              <img
                src={selectedAPOD.hdurl || selectedAPOD.url}
                alt={selectedAPOD.title}
                className="w-full max-h-[50vh] object-contain bg-black"
              />

              {/* Details */}
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white">{selectedAPOD.title}</h2>

                <p className="text-slate-400">📅 {formatDisplayDate(selectedAPOD.date)}</p>

                <p className="text-slate-300">{selectedAPOD.explanation}</p>

                <div className="flex gap-3 pt-2">
                  {selectedAPOD.hdurl && (
                    <a
                      href={selectedAPOD.hdurl}
                      target="_blank"
                      className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      HD Image
                    </a>
                  )}

                  <a
                    href={selectedAPOD.url}
                    target="_blank"
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
