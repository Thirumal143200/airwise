import { NextRequest, NextResponse } from "next/server";
import { CopilotRequestSchema } from "@/types";
import { askGeminiCopilot } from "@/lib/ai/geminiClient";
import { checkRateLimit, createSafeErrorResponse, sanitizeInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous_client";
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return createSafeErrorResponse(
      "You have reached the temporary rate limit. Please pause for 60 seconds before asking another question.",
      429,
      "RATE_LIMITED"
    );
  }

  try {
    const body = await req.json();
    const parsed = CopilotRequestSchema.safeParse(body);

    if (!parsed.success) {
      return createSafeErrorResponse("Invalid message payload.", 400, "VALIDATION_ERROR");
    }

    const { message, currentAqiData, userProfile } = parsed.data;
    const cleanMessage = sanitizeInput(message, 1000);

    const plan = await askGeminiCopilot(cleanMessage, currentAqiData, userProfile);

    const response = NextResponse.json({ plan });
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  } catch (err) {
    console.error("Copilot API handler error:", err);
    return createSafeErrorResponse("Failed to generate response.", 500, "COPILOT_ERROR");
  }
}
