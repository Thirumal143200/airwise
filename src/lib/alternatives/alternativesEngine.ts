import { AirQualityTier, SustainableAlternativeItem } from "@/types";

export const SUSTAINABLE_ALTERNATIVES: SustainableAlternativeItem[] = [
  // 1. Commute: Private Car -> Enclosed Metro / Electric Mass Transit
  {
    id: "alt-commute-metro",
    category: "commute",
    title: "Enclosed Metro & Electric Mass Transit Transition",
    baselineHabit: "Solo daily commuting in petrol or diesel passenger car (15–25 km round-trip).",
    cleanerAlternative:
      "Transition to underground or elevated metro rail, or dedicated electric bus corridor. Combine with first/last-mile shared electric feeder autos.",
    exposureTradeoff:
      "Keeps commuter in a centralized, air-filtered transit cabin rather than trapped in stagnant roadway toxic exhaust plumes where passenger cabin $NO_2$ can be 2-3x higher than ambient.",
    emissionReductionBenefit:
      "Cuts personal transit $CO_2e$ emissions by ~75–85% per commuter-kilometer; completely eliminates tailpipe particulate emissions from the city street canyon.",
    feasibilityRating: "High",
    safetyCaveat:
      "Wear an N95 respirator while navigating crowded station platforms or during open-air walking transfers when outdoor AQI exceeds 200.",
  },

  // 2. Commute: Carpooling / Shared Corporate Vanpool
  {
    id: "alt-commute-carpool",
    category: "commute",
    title: "High-Occupancy Corporate Carpool or Dynamic Ride-Pooling",
    baselineHabit: "Driving alone in a personal vehicle during peak traffic gridlock.",
    cleanerAlternative:
      "Form a verified 4-person neighborhood or office carpool, or switch to scheduled corporate shuttle services.",
    exposureTradeoff:
      "Maintains vehicle cabin comfort with air recirculation; by eliminating 3 separate cars from the road, it directly reduces traffic congestion and vehicle idling time.",
    emissionReductionBenefit:
      "Reduces per-passenger emissions by 60–75%. If 10,000 commuters carpool in groups of 4, ~7,500 vehicles are removed from rush-hour roads daily.",
    feasibilityRating: "High",
    safetyCaveat:
      "Ensure vehicle cabin air filter (cabin pollen/carbon filter) is changed annually. Keep windows closed with AC in recirculation mode during smog.",
  },

  // 3. Short Trips: Active Mobility Caution & Trip Consolidation
  {
    id: "alt-short-trips-consolidation",
    category: "short_trips",
    title: "Trip Chaining & Strategic Errands Consolidation",
    baselineHabit: "Making 3 to 4 separate short car or scooter trips throughout the day (e.g., pharmacy, bakery, market).",
    cleanerAlternative:
      "Chain all errands into a single consolidated trip during the midday dispersion window (12:00 - 02:00 PM), or walk with an N95 mask only if AQI < 150.",
    exposureTradeoff:
      "Reduces total time spent breathing roadside air by 60%. Avoids cold-engine starts which produce up to 5x higher emissions per kilometer.",
    emissionReductionBenefit:
      "Saves up to 60% of short-trip fuel and eliminates unnecessary cold-start catalytic converter warmup pollution.",
    feasibilityRating: "High",
    safetyCaveat:
      "CRITICAL SAFETY NOTE: Do NOT switch to aerobic outdoor cycling or brisk unmasked walking during 'Severe' smog (AQI > 300) merely to be green. Heavy inhalation of toxic particles causes acute lung damage that outweighs green benefits. Use shared public transit or wear an N95 respirator.",
  },

  // 4. Delivery & E-Commerce: Consolidated Scheduled Delivery
  {
    id: "alt-delivery-consolidated",
    category: "delivery",
    title: "Consolidated Batch Delivery vs Instant Hyperlocal Delivery",
    baselineHabit: "Ordering frequent 10-minute grocery and food delivery runs throughout the week.",
    cleanerAlternative:
      "Plan a weekly household grocery list and select 'No-Rush Consolidated Delivery' where orders are bundled into a single delivery van trip.",
    exposureTradeoff:
      "Protects gig workers from prolonged roadside smog exposure and reduces neighborhood delivery motorcycle congestion.",
    emissionReductionBenefit:
      "Replaces 5–8 individual motorcycle delivery trips with a single route-optimized drop, cutting last-mile delivery emissions by over 50%.",
    feasibilityRating: "High",
    safetyCaveat:
      "Tip delivery workers and provide them with certified N95 respirators if your building management has a community safety fund.",
  },

  // 5. Household Cooking: Transition from Biomass/Kerosene to Induction
  {
    id: "alt-cooking-induction",
    category: "cooking",
    title: "Clean Electric Induction Cooking & Pressure Vessel Efficiency",
    baselineHabit: "Using low-grade biomass, kerosene, or unvented open gas burners for prolonged boiling.",
    cleanerAlternative:
      "Transition primary boiling and simmering to countertop electric induction cooktops, accompanied by modern sealed pressure cookers.",
    exposureTradeoff:
      "Eliminates internal combustion inside the dwelling entirely. Gas burners emit nitrogen dioxide ($NO_2$) and carbon monoxide ($CO$) directly into home air; induction produces zero indoor emissions.",
    emissionReductionBenefit:
      "Induction transfers 85–90% of electrical energy directly to cookware (vs 40% for gas flames), drastically reducing overall energy consumption and localized cooking emissions.",
    feasibilityRating: "Medium",
    safetyCaveat:
      "Ensure proper home electrical wiring and grounded 15A outlets before installing high-wattage induction plates.",
  },

  // 6. Waste Management: Zero Biomass & Leaf Burning Protocol
  {
    id: "alt-waste-no-burning",
    category: "waste",
    title: "Strict Zero-Burning: Composting & Municipal Mulching",
    baselineHabit: "Sweeping garden leaves, plastic wrappers, or household waste into street piles and burning them in the evening.",
    cleanerAlternative:
      "Segregate organic leaf litter into neighborhood composting pits or arrange for municipal green-waste mulching shredders.",
    exposureTradeoff:
      "Directly eliminates acute local ground-level toxic smoke spikes. Open leaf and plastic combustion releases dioxins, furans, black carbon, and hazardous VOCs directly at window height.",
    emissionReductionBenefit:
      "Prevents heavy black carbon (short-lived climate pollutant with 1,000x the warming potential of $CO_2$) and toxic carcinogenic smoke.",
    feasibilityRating: "Requires Community Action",
    safetyCaveat:
      "Report illegal street waste burning immediately via municipal apps (such as the Delhi Green App, CPCB Sameer App, or municipal 311 helplines) rather than confronting burners directly.",
  },
];

/**
 * Returns sustainable alternatives. When ambient air quality reaches severe or hazardous tiers,
 * active transit recommendations are deprioritized in favor of protected cabin transit and source control.
 */
export function getFilteredAlternatives(currentTier?: AirQualityTier): SustainableAlternativeItem[] {
  if (!currentTier || (currentTier !== "severe" && currentTier !== "hazardous")) {
    return SUSTAINABLE_ALTERNATIVES;
  }
  return [...SUSTAINABLE_ALTERNATIVES].sort((a, b) => {
    if (a.category === "short_trips") return 1;
    if (b.category === "short_trips") return -1;
    return 0;
  });
}
