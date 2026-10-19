// Versioned localStorage helpers. Reads and writes never throw: a private
// window or blocked storage simply means nothing is remembered.

export function readStored<T>(key: string, isValid: (v: unknown) => v is T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    return isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: keep working in memory only.
  }
}
