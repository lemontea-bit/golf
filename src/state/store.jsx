import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { COURSE, PAR_TOTAL } from '../data/course.js';

const STORAGE_KEY = 'golf-score-app/v1';

// Seed data mirrors the Claude Design prototype's demo persona so the app
// isn't blank on first launch. Every value here is just a starting point —
// once the user edits anything, their real data takes over and persists.
function seedState() {
  return {
    tab: 'home',
    hole: 8,
    mapHole: 8,
    user: { name: 'ゆうき', avatar: 'Y' },
    currentRound: {
      course: '相模グリーンCC',
      teeName: '西コース',
      scores: {
        1: { s: 5, p: 2 },
        2: { s: 7, p: 2 },
        3: { s: 4, p: 2 },
        4: { s: 5, p: 1 },
        5: { s: 6, p: 3 },
        6: { s: 6, p: 2 },
        7: { s: 4, p: 2 },
        8: { s: 5, p: 2 },
      },
    },
    history: [
      { id: 'seed-1', course: '相模グリーンCC 西', date: '2026-08-30', score: 96, par: 72, putts: 38 },
      { id: 'seed-2', course: '房総ヒルズGC', date: '2026-08-09', score: 101, par: 72, putts: 41 },
      { id: 'seed-3', course: '那須野原ゴルフ倶楽部', date: '2026-07-12', score: 104, par: 72, putts: 43 },
    ],
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    // Merge over the seed shape so a future field addition doesn't crash on
    // an older saved blob.
    const seed = seedState();
    return {
      ...seed,
      ...parsed,
      user: { ...seed.user, ...parsed.user },
      currentRound: { ...seed.currentRound, ...parsed.currentRound },
      history: Array.isArray(parsed.history) ? parsed.history : seed.history,
    };
  } catch {
    return seedState();
  }
}

function clampHole(n) {
  return Math.max(1, Math.min(18, n));
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, tab: action.tab };
    case 'SET_HOLE':
      return { ...state, hole: clampHole(action.hole) };
    case 'SET_MAP_HOLE':
      return { ...state, mapHole: clampHole(action.hole) };
    case 'PREV_HOLE':
      return { ...state, hole: clampHole(state.hole - 1) };
    case 'NEXT_HOLE': {
      if (state.hole >= 18) return { ...state, tab: 'rec' };
      return { ...state, hole: clampHole(state.hole + 1) };
    }
    case 'SET_SCORE': {
      const { holeNumber, patch } = action;
      const par = COURSE.find((h) => h.n === holeNumber)?.par;
      const prev = state.currentRound.scores[holeNumber] || { s: par, p: 2 };
      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          scores: {
            ...state.currentRound.scores,
            [holeNumber]: { ...prev, ...patch },
          },
        },
      };
    }
    case 'COMPLETE_ROUND': {
      const { scores, course, teeName } = state.currentRound;
      let score = 0;
      let par = 0;
      let putts = 0;
      COURSE.forEach((h) => {
        const r = scores[h.n];
        if (r && r.s != null) {
          score += r.s;
          par += h.par;
          putts += r.p || 0;
        }
      });
      const entry = {
        id: `round-${Date.now()}`,
        course: teeName ? `${course} ${teeName}` : course,
        date: new Date().toISOString().slice(0, 10),
        score,
        par,
        putts,
      };
      return {
        ...state,
        history: [entry, ...state.history],
        currentRound: { ...state.currentRound, scores: {} },
        hole: 1,
        tab: 'home',
      };
    }
    default:
      return state;
  }
}

const GolfContext = createContext(null);

export function GolfProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode, quota) — the app still
      // works for the session, it just won't persist.
    }
  }, [state]);

  const actions = useMemo(
    () => ({
      setTab: (tab) => dispatch({ type: 'SET_TAB', tab }),
      setHole: (hole) => dispatch({ type: 'SET_HOLE', hole }),
      setMapHole: (hole) => dispatch({ type: 'SET_MAP_HOLE', hole }),
      prevHole: () => dispatch({ type: 'PREV_HOLE' }),
      nextHole: () => dispatch({ type: 'NEXT_HOLE' }),
      setScore: (holeNumber, patch) => dispatch({ type: 'SET_SCORE', holeNumber, patch }),
      completeRound: () => dispatch({ type: 'COMPLETE_ROUND' }),
    }),
    [],
  );

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);

  return <GolfContext.Provider value={value}>{children}</GolfContext.Provider>;
}

export function useGolf() {
  const ctx = useContext(GolfContext);
  if (!ctx) throw new Error('useGolf must be used within a GolfProvider');
  return ctx;
}

export function playedHoles(scores) {
  return COURSE.filter((h) => scores[h.n]?.s != null).length;
}

export function liveTotals(scores) {
  let total = 0;
  let parSum = 0;
  COURSE.forEach((h) => {
    const r = scores[h.n];
    if (r && r.s != null) {
      total += r.s;
      parSum += h.par;
    }
  });
  return { total, parSum };
}

export { PAR_TOTAL };
