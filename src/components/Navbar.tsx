"use client";

import React, { useState } from "react";
import {
  Wind,
  ShieldCheck,
  Search,
  Sparkles,
  Home,
  Clock,
  Shuffle,
  Calculator,
  Info,
  AlertTriangle,
} from "lucide-react";
import { AirQualityData, AirQualityScale, GeocodingResult } from "@/types";

interface NavbarProps {
  currentAqiData: AirQualityData | null;
  onScaleChange: (scale: AirQualityScale) => void;
  onLocationSelect: (city: string, lat: number, lng: number) => void;
  onOpenSources: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({
  currentAqiData,
  onScaleChange,
  onLocationSelect,
  onOpenSources,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchAbortRef = React.useRef<AbortController | null>(null);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      searchAbortRef.current = controller;

      try {
        const res = await fetch(`/api/locations?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowDropdown(true);
        }
      } catch (err: unknown) {
        if (
          !(err instanceof DOMException && err.name === "AbortError") &&
          !(err instanceof Error && err.name === "AbortError")
        ) {
          console.error("Search failed", err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 250);
  };

  const selectCity = (city: string, lat: number, lng: number) => {
    onLocationSelect(city, lat, lng);
    setSearchQuery(city);
    setShowDropdown(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "routine", label: "Air-Safe Routine", icon: Clock },
    { id: "indoor", label: "Indoor Air Guide", icon: ShieldCheck },
    { id: "alternatives", label: "Cleaner Choices", icon: Shuffle },
    { id: "calculator", label: "Impact Calculator", icon: Calculator },
    { id: "copilot", label: "AI Copilot", icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-forest-100 shadow-sm">
      {/* Top Banner if Air is Severe */}
      {currentAqiData && currentAqiData.aqi > 300 && (
        <div
          role="alert"
          className="bg-purple-900 text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between"
        >
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-purple-300 flex-shrink-0" />
            <span>
              <strong>Severe Smog Alert for {currentAqiData.location.name}:</strong> Ambient AQI is{" "}
              {currentAqiData.aqi}. Suspend morning outdoor cardio; keep all windows closed during inversion hours.
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-tealbrand-300 flex items-center justify-center shadow-md">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-forest-950 tracking-tight">AirWise</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full border border-forest-200">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                Understand your air. Protect your routine. Make cleaner choices.
              </p>
            </div>
          </div>

          {/* Location Autocomplete Search */}
          <div className="relative w-48 sm:w-72 md:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search city (e.g. Delhi, London)..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
                aria-label="Search city or location"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto z-50">
                {searchResults.map((r) => (
                  <button
                    key={`${r.id}-${r.name}`}
                    onClick={() => selectCity(r.name, r.latitude, r.longitude)}
                    className="w-full px-4 py-2.5 text-left text-xs sm:text-sm hover:bg-forest-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <span className="font-semibold text-gray-900">{r.name}</span>
                      {r.admin1 && <span className="text-gray-500 text-xs">, {r.admin1}</span>}
                    </div>
                    <span className="text-[11px] text-gray-400">{r.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scale Selector & Sources Button */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => onScaleChange("IN_CPCB")}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                  currentAqiData?.scale === "IN_CPCB"
                    ? "bg-forest-800 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Indian Central Pollution Control Board (CPCB) Standard"
              >
                India (CPCB)
              </button>
              <button
                onClick={() => onScaleChange("US_EPA")}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                  currentAqiData?.scale === "US_EPA"
                    ? "bg-forest-800 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="United States Environmental Protection Agency AQI Standard"
              >
                US EPA
              </button>
            </div>

            <button
              onClick={onOpenSources}
              className="p-2 text-gray-600 hover:text-forest-800 rounded-lg hover:bg-gray-100 transition-colors"
              title="Methodology, Standards & Scientific Sources"
              aria-label="View scientific sources and methodology"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav
          className="flex space-x-1 sm:space-x-2 border-t border-gray-100 pt-1 pb-2 overflow-x-auto"
          aria-label="Primary application navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-forest-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-forest-900 hover:bg-forest-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
