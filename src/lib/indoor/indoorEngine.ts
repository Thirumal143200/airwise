import { BudgetTier, IndoorIntervention } from "@/types";

export const INDOOR_INTERVENTIONS: IndoorIntervention[] = [
  // 1. Zero Cost: Damp Cleaning & Dust Resuspension Prevention
  {
    id: "indoor-cleaning-damp",
    category: "cleaning",
    costTier: "zero_cost",
    title: "Damp Mopping & Microfiber Wiping (Resuspension Control)",
    oneLineSummary: "Eliminate dry sweeping which launches settled toxic particles directly back into the breathing zone.",
    actionSteps: [
      "Replace dry straw brooms or standard feather dusters with damp microfiber cloths.",
      "Mop hard floors with clean warm water twice daily during smog weeks.",
      "Wipe window sills and door frames where fine particulate residue accumulates.",
      "Leave outdoor footwear at the entrance to prevent tracking toxic roadway polycyclic aromatic hydrocarbons (PAHs) onto rugs.",
    ],
    scientificRationale:
      "Settled indoor dust is not inert; it carries heavy metals, silica, and deposited combustion particles. Dry sweeping generates mechanical air shear, resuspending $PM_{10}$ and $PM_{2.5}$ particles back into the breathing height where they remain suspended for up to 6 hours.",
    dos: [
      "Use damp cotton or microfiber mops.",
      "Clean from top surfaces to bottom floors.",
      "Remove shoes at the entryway.",
    ],
    donts: [
      "Never use dry brooms or dry dusting cloths during high AQI days.",
      "Do not beat carpets or rugs indoors.",
      "Avoid harsh chemical aerosol sprays that release volatile organic compounds (VOCs).",
    ],
    evidenceSource: "World Health Organization (WHO) Guidelines for Indoor Air Quality; US EPA Indoor Air Management.",
    estimatedCostRange: "$0 (Uses household water and existing cloths)",
  },

  // 2. Zero Cost: Source Elimination & Combustion Ban
  {
    id: "indoor-source-combustion",
    category: "source_control",
    costTier: "zero_cost",
    title: "Absolute Elimination of Indoor Secondary Combustion",
    oneLineSummary: "Ban mosquito coils, incense (agarbatti), scented candles, and indoor smoking completely.",
    actionSteps: [
      "Immediately cease burning incense sticks, camphor, or scented paraffin candles indoors.",
      "Replace burning mosquito coils with electrical vaporizers, physical window mesh nets, or bed canopies.",
      "Enforce a strict 100% smoke-free home rule, including balconies.",
      "Never burn charcoal, wood embers (angithi), or unvented gas heaters indoors for warmth.",
    ],
    scientificRationale:
      "Peer-reviewed aerosol research (e.g., Liu et al., Environmental Health Perspectives) indicates that burning a single mosquito coil produces fine particulate ($PM_{2.5}$) mass comparable to 75–137 cigarettes, while unvented religious incense sticks release significant aldehydes, benzene, and heavy ultra-fine particle spikes ($PM_{2.5} > 800\\,\\mu g/m^3$). In closed winter rooms, this causes acute bronchial irritation.",
    dos: [
      "Use physical insect screens on doors and windows.",
      "Wear layered thermal clothing and blankets rather than open-flame heating.",
      "Keep all combustion strictly out of living spaces.",
    ],
    donts: [
      "Do not light decorative candles or religious incense inside closed apartments during smog.",
      "Never burn coals indoors—carbon monoxide poisoning is lethal and odorless.",
    ],
    evidenceSource: "American Journal of Respiratory and Critical Care Medicine; CPCB Indoor Pollution Reports.",
    estimatedCostRange: "$0 (Immediate savings on purchased combustion items)",
  },

  // 3. Low Cost / Zero Cost: Kitchen Isolation & Exhaust Dynamics
  {
    id: "indoor-cooking-exhaust",
    category: "cooking_exhaust",
    costTier: "low_cost",
    title: "Localized Kitchen Capture & Depressurization Management",
    oneLineSummary: "Trap cooking fumes at source with exhaust fan and pan lids before they contaminate bedrooms.",
    actionSteps: [
      "Turn on the kitchen chimney or exhaust fan 1 minute before igniting the burner, and leave it running for 5 minutes after cooking.",
      "Keep the kitchen door closed to prevent aerosolized oils and acrolein from migrating into living areas.",
      "Always cover frying pans and boiling pots with tightly fitting lids.",
      "Crack a small utility window inside the kitchen by 2 inches to feed makeup air to the exhaust fan.",
    ],
    scientificRationale:
      "High-heat frying, tadka/tempering with oil, and open roasting release millions of ultra-fine particulate droplets ($PM_{0.1}$ to $PM_{2.5}$) and carcinogenic acrolein. Operating an exhaust fan in a sealed kitchen creates depressurization; cracking a small exterior window ensures the fan exhausts fumes outdoors rather than sucking dirty air from adjoining rooms.",
    dos: [
      "Use lids on pots and pans during cooking.",
      "Clean chimney baffle filters every 2 weeks during peak season.",
      "Shift to boiling, steaming, or electric pressure cooking over prolonged deep frying.",
    ],
    donts: [
      "Do not leave the kitchen open to the living room while frying spices.",
      "Do not dry roast chilies or whole spices on open flames during severe smog days.",
    ],
    evidenceSource: "Lawrence Berkeley National Laboratory (LBNL) Indoor Environment Group Cooking Studies.",
    estimatedCostRange: "$0 - $15 (Basic maintenance & utility exhaust)",
  },

  // 4. Low Cost: DIY Corsi-Rosenthal Box Air Cleaner
  {
    id: "indoor-filtration-crbox",
    category: "filtration",
    costTier: "low_cost",
    title: "DIY Corsi-Rosenthal Box (High Clean Air Delivery Rate at Low Cost)",
    oneLineSummary: "Build a high-volume particulate filter using a standard box fan and four MERV-13 furnace filters.",
    actionSteps: [
      "Obtain four MERV-13 (or F7/H11 equivalent) HVAC air filters (size 20x20 inches) and one 20-inch box fan.",
      "Tape the four filters together into a cube using duct tape, ensuring filter airflow arrows point inward.",
      "Tape cardboard to the bottom and mount the box fan on top, blowing clean filtered air upward.",
      "Place in the central living area and run on medium speed for continuous high-flow air exchange.",
    ],
    scientificRationale:
      "Designed by environmental engineers Dr. Richard Corsi and Jim Rosenthal, this open-source design provides Clean Air Delivery Rates (CADR) of 400–600 CFM—often matching or outperforming commercial purifiers costing $400—at a fraction of the price. The large surface area minimizes air resistance and motor strain.",
    dos: [
      "Ensure all joints and filter seams are airtight with duct tape.",
      "Cut a circular cardboard shroud on top of the fan to eliminate blade backflow.",
      "Replace filters every 3–4 months during heavy winter smog.",
    ],
    donts: [
      "Do not use fiberglass pre-filters alone—only MERV-13 or higher captures $PM_{2.5}$.",
      "Do not place directly against curtains or tight corners.",
    ],
    evidenceSource: "UC Davis School of Engineering; Journal of Environmental Health Science & Engineering (2022).",
    estimatedCostRange: "$35 - $65 (Total materials)",
  },

  // 5. High Investment: Certified True HEPA Purifier with Sealed Gasket
  {
    id: "indoor-filtration-hepa",
    category: "filtration",
    costTier: "high_investment",
    title: "Certified True HEPA (H13/H14) Mechanical Purifier Selection",
    oneLineSummary: "Deploy a motorized mechanical purifier with 100% mechanical filtration and zero ozone byproduct.",
    actionSteps: [
      "Select a purifier certified to True HEPA standard (captures 99.97% of particles down to 0.3 microns).",
      "Verify that the CADR rating matches your room volume (at least 5 Air Changes per Hour / ACH).",
      "Ensure the unit uses purely mechanical HEPA + activated carbon, with NO ionizers, plasma clusters, or ozone generators enabled.",
      "Position the unit in the bedroom, elevated 30 cm off the floor, facing inward away from walls.",
    ],
    scientificRationale:
      "True HEPA filters work through diffusion, interception, and impaction, physically trapping ultrafine particles without chemical alteration. Many commercial cleaners market 'ionizers' or 'active oxygen' which produce ground-level ozone ($O_3$), an aggressive lung irritant that reacts with indoor terpenes to create secondary organic aerosols.",
    dos: [
      "Run continuously on low/auto mode rather than bursting for 10 minutes.",
      "Turn off any auxiliary 'Ionizer' or 'UV/Plasma' toggle switches.",
      "Keep bedroom doors and windows shut while operating.",
    ],
    donts: [
      "Avoid purchasing ozone-generating or electrostatic precipitator purifiers.",
      "Never wash HEPA fiber filters with water unless explicitly specified by manufacturer.",
    ],
    evidenceSource: "California Air Resources Board (CARB) Certified Air Cleaners Standards; US EPA Guide to Air Cleaners.",
    estimatedCostRange: "$120 - $350 (Appliance and replacement filters)",
  },

  // 6. Zero Cost: The Plant Reality Check & Humidity Optimization
  {
    id: "indoor-plants-reality",
    category: "source_control",
    costTier: "zero_cost",
    title: "Indoor Plants Reality Check & Optimal Humidity Control",
    oneLineSummary: "Rely on physical filtration for PM2.5, keep plants for well-being, and maintain 40–50% relative humidity.",
    actionSteps: [
      "Understand that house plants (e.g. Snake Plant, Areca Palm) do NOT actively filter $PM_{2.5}$ particles out of indoor air.",
      "Ensure plant soil is well-drained and free from moldy standing water, which produces allergenic fungal spores.",
      "Maintain indoor relative humidity between 40% and 50% using clean water misting or cool mist humidifiers.",
      "Clean humidifier tanks daily to prevent bacterial and endotoxin mist dispersal.",
    ],
    scientificRationale:
      "A common urban myth claims house plants 'purify city smog'. The famous 1989 NASA study was conducted inside tiny, hermetically sealed chambers on specific VOCs over days. Subsequent peer-reviewed research (Drexel University, 2019) demonstrated that natural air exchange in typical buildings dilutes pollutants hundreds of times faster than plants could extract them, and plants have zero physical particulate ($PM_{2.5}$) suction capacity.",
    dos: [
      "Enjoy houseplants for psychological well-being and natural aesthetic.",
      "Maintain stable 40–50% relative humidity to keep mucosal membranes hydrated.",
    ],
    donts: [
      "Do not spend money on potted plants thinking they replace a HEPA filter or ventilation strategy.",
      "Avoid over-watering indoor planters, which causes mold and dust mite proliferation.",
    ],
    evidenceSource: "Cummings & Waring (2019), Journal of Exposure Science & Environmental Epidemiology; Drexel University.",
    estimatedCostRange: "$0 - $10",
  },
];

/**
 * Retrieves indoor interventions, optionally filtered by the specified budget tier.
 */
export function getIndoorRecommendations(budgetTier?: BudgetTier): IndoorIntervention[] {
  if (!budgetTier) return INDOOR_INTERVENTIONS;
  return INDOOR_INTERVENTIONS.filter((item) => item.costTier === budgetTier);
}
