import { NextRequest, NextResponse } from "next/server";
import { searchLocations } from "@/lib/environmental/provider";
import { checkRateLimit, createSafeErrorResponse, sanitizeInput } from "@/lib/security";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous_client";
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return createSafeErrorResponse("Rate limit exceeded.", 429, "RATE_LIMITED");
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const cleanQ = sanitizeInput(q, 100);

  if (!cleanQ || cleanQ.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchLocations(cleanQ);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Location search API error:", err);
    return createSafeErrorResponse("Failed to search locations", 500, "SEARCH_ERROR");
  }
}
