/**
 * Hackathon-Proof Resilience & Fallback Engine
 * 
 * Enforces a strict 3000ms timeout for live space agency API calls.
 * If live NASA/ESA/CSA endpoints take longer than 3000ms or return network errors,
 * it immediately triggers the toast notification:
 * "⚡ Live API slow. Using Cached Demo Data for stability."
 * and returns local cached demo data from /public/data/ or pre-compiled fallbacks.
 */

type ToastListener = (message: string, durationMs?: number) => void;
const listeners = new Set<ToastListener>();

export const toastService = {
  subscribe(fn: ToastListener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  show(message: string, durationMs: number = 4000) {
    listeners.forEach((fn) => fn(message, durationMs));
  },
};

/**
 * Execute a promise with a 3000ms deadline.
 * If exceeded or rejected, falls back to fallbackFn() and triggers the alert toast.
 */
export async function withResilience<T>(
  apiPromise: Promise<T>,
  fallbackFn: () => Promise<T> | T,
  timeoutMs: number = 3000,
  customToastMsg: string = '⚡ Live API slow. Using Cached Demo Data for stability.'
): Promise<{ data: T; isFallback: boolean }> {
  let timeoutId: any;
  let didTimeout = false;

  const timerPromise = new Promise<{ timeout: true; data?: undefined }>((resolve) => {
    timeoutId = setTimeout(() => {
      didTimeout = true;
      resolve({ timeout: true });
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([
      apiPromise.then((data) => ({ data, timeout: false as const })),
      timerPromise,
    ]);

    clearTimeout(timeoutId);

    if (result.timeout || result.data === undefined) {
      console.warn(`[Resilience Engine] API call exceeded ${timeoutMs}ms. Activating cached fallback.`);
      toastService.show(customToastMsg);
      const fallbackData = await fallbackFn();
      return { data: fallbackData, isFallback: true };
    }

    return { data: result.data, isFallback: false };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`[Resilience Engine] API failed (${err?.message || 'network error'}). Activating cached fallback.`);
    toastService.show(customToastMsg);
    const fallbackData = await fallbackFn();
    return { data: fallbackData, isFallback: true };
  }
}
