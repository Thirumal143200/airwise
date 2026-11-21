import { NextRequest, NextResponse } from "next/server";
import { LocationSearchQuerySchema } from "@/types";
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

  const parsed = LocationSearchQuerySchema.safeParse({ q: cleanQ });
  if (!parsed.success) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchLocations(parsed.data.q);
    return NextResponse.json({ results });
  } catch (err: unknown) {
    console.error("Location search API error:", err);
    return createSafeErrorResponse("Failed to search locations", 500, "SEARCH_ERROR");
  }
}
