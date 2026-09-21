import type { AnalysisSession } from "@/lib/schema/analysis";

export const SESSION_KEY = "ats-session";

export function saveSession(session: AnalysisSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): AnalysisSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnalysisSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function updateSession(
  updater: (session: AnalysisSession) => AnalysisSession,
): AnalysisSession | null {
  const current = loadSession();
  if (!current) return null;
  const next = updater(current);
  saveSession(next);
  return next;
}
