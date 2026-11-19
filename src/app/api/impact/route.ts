import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateEnvironmentalImpact } from "@/lib/calculator/impactCalculator";
import { checkRateLimit, createSafeErrorResponse } from "@/lib/security";

const ImpactSchema = z.object({
  commuteMode: z.enum([
    "private_car_petrol",
    "private_car_diesel",
    "two_wheeler",
    "public_metro_bus",
    "walking_cycling",
    "work_from_home",
  ]),
  distanceKm: z.number().min(0.5).max(300),
  alternativeMode: z.enum(["metro_train", "electric_bus", "carpool_4", "work_from_home"]),
  daysPerWeek: z.number().min(1).max(7),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous_client";
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return createSafeErrorResponse("Rate limit exceeded.", 429, "RATE_LIMITED");
  }

  try {
    const body = await req.json();
    const parsed = ImpactSchema.safeParse(body);

    if (!parsed.success) {
      return createSafeErrorResponse("Invalid impact calculation parameters", 400, "VALIDATION_ERROR");
    }

    const result = calculateEnvironmentalImpact(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Impact calculation API error:", err);
    return createSafeErrorResponse("Internal error calculating impact.", 500, "CALCULATION_ERROR");
  }
}
