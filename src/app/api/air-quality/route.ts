import { NextRequest, NextResponse } from "next/server";
import { LocationQuerySchema } from "@/types";
import { OpenMeteoAirQualityProvider } from "@/lib/environmental/provider";
import { checkRateLimit, createSafeErrorResponse, sanitizeCoordinates } from "@/lib/security";

const provider = new OpenMeteoAirQualityProvider();

export async function GET(req: NextRequest) {
  // Client identification for rate limiting
  const ip = req.headers.get("x-forwarded-for") || "anonymous_client";
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return createSafeErrorResponse("Rate limit exceeded. Please wait a minute before retrying.", 429, "RATE_LIMITED");
  }

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "Delhi";
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");
  const scale = (searchParams.get("scale") as any) || "IN_CPCB";

  let lat = latStr ? parseFloat(latStr) : 28.6139;
  let lng = lngStr ? parseFloat(lngStr) : 77.209;

  // Validate inputs
  const parseResult = LocationQuerySchema.safeParse({ city, lat, lng, scale });
  if (!parseResult.success) {
    return createSafeErrorResponse("Invalid query parameters", 400, "VALIDATION_ERROR");
  }

  // Sanitize coordinates for privacy
  const sanitizedCoords = sanitizeCoordinates(lat, lng);

  try {
    const data = await provider.getAirQuality(
      sanitizedCoords.lat,
      sanitizedCoords.lng,
      city,
      city,
      "India",
      scale
    );

    const response = NextResponse.json(data);
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1200");
    return response;
  } catch (error) {
    console.error("Air Quality API handler error:", error);
    return createSafeErrorResponse("Failed to retrieve air quality data. Please try again.", 500, "PROVIDER_ERROR");
  }
}
