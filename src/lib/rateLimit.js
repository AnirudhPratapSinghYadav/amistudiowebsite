// Client-side cooldown between booking requests. A courtesy, not a defence: any server
// endpoint added later must enforce its own rate limit.
const KEY = 'oneness-last-booking';
export const COOLDOWN_MS = 60_000;

export function coolingDown() {
  let last = 0;
  try {
    last = Number(localStorage.getItem(KEY) || 0);
  } catch {
    /* storage blocked */
  }
  return Date.now() - last < COOLDOWN_MS;
}

export function markSent() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* storage blocked */
  }
}
