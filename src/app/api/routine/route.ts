import { NextRequest, NextResponse } from "next/server";
import { UserProfileSchema } from "@/types";
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
    const { aqiData, profile } = body;

    if (!aqiData || typeof aqiData.aqi !== "number") {
      return createSafeErrorResponse("Valid aqiData object is required.", 400, "INVALID_AQI_DATA");
    }

    const profileParsed = UserProfileSchema.safeParse(profile);
    if (!profileParsed.success) {
      return createSafeErrorResponse("Invalid user profile configuration.", 400, "INVALID_PROFILE");
    }

    const slots = generateDailyRoutine(aqiData, profileParsed.data);
    return NextResponse.json({ routine: slots });
  } catch (err) {
    console.error("Routine generation API error:", err);
    return createSafeErrorResponse("Internal error generating routine.", 500, "ROUTINE_ERROR");
  }
}
