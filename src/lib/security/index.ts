import { NextResponse } from "next/server";

// ==========================================
// 1. In-Memory Sliding Window Rate Limiter
// ==========================================
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

export function checkRateLimit(clientId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientId) || { timestamps: [] };

  // Filter out timestamps outside window
  const activeTimestamps = record.timestamps.filter((t) => now - t < WINDOW_SIZE_MS);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitStore.set(clientId, { timestamps: activeTimestamps });
    return { allowed: false, remaining: 0 };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(clientId, { timestamps: activeTimestamps });
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - activeTimestamps.length };
}

// Clean up stale rate limit entries periodically (every 10 minutes)
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((value, key) => {
      const active = value.timestamps.filter((t) => now - t < WINDOW_SIZE_MS);
      if (active.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, { timestamps: active });
      }
    });
  }, 10 * 60 * 1000);
  cleanupTimer.unref?.();
}

// ==========================================
// 2. Input Sanitization & Prompt Injection Defense
// ==========================================
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input) return "";

  // 1. Length bounding
  let sanitized = input.slice(0, maxLength);

  // 2. Strip control characters and unprintable chars
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 3. Neutralize common prompt injection delimiter attempts
  sanitized = sanitized.replace(/<<</g, "&lt;&lt;&lt;");
  sanitized = sanitized.replace(/>>>/g, "&gt;&gt;&gt;");
  sanitized = sanitized.replace(/\[SYSTEM\]/gi, "[Filtered Tag]");
  sanitized = sanitized.replace(/\[INSTRUCTION\]/gi, "[Filtered Tag]");
  sanitized = sanitized.replace(/IGNORE PREVIOUS INSTRUCTIONS/gi, "[Filtered Instruction]");

  return sanitized.trim();
}

/**
 * Fuzzes GPS coordinates to approximately 100m - 1km neighborhood resolution
 * to protect user privacy.
 */
export function sanitizeCoordinates(lat: number, lng: number): { lat: number; lng: number } {
  return {
    lat: Math.round(lat * 1000) / 1000,
    lng: Math.round(lng * 1000) / 1000,
  };
}

// ==========================================
// 3. Safe Error Formatter
// ==========================================
export function createSafeErrorResponse(
  message: string,
  statusCode: number = 400,
  code: string = "BAD_REQUEST"
): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
      },
    },
    { status: statusCode }
  );
}
