import { NextRequest, NextResponse } from "next/server";
import { AirQualityData, RoutineRequestSchema } from "@/types";
import { generateDailyRoutine } from "@/lib/routine/routineEngine";
import { checkRateLimit, createSafeErrorResponse } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous_client";
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return createSafeErrorResponse("Rate limit exceeded.", 429, "RATE_LIMITED");
  }

  try {
    const body = await req.json();
    const parsed = RoutineRequestSchema.safeParse(body);

    if (!parsed.success) {
      return createSafeErrorResponse("Invalid routine request payload.", 400, "VALIDATION_ERROR");
    }

    const { aqiData, profile } = parsed.data;
    const slots = generateDailyRoutine(aqiData as unknown as AirQualityData, profile);
    return NextResponse.json({ routine: slots });
  } catch (err: unknown) {
    console.error("Routine generation API error:", err);
    return createSafeErrorResponse("Internal error generating routine.", 500, "ROUTINE_ERROR");
  }
}
