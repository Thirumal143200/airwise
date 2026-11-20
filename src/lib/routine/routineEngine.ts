import { AirQualityData, RoutineSlot, UserProfile } from "@/types";

export function generateDailyRoutine(
  aqiData: AirQualityData,
  profile: UserProfile
): RoutineSlot[] {
  const { aqi, tier } = aqiData;
  const isSevere = aqi > 300 || tier === "severe" || tier === "hazardous";
  const isPoorOrWorse = aqi > 150 || tier === "poor" || tier === "very_poor" || isSevere;
  const hasKidsOrElderly =
    profile.householdType === "family_with_kids" ||
    profile.householdType === "elderly_care" ||
    profile.hasVulnerableMember;

  const slots: RoutineSlot[] = [];

  // =========================================================================
  // 1. MORNING (06:00 - 10:00 AM)
  // Scientific context: Ground-level thermal inversion traps cold, dense toxic air.
  // Morning traffic + biomass heating spikes PM2.5 and NO2 to highest daily peak.
  // =========================================================================
  if (isSevere) {
    slots.push({
      timeSlot: "morning",
      timeLabel: "06:00 - 10:00 AM (Peak Smog & Inversion)",
      title: "Strict Indoor Containment & Closed Air Envelope",
      whatToDo:
        "Cancel all outdoor walks, runs, and open-air school morning assemblies. Keep all exterior doors and windows strictly sealed. Run your air purifier in bedroom mode or stay in an isolated, draft-proofed central room.",
      whySuggested:
        "Winter nocturnal radiation causes a severe ground-level temperature inversion until 10:00 AM. Microscopic particles ($PM_{2.5} > 250\\,\\mu g/m^3$) and vehicle $NO_2$ are compressed within the lowest 50 meters of the atmosphere, multiplying toxic alveolar dose by 4-5x during cardiovascular exertion.",
      whenMostUseful:
        "Between 06:00 AM and 09:30 AM before solar radiation breaks the inversion layer.",
      alternativeOption:
        profile.exerciseHabit === "morning_outdoor"
          ? "Switch to 25 minutes of low-intensity yoga, indoor stretching, or resistance bands in a closed room with air filtration."
          : "Prepare indoor quiet study or play for children rather than balcony play.",
      likelyBenefit:
        "Reduces direct inhalation of toxic combustion aerosols by 70–85% compared to outdoor morning exposure.",
      importantLimitation:
        "Indoor $CO_2$ will gradually build up in sealed rooms over several hours; a 5-minute brief door crack to an internal corridor may be needed if stuffiness occurs.",
      activityTag: "exercise",
      riskLevel: "severe",
    });
  } else if (isPoorOrWorse) {
    slots.push({
      timeSlot: "morning",
      timeLabel: "06:00 - 10:00 AM (Moderate Inversion Period)",
      title: "Protected Commute & Reduced Exertion",
      whatToDo:
        "Avoid vigorous outdoor jogging or cycling. If commuting by two-wheeler or foot, wear a certified, well-fitted N95 / FFP2 respirator. Keep vehicle windows closed with AC set to recirculation mode.",
      whySuggested:
        "Moderate pollution triggers bronchospasm in sensitive airways. Strenuous outdoor cardiovascular exercise elevates minute ventilation volume from approximately 6 L/min at rest to 40–60 L/min, multiplying inhaled particulate mass and driving fine particles deeper into the pulmonary bronchioles.",
      whenMostUseful: "During the 07:30 - 09:30 AM peak traffic congestion.",
      alternativeOption:
        profile.commuteMode.includes("two_wheeler") || profile.commuteMode.includes("walking")
          ? "Consider shifting travel by 45 minutes or boarding an enclosed metro train / AC bus."
          : "Carpool with colleagues to reduce private car emissions.",
      likelyBenefit:
        "N95 mask with proper seal filters over 95% of airborne particulate matter, preventing acute airway inflammation.",
      importantLimitation:
        "Surgical and cloth masks offer negligible protection against fine $PM_{2.5}$ particles because they lack electrostatic filtration and side seal.",
      activityTag: "commute",
      riskLevel: "high",
    });
  } else {
    slots.push({
      timeSlot: "morning",
      timeLabel: "06:00 - 10:00 AM (Acceptable Air Window)",
      title: "Normal Outdoor Routine with Clean Transit Choice",
      whatToDo:
        "Enjoy your morning exercise or walk. Consider walking, cycling, or public transit for short morning trips to maintain low local emissions.",
      whySuggested:
        "Current particulate levels are within satisfactory thresholds, making cardiovascular outdoor activity beneficial for metabolic and mental health.",
      whenMostUseful: "Between 06:30 and 08:30 AM.",
      alternativeOption: "Use active cycling for short errands instead of cold-starting a petrol car.",
      likelyBenefit:
        "Cardiorespiratory fitness benefits outweigh pollution exposure risks under current measured levels.",
      importantLimitation:
        "Check local micro-conditions if exercising directly adjacent to major arterial highways.",
      activityTag: "exercise",
      riskLevel: "low",
    });
  }

  // =========================================================================
  // 2. MIDDAY (11:00 AM - 03:30 PM)
  // Scientific context: Solar heating expands planetary boundary layer (PBL),
  // dispersing ground particulate concentrations to the lowest levels of the day.
  // =========================================================================
  if (isSevere) {
    slots.push({
      timeSlot: "midday",
      timeLabel: "11:30 AM - 02:30 PM (Optimal Dispersion Window)",
      title: "Essential Outdoor Errands & Controlled Cross-Ventilation",
      whatToDo:
        "If you must step outside for medical visits, grocery restocking, or urgent errands, schedule them strictly in this midday window. Conduct brief (10–15 min) cross-ventilation only if indoor $CO_2$ feels stale and outdoor sun is active.",
      whySuggested:
        "Solar convection reaches its diurnal peak between 12:00 PM and 2:30 PM, lifting the planetary boundary layer (mixing height expands from ~100m to 800-1200m). Depending on regional meteorology, this typically dilutes surface particulate concentrations by 30–50% relative to early morning radiation inversion peaks.",
      whenMostUseful: "Between 12:00 PM and 02:00 PM.",
      alternativeOption:
        "Batch combine multiple family errands into a single trip or arrange consolidated home delivery.",
      likelyBenefit:
        "Minimizes toxic dose by synchronizing inevitable exposure with the day's meteorological dilution maximum.",
      importantLimitation:
        "In severe smog episodes, even the midday low may still exceed $150\\,\\mu g/m^3$ $PM_{2.5}$; wear an N95 respirator whenever outside.",
      activityTag: "ventilation",
      riskLevel: "moderate",
    });
  } else if (isPoorOrWorse) {
    slots.push({
      timeSlot: "midday",
      timeLabel: "11:00 AM - 03:00 PM (Fresh Air & Ventilation Window)",
      title: "Strategic Natural Ventilation & Filter Cleaning",
      whatToDo:
        "Open high-level windows on the leeward (sheltered) side of your home for 20–30 minutes to flush out indoor carbon dioxide, VOCs, and moisture. Inspect and vacuum primary pre-filters on air purifiers.",
      whySuggested:
        "Atmospheric vertical mixing is highest at midday, dispersing surface traffic exhausts. Purging indoor air prevents stale air stagnation without overwhelming indoor filters.",
      whenMostUseful: "Around 01:00 PM when solar thermal updrafts are maximum.",
      alternativeOption:
        "If living on a busy main road, crack windows opening onto an interior courtyard rather than the street.",
      likelyBenefit:
        "Maintains healthy indoor oxygen and lowers indoor $CO_2$ below 800 ppm, preventing cognitive fatigue and headaches.",
      importantLimitation:
        "Close all windows promptly before 04:00 PM as the evening temperature drops.",
      activityTag: "ventilation",
      riskLevel: "low",
    });
  } else {
    slots.push({
      timeSlot: "midday",
      timeLabel: "11:00 AM - 03:00 PM (Full Ventilation Window)",
      title: "Full Household Aeration & Solar Exposure",
      whatToDo:
        "Open windows across opposite sides of the residence to allow fresh ambient air exchange. Dry bedding and laundry in outdoor sunlight if space permits.",
      whySuggested:
        "Ambient air quality is favorable and solar ultraviolet radiation provides natural disinfection for household fabrics.",
      whenMostUseful: "Throughout midday hours.",
      alternativeOption: "Enjoy an outdoor lunch break or park walk.",
      likelyBenefit: "Flushes accumulated indoor air contaminants with zero energy consumption.",
      importantLimitation: "Ensure windows are closed if wind speeds cause sudden dust resuspension.",
      activityTag: "ventilation",
      riskLevel: "low",
    });
  }

  // =========================================================================
  // 3. EVENING (04:30 - 08:30 PM)
  // Scientific context: Sunset triggers inversion re-formation, evening rush hour,
  // localized street food/biomass burning, and stagnant cooling air.
  // =========================================================================
  if (isSevere || isPoorOrWorse) {
    slots.push({
      timeSlot: "evening",
      timeLabel: "05:00 - 08:30 PM (Evening Congestion & Re-Inversion)",
      title: "Protected Evening Commute & Kitchen Source Management",
      whatToDo:
        "Close all windows firmly by 04:30 PM before sunset. During evening cooking, run kitchen exhaust on high, cover frying pans with lids, and close the kitchen door to avoid dispersing ultra-fine cooking oils into bedrooms.",
      whySuggested:
        "The ground cools rapidly at dusk, re-trapping evening rush hour exhausts in a collapsing boundary layer. Furthermore, domestic frying and roasting generate severe indoor $PM_{2.5}$ spikes exceeding $400\\,\\mu g/m^3$ if not vented locally.",
      whenMostUseful: "05:30 PM to 08:00 PM during meal preparation and commute.",
      alternativeOption:
        profile.commuteMode.includes("car")
          ? "Delay your drive by 45 minutes to bypass peak idling gridlock, saving fuel and reducing emissions."
          : "Avoid roadside food stalls with open wood/charcoal braziers.",
      likelyBenefit:
        "Isolated kitchen venting prevents 80% of culinary particle migration into family living and sleeping areas.",
      importantLimitation:
        "Exhaust fans depressurize the kitchen; crack a small utility window slightly inside the kitchen so the fan draws air from outside rather than pulling air from your purified living room.",
      activityTag: "household",
      riskLevel: isSevere ? "severe" : "high",
    });
  } else {
    slots.push({
      timeSlot: "evening",
      timeLabel: "05:00 - 08:30 PM (Evening Activity)",
      title: "Active Outdoor Recreation & Low-Impact Travel",
      whatToDo:
        "Great time for outdoor sports, family walks, and cycling errands. Opt for walking or biking for neighborhood shopping.",
      whySuggested:
        "Favorable air conditions encourage community outdoor recreation and healthy movement without toxic particulate exposure.",
      whenMostUseful: "Before twilight.",
      alternativeOption: "Combine family walk with neighborhood grocery pickup to eliminate a vehicle trip.",
      likelyBenefit: "Promotes cardiovascular health while avoiding motorized transport emissions.",
      importantLimitation: "Dress warmly if temperatures drop rapidly after sunset.",
      activityTag: "exercise",
      riskLevel: "low",
    });
  }

  // =========================================================================
  // 4. NIGHT (09:00 PM - 06:00 AM)
  // Scientific context: Sleep requires 7-8 hours of continuous respiration.
  // Lowest nocturnal metabolic rate, vulnerable to nocturnal bronchoconstriction.
  // =========================================================================
  if (isSevere || isPoorOrWorse) {
    slots.push({
      timeSlot: "night",
      timeLabel: "09:00 PM - 06:00 AM (Nocturnal Clean Sanctuary)",
      title: "Bedtime Clean Air Haven & Humidity Regulation",
      whatToDo:
        "Seal bedroom windows. Place a draft blocker towel under the bedroom door. Run your air purifier in quiet/sleep mode near head level. Damp-mop bedroom floor instead of dry-sweeping. Keep bedroom humidity between 40% and 55%.",
      whySuggested:
        "During 8 hours of sleep, an adult inhales over 3,000 liters of air. Nocturnal bronchoconstriction peaks at 4:00 AM. Maintaining a clean 'sleeping sanctuary' provides the respiratory system critical downtime to clear mucociliary debris.",
      whenMostUseful: "Continuously from bedtime until morning wakeup.",
      alternativeOption:
        profile.budgetTier === "zero_cost" || !profile.hasAirPurifier
          ? "Create a sealed bedroom sanctuary: close all external drafts, damp-dust surfaces, avoid burning mosquito coils or incense, and use a fan with a dampened cotton barrier."
          : "Position air purifier 1-2 meters from the head of the bed facing away from walls.",
      likelyBenefit:
        "Reduces nighttime particulate exposure by up to 80%, substantially reducing morning cough, chest tightness, and eye burning.",
      importantLimitation:
        "Never use unvented gas heaters, coal angithis, or open kerosene burners inside a sealed bedroom due to fatal carbon monoxide ($CO$) poisoning risk.",
      activityTag: "household",
      riskLevel: isSevere ? "high" : "moderate",
    });
  } else {
    slots.push({
      timeSlot: "night",
      timeLabel: "09:00 PM - 06:00 AM (Restful Night)",
      title: "Restful Indoor Haven with Gentle Ventilation",
      whatToDo:
        "Ensure comfortable bedroom temperature and maintain slight air circulation with an open internal door or cracked window if weather permits.",
      whySuggested:
        "Ambient air remains clean, allowing restful sleep without accumulated indoor carbon dioxide or moisture.",
      whenMostUseful: "Overnight.",
      alternativeOption: "Use natural airflow rather than running high-speed mechanical ventilation.",
      likelyBenefit: "Optimizes deep sleep stages and morning alertness.",
      importantLimitation: "Close windows if night fog causes sudden humidity or pollen surges.",
      activityTag: "household",
      riskLevel: "low",
    });
  }

  return slots;
}
