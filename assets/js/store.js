/* ──────────────────────────────────────────────────────────────
   store.js — everything you save lives in this browser only.

   Nothing is transmitted anywhere. That is deliberate: your
   application history, salary notes and interview impressions have
   no business sitting in a public GitHub repository. Use Export
   to move it between machines.
   ────────────────────────────────────────────────────────────── */

const KEY = "ajr.v1";

const EMPTY = {
  version: 1,
  checklists: {},      // { "<trackId>:<itemId>": true }
  applications: [],    // see newApplication()
  saved: [],           // job ids starred from the feed
  hidden: [],          // job ids dismissed from the feed
  notes: {},           // { <jobId>: "free text" }
  updatedAt: null,
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(EMPTY);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(EMPTY), ...parsed };
  } catch {
    console.warn("Saved data was unreadable; starting fresh.");
    return structuredClone(EMPTY);
  }
}

function persist() {
  state.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    alert("Could not save — browser storage may be full or blocked.\n\n" + e.message);
  }
  window.dispatchEvent(new CustomEvent("store:changed"));
}

export const store = {
  get all() { return state; },

  /* ── Checklist ticks ─────────────────────────────────────── */
  isTicked: (track, item) => !!state.checklists[`${track}:${item}`],
  toggle(track, item) {
    const k = `${track}:${item}`;
    if (state.checklists[k]) delete state.checklists[k];
    else state.checklists[k] = true;
    persist();
  },
  trackProgress(track, itemIds) {
    const done = itemIds.filter((id) => state.checklists[`${track}:${id}`]).length;
    return { done, total: itemIds.length, pct: itemIds.length ? Math.round((done / itemIds.length) * 100) : 0 };
  },

  /* ── Saved / hidden listings ─────────────────────────────── */
  isSaved: (id) => state.saved.includes(id),
  toggleSave(id) {
    state.saved = state.saved.includes(id) ? state.saved.filter((x) => x !== id) : [...state.saved, id];
    persist();
  },
  isHidden: (id) => state.hidden.includes(id),
  hide(id) { if (!state.hidden.includes(id)) { state.hidden.push(id); persist(); } },
  unhideAll() { state.hidden = []; persist(); },

  /* ── Applications ────────────────────────────────────────── */
  addApplication(app) {
    state.applications.unshift({ ...newApplication(), ...app });
    persist();
  },
  updateApplication(id, patch) {
    const a = state.applications.find((x) => x.id === id);
    if (a) { Object.assign(a, patch, { updatedAt: new Date().toISOString() }); persist(); }
  },
  removeApplication(id) {
    state.applications = state.applications.filter((x) => x.id !== id);
    persist();
  },

  /* ── Notes ───────────────────────────────────────────────── */
  note: (id) => state.notes[id] || "",
  setNote(id, text) {
    if (text.trim()) state.notes[id] = text; else delete state.notes[id];
    persist();
  },

  /* ── Backup ──────────────────────────────────────────────── */
  export() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `job-radar-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  },
  async import(file) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (typeof parsed !== "object" || !("checklists" in parsed))
      throw new Error("That does not look like a Job Radar backup file.");
    state = { ...structuredClone(EMPTY), ...parsed };
    persist();
  },
  reset() {
    state = structuredClone(EMPTY);
    persist();
  },
};

export const STAGES = ["Interested", "Preparing", "Applied", "Interview", "Offer", "Closed"];

export function newApplication() {
  return {
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    org: "",
    track: "india-private",
    url: "",
    stage: "Interested",
    deadline: "",
    appliedOn: "",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
