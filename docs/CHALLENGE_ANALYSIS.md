# AIRWISE: Urban Air Quality Intelligence & Family Safety Assistant
## Challenge 6 — In-Depth Challenge & Domain Analysis

---

### 1. Executive Summary & Problem Context

Urban air pollution—especially during severe winter smog episodes—is one of the most critical public health emergencies of our time. In metropolitan regions such as Delhi-NCR, Lahore, Beijing, the Indo-Gangetic Plains, and industrial urban centers worldwide, winter meteorological inversions trap particulate matter ($PM_{2.5}$, $PM_{10}$), nitrogen dioxide ($NO_2$), sulfur dioxide ($SO_2$), and carbon monoxide ($CO$) close to the ground. 

During these episodes:
- **AQI values routinely breach 350 to 500+ ("Severe" / "Hazardous" category)**.
- **Vulnerable populations** (children whose lungs are developing, elderly individuals, people with asthma, COPD, or cardiovascular conditions) face acute exacerbations.
- **Households receive raw AQI numbers without operational context**: Citizens see an ominous red or maroon number on weather apps, but are left paralyzed with unanswered questions:
  - *"Can my child attend sports practice at 3 PM today?"*
  - *"Should I open windows at noon or keep them shut all day?"*
  - *"If I cycle or walk to work to reduce emissions, am I actually harming my lungs from heavy breathing?"*
  - *"What low-cost steps can I take if I cannot afford a $300 HEPA air purifier for every room?"*
  - *"If our family carpools or switches to the metro, what is the genuine environmental benefit?"*

**The core failure of existing tools** is that they are passive, anxiety-inducing scoreboards. They tell people that their air is toxic, but offer zero practical, tailored, lifestyle-compatible guidance.

**AirWise** is engineered to transform passive ambient pollution data into **proactive, actionable, life-protecting intelligence and sustainable everyday habits**.

---

### 2. User Personas & Real-World Use Cases

To ground every engineering decision in real human needs, AirWise is designed around three primary personas:

#### Persona A: Maya Sharma (34) — Parent of Two Young Children (Delhi-NCR)
- **Context**: Winter smog season (November–January). Children aged 4 and 8. The school hasn't officially declared a holiday, but outdoor morning AQI is 410.
- **Pain Point**: Conflicting advice. High anxiety. Needs to know safe physical activity hours, how to prevent dust resuspension while cleaning the home, whether boiling water or humidifiers help, and how to operate cooking exhaust fans without drawing in toxic outdoor air.
- **Required Workflow in AirWise**:
  1. Instant location lookup for her specific sector/locality with data source transparency (ground monitoring vs modeled).
  2. Family Safety Advisory highlighting child vulnerability thresholds.
  3. Safe activity time window (e.g., peak solar dispersion between 1:00 PM and 3:30 PM vs severe thermal inversion at 7:00 AM).
  4. Practical indoor air protocols (damp mopping instead of dry brooming, localized kitchen exhaust, DIY Corsi-Rosenthal / low-cost filter advice).

#### Persona B: Rajiv Sen (29) — Corporate Commuter & Tech Worker (Bengaluru / Mumbai)
- **Context**: Commutes 18 km each way. Owns a petrol car, but wants to cut his personal carbon footprint and emissions footprint during high-smog alerts.
- **Pain Point**: Often considers cycling or walking during smog alerts to "do his part", unaware that high-ventilation aerobic exercise in $PM_{2.5} > 150\,\mu g/m^3$ causes deep alveolar deposition of toxic heavy metals. Needs realistic multimodal transit alternatives.
- **Required Workflow in AirWise**:
  1. Commuting planner balancing personal exposure risk against emission reduction.
  2. Public transit and metro recommendations with mask advisories (N95/FFP2).
  3. Transparent Impact Calculator showing avoided vehicle kilometers, fuel saved, $CO_2$ avoided, with transparent mathematical formulas and emission factor citations (e.g., CPCB / ARAI / DEFRA 2024 factors).

#### Persona C: Dhiren Patel (67) — Retiree with Mild Respiratory Sensitivity (Ahmedabad / Lucknow)
- **Context**: Enjoys morning walks and gardening. Budget-conscious; lives on a pension and cannot spend on high-end motorized air purification.
- **Pain Point**: High risk of morning cardiac and respiratory stress due to ground-level smog condensation at dawn. Skeptical of AI gimmicks; needs clear, non-alarmist, medically responsible educational guidance.
- **Required Workflow in AirWise**:
  1. Accessible UI with clear typography, high color contrast, screen reader labels, and non-color-reliant indicators (icons and explicit descriptive text).
  2. Tiered indoor air guidance: Zero-cost (ventilation timing, door drafting, damp dusting), Low-cost (HEPA filter retrofits, potted plants reality check), High-investment (true HEPA purifiers).
  3. Clear medical disclaimer distinguishing educational information from medical diagnoses.

---

### 3. Evaluation Priorities & Engineering Translation

