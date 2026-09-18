"use client";

import { useCallback, useSyncExternalStore } from "react";
import { detectUnitSystem, type UnitSystem } from "./units";

const STORAGE_KEY = "units";

// Metric or imperial, guessed and then remembered.
//
// ── Why this isn't useState + useEffect ──────────────────────────────
// The obvious shape is `useState("metric")` and an effect that reads
// localStorage and corrects it. That is a setState inside an effect body,
// which React 19 calls out as a cascading render, and it is genuinely the
// wrong primitive: this value does not live in React. It lives in the
// browser — in `localStorage`, in `navigator.languages`, in the timezone —
// and React is subscribing to it.
//
// `useSyncExternalStore` is the primitive for exactly that, and it takes
// the server snapshot as a separate argument, which is the other half of
// the problem: none of those sources exist during prerender, and reading
// them during render is what produces markup the client then throws away.
//
// It also makes the choice global for free. There is one toggle today; the
// day there are two, both move together, because they are reading one
// store rather than holding two copies of a useState.

/** The live value, and a cache. `getSnapshot` must return a referentially
 *  stable result or React re-renders forever, so the read is done once and
 *  only repeated when something says it changed. */
let cached: UnitSystem | null = null;
const listeners = new Set<() => void>();

function read(): UnitSystem {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Safari in private mode throws on localStorage rather than returning
    // null. The guess below is a perfectly good answer.
  }
  return stored === "imperial" || stored === "metric" ? stored : detectUnitSystem();
}

function getSnapshot(): UnitSystem {
  if (cached === null) cached = read();
  return cached;
}

/** Metric on the server, always. It is what most of the planet uses, so
 *  it is the right thing to prerender; the client corrects it before
 *  anything is painted. */
function getServerSnapshot(): UnitSystem {
  return "metric";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab is another copy of this page, and a reader who switched to
  // imperial over there means it here too. `storage` fires only in the
  // OTHER tabs, which is exactly the ones that need telling.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cached = null;
    listeners.forEach((listener) => listener());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useUnitSystem(): [UnitSystem, (next: UnitSystem) => void] {
  const system = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const choose = useCallback((next: UnitSystem) => {
    cached = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Same as above: the choice still applies for this visit.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return [system, choose];
}
