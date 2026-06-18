const buckets = new Map<string, number[]>();

function pruneTimestamps(timestamps: number[], now: number, windowMs: number): number[] {
  return timestamps.filter((ts) => now - ts < windowMs);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() ?? "unknown";
}

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const current = pruneTimestamps(buckets.get(key) ?? [], now, windowMs);

  if (current.length >= limit) {
    buckets.set(key, current);
    return true;
  }

  current.push(now);
  buckets.set(key, current);
  return false;
}
