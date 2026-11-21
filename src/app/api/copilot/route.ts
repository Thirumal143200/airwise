import { NextRequest, NextResponse } from "next/server";
import { CopilotRequestSchema } from "@/types";
import { askGeminiCopilot, generateDeterministicCopilotPlan } from "@/lib/ai/geminiClient";
import { checkRateLimit, createSafeErrorResponse, sanitizeInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous_client";
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    console.warn(`[Copilot API] Rate limit reached for client IP prefix=${ip.slice(0, 7)}...`);
    return createSafeErrorResponse(
      "You have reached the temporary rate limit. Please pause for 60 seconds before asking another question.",
      429,
      "RATE_LIMITED"
    );
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    console.warn("[Copilot API] Failed to parse JSON request body.");
    return createSafeErrorResponse("Malformed JSON request body.", 400, "BAD_REQUEST");
  }

  try {
    const parsed = CopilotRequestSchema.safeParse(body);

    if (!parsed.success) {
      console.warn("[Copilot API] Request failed schema validation:", parsed.error.issues);
      return createSafeErrorResponse("Invalid message payload.", 400, "VALIDATION_ERROR");
    }

    const { message, currentAqiData, userProfile } = parsed.data;
    const cleanMessage = sanitizeInput(message, 1000);

    console.log(`[Copilot API] Processing copilot query: messageLength=${cleanMessage.length}`);
    const plan = await askGeminiCopilot(
      cleanMessage,
      currentAqiData as any,
      userProfile
    );

    const response = NextResponse.json({ plan });
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[Copilot API] Unexpected handler error; generating deterministic safety fallback:", errMsg);
    const parsedBody = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
    const fallbackPlan = generateDeterministicCopilotPlan(
      typeof parsedBody.message === "string" ? sanitizeInput(parsedBody.message, 1000) : "general health advice",
      parsedBody.currentAqiData as any,
      parsedBody.userProfile as any
    );
    const response = NextResponse.json({ plan: fallbackPlan });
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  }
}
