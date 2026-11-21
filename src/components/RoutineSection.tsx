"use client";

import React, { useState } from "react";
import {
  Clock,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Shield,
} from "lucide-react";
import { AirQualityData, RoutineSlot, UserProfile } from "@/types";

const RISK_BADGE_STYLES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800 border-emerald-300",
  moderate: "bg-amber-100 text-amber-800 border-amber-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  severe: "bg-rose-100 text-rose-800 border-rose-300",
};

interface RoutineSectionProps {
  routine: RoutineSlot[];
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  aqiData: AirQualityData;
}

export function RoutineSection({
  routine,
  profile,
  onUpdateProfile,
  aqiData,
}: RoutineSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleSaveProfile = () => {
    onUpdateProfile(tempProfile);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Customizer Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-forest-700" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Personalized Air-Safe Routine
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Custom-tailored daily action plan for {aqiData.location.name} (AQI {aqiData.aqi}) adapting to your household vulnerability, commute habits, and exercise schedule.
          </p>
        </div>

        <button
          onClick={() => {
            setTempProfile(profile);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-forest-900 text-white hover:bg-forest-800 transition-colors text-xs sm:text-sm font-semibold shadow-sm"
        >
          <Settings2 className="w-4 h-4" />
          <span>Tune Household Profile</span>
        </button>
      </div>

      {/* Routine Cards Grid (4 time slots) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routine.map((slot) => (
          <article
            key={slot.timeSlot}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-forest-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Slot Header: Time Label + Risk Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider">
                    {slot.timeLabel}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">
                    {slot.title}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    RISK_BADGE_STYLES[slot.riskLevel] || RISK_BADGE_STYLES.moderate
                  }`}
                >
                  {slot.riskLevel} Risk
                </span>
              </div>

              {/* What to Do */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  What to Do
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                  {slot.whatToDo}
                </p>
              </div>

              {/* Why Suggested (Atmospheric & Biological Science) */}
              <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  Scientific Rationale
                </h4>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  {slot.whySuggested}
                </p>
              </div>

              {/* When Most Useful */}
              <div className="mt-3 text-xs text-gray-600">
                <strong>Peak Window:</strong> {slot.whenMostUseful}
              </div>

              {/* Practical Alternative */}
              <div className="mt-3 bg-tealbrand-50/60 rounded-xl p-3 border border-tealbrand-200">
                <span className="text-[11px] font-bold text-tealbrand-800 uppercase tracking-wider">
                  Practical Alternative:
                </span>
                <p className="text-xs text-tealbrand-950 mt-0.5">{slot.alternativeOption}</p>
              </div>
            </div>

            {/* Benefit & Limitation Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
              <div className="text-xs text-emerald-800 flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Likely Benefit:</strong> {slot.likelyBenefit}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Important Limitation:</strong> {slot.importantLimitation}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Profile Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-forest-700" />
                Tune Your Household Profile
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm">
              {/* Household Type */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Household Vulnerability Profile
                </label>
                <select
                  value={tempProfile.householdType}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, householdType: e.target.value as any })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                >
                  <option value="family_with_kids">Family with Young Children (High Risk)</option>
                  <option value="elderly_care">Elderly Household Members (65+)</option>
                  <option value="chronic_respiratory">Member with Asthma / COPD / Cardiac</option>
                  <option value="working_adults">Working Adults (Daily Commuters)</option>
                  <option value="single_active">Single Active Adult</option>
                </select>
              </div>

              {/* Commute Mode */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">Primary Commute Mode</label>
                <select
                  value={tempProfile.commuteMode}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, commuteMode: e.target.value as any })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                >
                  <option value="private_car_petrol">Private Petrol Car</option>
                  <option value="private_car_diesel">Private Diesel Car</option>
                  <option value="two_wheeler">Two-Wheeler (Motorcycle / Scooter)</option>
                  <option value="public_metro_bus">Public Metro Rail / AC Bus</option>
                  <option value="walking_cycling">Walking / Cycling</option>
                  <option value="work_from_home">Work from Home / Remote</option>
                </select>
              </div>

              {/* Commute Distance */}
              <div>
                <div className="flex justify-between font-semibold text-gray-800 mb-1">
                  <span>Daily One-Way Commute Distance:</span>
                  <span className="text-forest-700 font-bold">{tempProfile.dailyCommuteKm} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={tempProfile.dailyCommuteKm}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, dailyCommuteKm: parseInt(e.target.value) })
                  }
                  className="w-full accent-forest-700"
                />
              </div>

              {/* Exercise Habit */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">Exercise Habit</label>
                <select
                  value={tempProfile.exerciseHabit}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, exerciseHabit: e.target.value as any })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                >
                  <option value="morning_outdoor">Outdoor Morning Run / Walk (06:00 - 08:30)</option>
                  <option value="evening_outdoor">Outdoor Evening Walk / Sports</option>
                  <option value="indoor_gym">Enclosed Commercial Gym</option>
                  <option value="home_exercise">Home Yoga / Workouts</option>
                  <option value="none">No Regular Strenuous Exercise</option>
                </select>
              </div>

              {/* Budget Tier */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">Budget Preference</label>
                <select
                  value={tempProfile.budgetTier}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, budgetTier: e.target.value as any })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                >
                  <option value="zero_cost">Zero-Cost Interventions Only (Ventilation, Damp Mopping)</option>
                  <option value="low_cost">Low-Cost ($20–$50 DIY Filters, Microfiber, Masks)</option>
                  <option value="medium_cost">Medium Investment (HEPA Purifier for 1 Room)</option>
                  <option value="high_investment">Full Home Multi-Room Filtration</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempProfile.hasAirPurifier}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, hasAirPurifier: e.target.checked })
                    }
                    className="accent-forest-700 w-4 h-4 rounded"
                  />
                  <span>Household owns an active HEPA air purifier</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempProfile.hasExhaustFan}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, hasExhaustFan: e.target.checked })
                    }
                    className="accent-forest-700 w-4 h-4 rounded"
                  />
                  <span>Kitchen has an active chimney or exhaust fan</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempProfile.hasVulnerableMember}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, hasVulnerableMember: e.target.checked })
                    }
                    className="accent-forest-700 w-4 h-4 rounded"
                  />
                  <span>Has infants, elderly, pregnant, or respiratory patients</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-lg bg-forest-900 text-white hover:bg-forest-800 font-semibold text-xs sm:text-sm shadow-sm"
              >
                Apply & Update Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
