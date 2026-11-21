"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Cpu,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { AirQualityData, CopilotPlanResponse, UserProfile } from "@/types";

interface CopilotSectionProps {
  aqiData: AirQualityData;
  profile: UserProfile;
}

export function CopilotSection({ aqiData, profile }: CopilotSectionProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responsePlan, setResponsePlan] = useState<CopilotPlanResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickPrompts = [
    "Is it safe for my child to do outdoor sports today?",
    "When is the cleanest time to open windows today?",
    "How do I protect my room if I cannot afford a HEPA purifier?",
    "Are house plants effective at filtering PM2.5 smog?",
    "How should I manage kitchen exhaust while cooking?",
  ];

  const handleAsk = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    const controller = new AbortController();
    const timeoutMs = 12000; // 12-second frontend network timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          currentAqiData: aqiData,
          userProfile: profile,
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (!data || !data.plan) {
        throw new Error("Invalid response format received from Copilot service.");
      }
      setResponsePlan(data.plan);
    } catch (err: unknown) {
      const isAbort =
        (err instanceof DOMException && err.name === "AbortError") ||
        (err instanceof Error && err.name === "AbortError");

      if (isAbort) {
        setErrorMessage("Request timed out after 12 seconds. The copilot service took longer than expected. Please try again.");
      } else {
        const errMsg = err instanceof Error ? err.message : String(err);
        setErrorMessage(errMsg || "Failed to generate copilot guidance. Please try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-tealbrand-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              GenAI Air Quality & Family Copilot
            </h2>
          </div>

          {/* Engine indicator */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200">
            <Cpu className="w-3.5 h-3.5 text-forest-700" />
            Grounded in Live Data
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl">
          Ask questions regarding family health precautions, indoor ventilation, mask ratings, or daily schedule adjustments. Grounded in verified environmental observations for <strong>{aqiData.location.name} (AQI {aqiData.aqi})</strong>.
        </p>

        {/* Quick Question Chips */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 block mb-2">
            Suggested Family & Routine Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleAsk(p);
                }}
                disabled={isLoading}
                className="text-xs bg-gray-50 hover:bg-forest-50 hover:text-forest-900 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-all text-left"
              >
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="mt-5 flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about air quality, ventilation, or family safety..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
            aria-label="Ask the Air Quality Copilot"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-5 py-2.5 rounded-xl bg-forest-900 text-white font-semibold text-xs sm:text-sm hover:bg-forest-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Structured Copilot Response Card */}
      {responsePlan && (
        <article className="bg-white rounded-2xl border-2 border-forest-200 p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-300">
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  responsePlan.isDeterministicFallback
                    ? "bg-amber-50 text-amber-900 border-amber-300"
                    : "bg-tealbrand-50 text-tealbrand-900 border-tealbrand-300"
                }`}
              >
                {responsePlan.isDeterministicFallback
                  ? "AirWise Deterministic Rules Engine (Offline Fallback)"
                  : "AI Grounded (Google Gemini 3.8 Flash)"}
              </span>

              <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                Confidence: <strong className="capitalize">{responsePlan.confidence}</strong>
              </span>
            </div>

            <span className="text-[11px] text-gray-400">
              Grounded on: {aqiData.location.name} (AQI {aqiData.aqi})
            </span>
          </div>

          {/* 1. Recommendation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              Primary Safety Recommendation:
            </h3>
            <p className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              {responsePlan.recommendation}
            </p>
          </div>

          {/* 2. Scientific Reason */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Scientific & Environmental Rationale:
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {responsePlan.reason}
            </p>
          </div>

          {/* 3. Practical Action */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Step-by-Step Practical Action:
            </h4>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
              {responsePlan.practicalAction}
            </p>
          </div>

          {/* 4. Estimated Impact if supported */}
          {responsePlan.estimatedImpact && (
            <div className="bg-tealbrand-50/60 rounded-xl p-3 border border-tealbrand-200 text-xs text-tealbrand-950">
              <strong>Estimated Impact:</strong> {responsePlan.estimatedImpact}
            </div>
          )}

          {/* 5. Authoritative References */}
          {responsePlan.sourceReferences && responsePlan.sourceReferences.length > 0 && (
            <div className="pt-3 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-500">
              <BookOpen className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-700">Authoritative References: </span>
                <span>{responsePlan.sourceReferences.join(" • ")}</span>
              </div>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
