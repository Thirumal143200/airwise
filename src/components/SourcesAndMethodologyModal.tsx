"use client";

import React from "react";
import {
  BookOpen,
  Scale,
  ShieldAlert,
  Database,
  Lock,
  X,
} from "lucide-react";

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SourcesAndMethodologyModal({ isOpen, onClose }: SourcesModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sources-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-forest-700" />
            <h2 id="sources-modal-title" className="text-xl font-bold text-gray-900">
              Methodology, Data Sources & Standards
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Environmental Data Feeds */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-forest-700" />
            1. Environmental Data Sources & Provenance
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            AirWise aggregates real-time atmospheric data through the <strong>Open-Meteo Air Quality API</strong>, which synthesizes the <strong>Copernicus Atmosphere Monitoring Service (CAMS)</strong> European reanalysis model (11 km resolution) with ground-level observational station telemetry. Hourly feeds report $PM_{2.5}$, $PM_{10}$, $NO_2$, $SO_2$, $CO$, and ground-level $O_3$.
          </p>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600">
            <strong>Limitation:</strong> Atmospheric chemistry models represent grid-cell averages. Localized street-level microclimates (such as congested traffic junctions or open leaf burning) can temporarily exhibit higher concentrations.
          </div>
        </div>

        {/* 2. AQI Calculation Scales */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-forest-700" />
            2. AQI Calculation Standards
          </h3>
          <ul className="text-xs text-gray-700 space-y-2 list-disc pl-5">
            <li>
              <strong>Indian CPCB Standard (NAAQI):</strong> Calculated using the official piecewise linear interpolation equation across 6 breakpoints. The overall AQI is governed by the highest pollutant sub-index.
            </li>
            <li>
              <strong>US EPA Standard:</strong> Implements the EPA 2024 revised Particulate Matter National Ambient Air Quality Standards (NAAQS).
            </li>
            <li>
              <strong>WHO Air Quality Guidelines (2021):</strong> Used as the reference health benchmark (24-hour mean limit: $PM_{2.5} \le 15\,\mu g/m^3$, $PM_{10} \le 45\,\mu g/m^3$).
            </li>
          </ul>
        </div>

        {/* 3. Carbon & Emission Factor Sources */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-forest-700" />
            3. Environmental Impact Emission Factors
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            The Transparent Impact Calculator uses verified emission conversion coefficients:
          </p>
          <div className="bg-forest-50/60 p-3 rounded-xl border border-forest-100 text-xs text-forest-950 space-y-1">
            <div>• <strong>UK DEFRA 2024:</strong> Average passenger vehicle emissions ($0.192\,kg\,CO_2e/km$ petrol, $0.171\,kg\,CO_2e/km$ diesel).</div>
            <div>• <strong>ARAI & CPCB (India):</strong> Urban two-wheeler fleet benchmark ($0.068\,kg\,CO_2e/km$).</div>
            <div>• <strong>DMRC / CEA India (2023):</strong> Urban electric metro rail ($0.028\,kg\,CO_2e/p-km$).</div>
            <div>• <strong>US EPA Greenhouse Gas Equivalencies:</strong> 1 mature tree absorbs ~21.77 kg $CO_2$ annually.</div>
          </div>
        </div>

        {/* 4. Privacy & Location Handling */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-forest-700" />
            4. Privacy & Data Handling
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            AirWise prioritizes data minimization. Coordinates are rounded to 3 decimal places (~100m–1km neighborhood resolution). No personal identification, IP logs, or precise GPS tracks are ever recorded or sold.
          </p>
        </div>

        {/* 5. Medical Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <strong className="font-bold">Medical Disclaimer:</strong> AirWise is an educational and public awareness tool designed to assist with routine decision-making during smog episodes. It does <strong>not</strong> provide medical diagnoses, clinical treatment plans, or emergency health management. Individuals with asthma, cardiovascular disease, or respiratory distress should consult a licensed medical professional or pulmonologist.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-forest-900 text-white font-semibold text-xs sm:text-sm hover:bg-forest-800"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
