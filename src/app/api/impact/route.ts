import { NextRequest, NextResponse } from "next/server";
import { ImpactCalculationInputSchema } from "@/types";
import { calculateEnvironmentalImpact } from "@/lib/calculator/impactCalculator";
import { checkRateLimit, createSafeErrorResponse } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous_client";
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return createSafeErrorResponse("Rate limit exceeded.", 429, "RATE_LIMITED");
  }

  try {
    const body = await req.json();
    const parsed = ImpactCalculationInputSchema.safeParse(body);

    if (!parsed.success) {
      return createSafeErrorResponse("Invalid impact calculation parameters", 400, "VALIDATION_ERROR");
    }

    const result = calculateEnvironmentalImpact(parsed.data);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Impact calculation API error:", err);
    return createSafeErrorResponse("Internal error calculating impact.", 500, "CALCULATION_ERROR");
  }
}
