/**
 * Single-owner admin gate.
 *
 * There is exactly one admin passcode (no sign-up, no extra accounts).
 * Entering it once on a device marks THAT device as trusted and stores the
 * unlock flag in localStorage, so the dashboard only opens on the owner's
 * laptop. Every other visitor to /admin gets the 404 page.
 */

// SHA-256 of the admin passcode. The plaintext is never stored in the repo.
const PASSCODE_HASH = "dac4e5af041187994e15d2336b31949ebdbc571b0e29541ca6b03f6a877f557b";

const DEVICE_KEY = "zalaltor.admin.device";
const DEVICE_VALUE = "trusted";

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isTrustedDevice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(DEVICE_KEY) === DEVICE_VALUE;
  } catch {
    return false;
  }
}

/** Verify the passcode and, on success, trust this device permanently. */
export async function unlockAdminDevice(passcode: string): Promise<boolean> {
  const hash = await sha256Hex(passcode.trim());
  if (hash !== PASSCODE_HASH) return false;
  try {
    window.localStorage.setItem(DEVICE_KEY, DEVICE_VALUE);
  } catch {
    return false;
  }
  return true;
}

/** Forget this device (sign out). */
export function lockAdminDevice(): void {
  try {
    window.localStorage.removeItem(DEVICE_KEY);
  } catch {
    /* ignore */
  }
}
