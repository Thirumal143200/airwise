"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AqiHeroCard } from "@/components/AqiHeroCard";
import { PollutantsGrid } from "@/components/PollutantsGrid";
import { HourlyForecastBar } from "@/components/HourlyForecastBar";
import { RoutineSection } from "@/components/RoutineSection";
import { IndoorAirSection } from "@/components/IndoorAirSection";
import { SustainableAlternativesSection } from "@/components/SustainableAlternativesSection";
import { ImpactCalculatorSection } from "@/components/ImpactCalculatorSection";
import { CopilotSection } from "@/components/CopilotSection";
import { SourcesAndMethodologyModal } from "@/components/SourcesAndMethodologyModal";
import {
  AirQualityData,
  AirQualityScale,
  RoutineSlot,
  UserProfile,
} from "@/types";
import { generateDailyRoutine } from "@/lib/routine/routineEngine";
import {
  MapPin,
  Sparkles,
  Shield,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Heart,
  Wind,
} from "lucide-react";

const DEFAULT_PROFILE: UserProfile = {
  householdType: "family_with_kids",
  commuteMode: "private_car_petrol",
  dailyCommuteKm: 14,
  exerciseHabit: "morning_outdoor",
  budgetTier: "low_cost",
  hasAirPurifier: true,
  hasExhaustFan: true,
  hasVulnerableMember: true,
};

const POPULAR_CITIES = [
  { name: "Delhi", lat: 28.6139, lng: 77.209, country: "India" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, country: "India" },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, country: "India" },
  { name: "London", lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
  { name: "New York", lat: 40.7128, lng: -74.006, country: "United States" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentCity, setCurrentCity] = useState<string>("Delhi");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.209,
  });
  const [scale, setScale] = useState<AirQualityScale>("IN_CPCB");
  const [aqiData, setAqiData] = useState<AirQualityData | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [routine, setRoutine] = useState<RoutineSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSourcesOpen, setIsSourcesOpen] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch air quality data
  const fetchAirQuality = async (cityName: string, lat: number, lng: number, chosenScale: AirQualityScale) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(
        `/api/air-quality?city=${encodeURIComponent(cityName)}&lat=${lat}&lng=${lng}&scale=${chosenScale}`
      );
      if (!res.ok) {
        throw new Error(`Air Quality API error (${res.status})`);
      }
      const data: AirQualityData = await res.json();
      setAqiData(data);

      // Generate initial routine
      const slots = generateDailyRoutine(data, profile);
      setRoutine(slots);
    } catch (err: any) {
      console.error("Failed to load air quality:", err);
      setFetchError("Unable to retrieve live environmental feed. Please retry or pick another city.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQuality(currentCity, coords.lat, coords.lng, scale);
  }, [currentCity, coords.lat, coords.lng, scale]);

  const handleLocationSelect = (city: string, lat: number, lng: number) => {
    setCurrentCity(city);
    setCoords({ lat, lng });
  };

  const handleScaleChange = (newScale: AirQualityScale) => {
    setScale(newScale);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (aqiData) {
      const updatedRoutine = generateDailyRoutine(aqiData, newProfile);
      setRoutine(updatedRoutine);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar
        currentAqiData={aqiData}
        onScaleChange={handleScaleChange}
        onLocationSelect={handleLocationSelect}
        onOpenSources={() => setIsSourcesOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Quick Location Pills & Geolocation bar */}
        <section
          aria-label="Popular locations quick selector"
          className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 text-xs shadow-2xs"
        >
          <div className="flex items-center gap-2 text-gray-500 font-semibold">
            <MapPin className="w-4 h-4 text-forest-700" />
            <span>Popular Urban Centers:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_CITIES.map((c) => {
              const isSelected = currentCity === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => handleLocationSelect(c.name, c.lat, c.lng)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    isSelected
                      ? "bg-forest-900 text-white shadow-xs"
                      : "bg-gray-100 hover:bg-forest-50 text-gray-700 hover:text-forest-900"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Loading Spinner */}
        {isLoading && !aqiData && (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <RefreshCw className="w-8 h-8 text-forest-700 animate-spin" />
            <p className="text-sm font-semibold text-gray-700">
              Retrieving atmospheric observations & model synthesis for {currentCity}...
            </p>
          </div>
        )}

        {/* Fetch Error Banner */}
        {fetchError && (
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-xs text-rose-800 flex items-center justify-between">
            <span>{fetchError}</span>
            <button
              onClick={() => fetchAirQuality(currentCity, coords.lat, coords.lng, scale)}
              className="font-bold underline text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && aqiData && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Hero Card */}
            <AqiHeroCard
              data={aqiData}
              onRefresh={() => fetchAirQuality(currentCity, coords.lat, coords.lng, scale)}
              isLoading={isLoading}
            />

            {/* 12-Hour Smog & Dispersion Timeline */}
            <HourlyForecastBar forecast={aqiData.hourlyForecast} />

            {/* Routine Quick Teaser Banner */}
            <div className="bg-gradient-to-r from-forest-900 to-forest-800 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-tealbrand-300">
                  Recommended Daily Action
                </span>
                <h3 className="text-lg font-bold mt-1">
                  {routine[0]?.title || "Air-Safe Schedule Prepared"}
                </h3>
                <p className="text-xs text-gray-200 mt-1 max-w-xl">
                  {routine[0]?.whatToDo || "Protect your morning routine with tailored exposure guidance."}
                </p>
              </div>

              <button
                onClick={() => setActiveTab("routine")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tealbrand-400 hover:bg-tealbrand-300 text-forest-950 font-bold text-xs sm:text-sm transition-all shadow-xs flex-shrink-0"
              >
                <span>View Full Daily Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 6 Pollutants Breakdown */}
            <PollutantsGrid pollutants={aqiData.pollutants} />
          </div>
        )}

        {/* TAB 2: ROUTINE */}
        {activeTab === "routine" && aqiData && (
          <div className="animate-in fade-in duration-200">
            <RoutineSection
              routine={routine}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              aqiData={aqiData}
            />
          </div>
        )}

        {/* TAB 3: INDOOR AIR */}
        {activeTab === "indoor" && (
          <div className="animate-in fade-in duration-200">
            <IndoorAirSection />
          </div>
        )}

        {/* TAB 4: SUSTAINABLE ALTERNATIVES */}
        {activeTab === "alternatives" && (
          <div className="animate-in fade-in duration-200">
            <SustainableAlternativesSection />
          </div>
        )}

        {/* TAB 5: IMPACT CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="animate-in fade-in duration-200">
            <ImpactCalculatorSection />
          </div>
        )}

        {/* TAB 6: AI COPILOT */}
        {activeTab === "copilot" && aqiData && (
          <div className="animate-in fade-in duration-200">
            <CopilotSection aqiData={aqiData} profile={profile} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200 py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-forest-700" />
            <span className="font-bold text-forest-900">AirWise Intelligence</span>
            <span>— PromptWars Virtual Challenge 6 Submission</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsSourcesOpen(true)}
              className="text-forest-800 hover:underline font-semibold"
            >
              Sources & Methodology
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("copilot")}
              className="text-forest-800 hover:underline font-semibold"
            >
              AI Copilot
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("calculator")}
              className="text-forest-800 hover:underline font-semibold"
            >
              Impact Calculator
            </button>
          </div>

          <p className="text-[11px] text-gray-400">
            Designed for public safety and sustainable urban habits.
          </p>
        </div>
      </footer>

      {/* Sources and Scientific Methodology Modal */}
      <SourcesAndMethodologyModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />
    </div>
  );
}