| Evaluation Priority | Challenge Weight | AirWise Engineering Implementation |
|---|---|---|
| **Priority 1: Problem Statement Alignment** | **VERY HIGH** | Complete end-to-end user journey: Live verified environmental data, Indian (CPCB) & US-EPA AQI scale support, Personalized Routine Engine, Tiered Indoor Air Guidance, Sustainable Transport/Lifestyle Alternatives, Transparent Impact Calculator, and GenAI Copilot grounded in real data. |
| **Priority 2: Code Quality** | **HIGH** | Strict TypeScript throughout, Next.js App Router, modular domain architecture (`/src/lib/environmental`, `/src/lib/routine`, `/src/lib/indoor`, `/src/lib/alternatives`, `/src/lib/calculator`, `/src/lib/ai`), Zod request/response validation, zero unhandled errors. |
| **Priority 3: Security** | **MEDIUM** | Server-side API key containment (zero leaked secrets in client bundles), in-memory rate limiting, input sanitization against prompt injection, safe location handling (no raw user GPS logged or tracked). |
| **Priority 4: Efficiency** | **MEDIUM** | Intelligent server-side in-memory caching with TTL (30 min) for environmental feeds to prevent API spam, bounded requests with timeouts (AbortController), lightweight bundle. |
| **Priority 5: Testing** | **LOW (High in our build)** | Comprehensive automated test suite with Vitest: unit tests for AQI conversions, environmental parsers, emission factor formulas, routine generators, fallback mechanisms, and Zod schemas. |
| **Priority 6: Accessibility** | **LOW (High in our build)** | WCAG 2.1 AA compliance: semantic HTML5, keyboard navigation, full ARIA descriptions, high-contrast palette, and **multi-channel risk encoding** (color + numeric value + text severity badge + icon) so color alone is never relied upon. |

---

### 4. Technical Risks & Mitigation Architecture

| Risk ID | Identified Risk | Impact | Architectural Mitigation in AirWise |
|---|---|---|---|
| **TR-01** | External Environmental API downtime or rate limiting | High | Provider abstraction pattern (`AirQualityProvider`). Defaulting to Open-Meteo Air Quality (reliable, free, high-resolution global atmospheric model combining CAMS and observational stations), with fallback to verified offline historical regional reference benchmarks. Clear UI status badge: "Live Verified", "Cached", or "Offline Reference". |
| **TR-02** | Gemini API quota exhaustion or missing API Key | High | Dual-Engine Architecture: Live Gemini 2.5/Flash model orchestration with structured JSON response schema, coupled with an automated **Deterministic Rules Engine** fallback. If no key is set or API fails, the user receives an instant, scientifically sound recommendation clearly labeled as "Expert Rules Engine (Offline Fallback)". Never throws 500 error or leaves user stranded. |
| **TR-03** | Prompt Injection via User Chat Input | Medium | Sanitization layer stripping control tags, system-prompt enclosure with strict boundary delimiters (`<<<USER_QUERY>>>`), temperature bounding, and schema enforcement via Zod. |
| **TR-04** | Fabricated or Hallucinated Air Quality Data | Critical | The GenAI Copilot is explicitly forbidden in its system prompt from inventing numbers or stations. The server injects the verified current environmental JSON directly into the prompt context; the AI is instructed to cite only the injected figures and explicitly acknowledge missing data. |
| **TR-05** | Misleading Health or Environmental Claims | High | Transparent Impact Calculator exposes the exact mathematical formula, input parameters, emission factors (with dates and authoritative sources: CPCB/EPA/ARAI), and explicit disclaimers: *"$CO_2$ avoided represents climate greenhouse gas reduction; it does not directly equate to immediate local ambient $PM_{2.5}$ drops."* General medical disclaimer on all advice cards. |

---

### 5. Original Differentiation & Competitive Edge

AirWise stands out from existing hackathon entries and commercial apps through:
1. **Actionable Routine Planner vs Passive Dashboard**: Instead of just saying "AQI 320 - Hazardous", AirWise breaks the day into time slots (Morning, Midday, Evening, Night) with specific activity guidance (e.g., commute, school drop, indoor ventilation, exercise).
2. **Dual Exposure-Emission Balancing**: Recognizes the crucial paradox: cycling during severe smog reduces traffic emissions but dramatically increases personal lung toxic dose. AirWise gives nuanced advice that protects individual lungs first while recommending sustainable systemic transit.
3. **Transparent Mathematical Impact Modeling**: No "black box" carbon numbers. Every calculation reveals its exact arithmetic, units ($kg\,CO_2e$, liters of fuel, $kWh$), emission coefficients, and uncertainty margins.
4. **Honest Data Provenance**: Discloses whether data is a ground monitoring observation, an atmospheric model estimate, or cached, and provides measurement timestamps.
5. **Universal Accessibility**: Multi-modal sensory encoding so that anyone—regardless of visual acuity or colorblindness—can instantly understand pollution risks.
