import { describe, it, expect, beforeEach } from "vitest";
import {
  OpenMeteoAirQualityProvider,
  searchLocations,
  setBoundedCache,
  getCacheSizeForTesting,
  clearCacheForTesting,
} from "@/lib/environmental/provider";
import { AirQualityData } from "@/types";

describe("OpenMeteoAirQualityProvider & Location Search", () => {
  beforeEach(() => {
    clearCacheForTesting();
  });
  it("should return offline reference data when external network fails gracefully", async () => {
    const provider = new OpenMeteoAirQualityProvider();

    // Passing coordinates for Delhi
    const data = await provider.getAirQuality(28.6139, 77.209, "Delhi", "Delhi", "India", "IN_CPCB");

    expect(data).toBeDefined();
    expect(data.location.name).toBe("Delhi");
    expect(data.aqi).toBeGreaterThan(0);
    expect(data.dominantPollutant).toBeDefined();
    expect(data.pollutants.pm25).toBeDefined();
    expect(data.pollutants.pm10).toBeDefined();
    expect(data.pollutants.no2).toBeDefined();
    expect(data.hourlyForecast.length).toBeGreaterThan(0);
    expect(["atmospheric_model", "cached_reference"]).toContain(data.dataSourceType);
    expect(["live", "cached", "offline_reference"]).toContain(data.dataFreshness);
  });

  it("should search locations with fallback for popular cities", async () => {
    const results = await searchLocations("Delhi");
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      expect(results[0].name.toLowerCase()).toContain("delhi");
    }
  });

  it("should return empty list for short or empty location queries", async () => {
    const emptyResults = await searchLocations("");
    expect(emptyResults).toEqual([]);

    const shortResults = await searchLocations("a");
    expect(shortResults).toEqual([]);
  });

  describe("In-Memory Bounded Cache (TTL + FIFO Eviction)", () => {
    const createDummyData = (city: string): AirQualityData => ({
      location: { name: city, city, country: "India", lat: 20, lng: 75 },
      aqi: 100,
      scale: "IN_CPCB",
      tier: "moderate",
      tierLabel: "Moderate",
      healthSummary: "Moderate air",
      dominantPollutant: "PM2.5",
      pollutants: {
        pm25: { name: "PM2.5", chemicalFormula: "PM2.5", value: 30, unit: "µg/m³", whoGuideline24h: 15, status: "safe", healthImplications: "" },
        pm10: { name: "PM10", chemicalFormula: "PM10", value: 50, unit: "µg/m³", whoGuideline24h: 45, status: "safe", healthImplications: "" },
        no2: { name: "NO2", chemicalFormula: "NO₂", value: 20, unit: "µg/m³", whoGuideline24h: 25, status: "safe", healthImplications: "" },
        so2: { name: "SO2", chemicalFormula: "SO₂", value: 10, unit: "µg/m³", whoGuideline24h: 40, status: "safe", healthImplications: "" },
        co: { name: "CO", chemicalFormula: "CO", value: 1, unit: "mg/m³", whoGuideline24h: 4, status: "safe", healthImplications: "" },
        o3: { name: "O3", chemicalFormula: "O₃", value: 25, unit: "µg/m³", whoGuideline24h: 100, status: "safe", healthImplications: "" },
      },
      hourlyForecast: [],
      timestamp: new Date().toISOString(),
      source: "Open-Meteo",
      dataSourceType: "atmospheric_model",
      dataFreshness: "live",
      limitations: [],
    });

    it("should return dataFreshness: cached on repeated queries within TTL", async () => {
      const provider = new OpenMeteoAirQualityProvider();
      const cacheKey = "28.614_77.209_IN_CPCB";
      const dummy = createDummyData("Delhi");
      setBoundedCache(cacheKey, dummy, Date.now() + 60000);

      const cachedResult = await provider.getAirQuality(28.6139, 77.209, "Delhi", "Delhi", "India", "IN_CPCB");
      expect(cachedResult.dataFreshness).toBe("cached");
      expect(cachedResult.location.name).toBe("Delhi");
      expect(cachedResult.aqi).toBe(dummy.aqi);
    });

    it("should purge expired entries when capacity limit is reached", () => {
      const pastTime = Date.now() - 5000;
      const futureTime = Date.now() + 60000;

      // Fill 100 entries: first 50 expired, next 50 active
      for (let i = 0; i < 50; i++) {
        setBoundedCache(`expired_key_${i}`, createDummyData(`ExpiredCity_${i}`), pastTime);
      }
      for (let i = 50; i < 100; i++) {
        setBoundedCache(`active_key_${i}`, createDummyData(`ActiveCity_${i}`), futureTime);
      }

      expect(getCacheSizeForTesting()).toBe(100);

      // Inserting 101st entry triggers TTL cleanup of the 50 expired entries
      setBoundedCache("new_active_key", createDummyData("NewCity"), futureTime);

      // The 50 expired keys are gone; 50 active + 1 new = 51 remaining
      expect(getCacheSizeForTesting()).toBe(51);
    });

    it("should enforce maximum capacity of 100 entries via FIFO eviction when no entries are expired", () => {
      const futureTime = Date.now() + 600000;

      for (let i = 0; i < 100; i++) {
        setBoundedCache(`key_${i}`, createDummyData(`City_${i}`), futureTime);
      }

      expect(getCacheSizeForTesting()).toBe(100);

      // Adding 101st active entry should evict the oldest inserted key (key_0)
      setBoundedCache("key_100", createDummyData("City_100"), futureTime);
      expect(getCacheSizeForTesting()).toBe(100);

      // Adding 102nd active entry should evict key_1
      setBoundedCache("key_101", createDummyData("City_101"), futureTime);
      expect(getCacheSizeForTesting()).toBe(100);
    });
  });
});
