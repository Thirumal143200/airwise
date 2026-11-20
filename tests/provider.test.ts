import { describe, it, expect } from "vitest";
import { OpenMeteoAirQualityProvider, searchLocations } from "@/lib/environmental/provider";

describe("OpenMeteoAirQualityProvider & Location Search", () => {
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
});
