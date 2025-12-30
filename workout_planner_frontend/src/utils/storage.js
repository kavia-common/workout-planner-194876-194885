/**
 * Local storage helpers for workouts.
 * Keeps all storage access centralized and guarded.
 */

const STORAGE_KEY = "workout_planner.workouts";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function isValidIsoDateYYYYMMDD(value) {
  if (!isNonEmptyString(value)) return false;
  // Basic format check: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;

  // Ensure it doesn't normalize into a different day string.
  const normalized = d.toISOString().slice(0, 10);
  return normalized === value;
}

function sanitizeWorkouts(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((w) => w && typeof w === "object")
    .map((w) => ({
      id: isNonEmptyString(w.id) ? w.id : undefined,
      exerciseName: isNonEmptyString(w.exerciseName) ? w.exerciseName : "",
      sets: typeof w.sets === "number" ? w.sets : Number(w.sets),
      reps: typeof w.reps === "number" ? w.reps : Number(w.reps),
      date: isNonEmptyString(w.date) ? w.date : "",
    }))
    .filter(
      (w) =>
        isNonEmptyString(w.id) &&
        isNonEmptyString(w.exerciseName) &&
        isPositiveInteger(w.sets) &&
        isPositiveInteger(w.reps) &&
        isValidIsoDateYYYYMMDD(w.date)
    );
}

// PUBLIC_INTERFACE
export function getSeedWorkouts() {
  /** @type {import("../types").Workout[]} */
  const seed = [
    {
      id: "seed_1",
      exerciseName: "Bench Press",
      sets: 3,
      reps: 8,
      date: new Date().toISOString().slice(0, 10),
    },
    {
      id: "seed_2",
      exerciseName: "Back Squat",
      sets: 5,
      reps: 5,
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    },
  ];
  return seed;
}

// PUBLIC_INTERFACE
export function loadWorkoutsOrSeed() {
  /**
   * Loads workouts from localStorage. If empty/missing, seeds example data once.
   * @returns {import("../types").Workout[]}
   */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = getSeedWorkouts();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const parsed = JSON.parse(raw);
    const sanitized = sanitizeWorkouts(parsed);

    // If data is present but invalid/empty, keep it empty (do not overwrite).
    return sanitized;
  } catch {
    // If localStorage access/JSON parse fails, fall back to seed in-memory.
    return getSeedWorkouts();
  }
}

// PUBLIC_INTERFACE
export function saveWorkouts(workouts) {
  /**
   * Persists workouts to localStorage.
   * @param {import("../types").Workout[]} workouts
   */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  } catch {
    // Ignore storage errors (e.g., quota, private mode).
  }
}

// PUBLIC_INTERFACE
export function clearWorkouts() {
  /** Clears workouts from localStorage. */
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
