/* ──────────────────────────────────────────────────────────────
   app.js — the whole interface.
   Vanilla ES modules, no build step, so it runs on GitHub Pages
   exactly as it runs from your hard disk.
   ────────────────────────────────────────────────────────────── */

import { PROFILE } from "./profile.js";
import { PORTALS, GROUPS, QUERIES, portalUrl } from "./portals.js";
import { CHECKLISTS, UNIVERSAL, TRACKS, flatItems } from "./checklists.js";
import { GENERATORS } from "./letters.js";
import { store, STAGES, newApplication } from "./store.js";
import { daysUntil, daysOld } from "./score.js";

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let JOBS = [];
let META = null;

/* ══════════════════ Theme ══════════════════ */
const theme = {
  init() {
    const saved = localStorage.getItem("ajr.theme");
    const dark = saved ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  },
  toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("ajr.theme", next);
  },
};

/* ══════════════════ Data load ══════════════════ */
async function loadJobs() {
  try {
    const r = await fetch(`data/jobs.json?v=${Date.now()}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    JOBS = d.jobs || [];
    META = d;

    const age = daysOld(d.generatedAt);
    const label = age === null ? "unknown"
      : age === 0 ? "today" : age === 1 ? "yesterday" : `${age} days ago`;
    $("#dataAge").textContent = `feed: ${label}`;
    $("#dataAge").className = `pill ${age > 10 ? "pill--urgent" : "pill--muted"}`;
    $("#footStats").textContent =
      `${JOBS.length} listings from ${Object.keys(d.counts?.bySource || {}).join(", ") || "—"}`;
  } catch (e) {
    JOBS = [];
    $("#dataAge").textContent = "feed: not built yet";
    $("#feedHint").innerHTML =
      `No <code>data/jobs.json</code> yet. Run <code>npm run fetch</code> locally, or let the ` +
      `GitHub Action run once. Everything else on this page works without it.`;
  }
}

/* ══════════════════ Navigation ══════════════════ */
function show(view) {
  $$(".tab").forEach((t) => t.classList.toggle("tab--active", t.dataset.view === view));
  $$(".view").forEach((v) => v.classList.toggle("view--active", v.id === `view-${view}`));
  location.hash = view;
  window.scrollTo({ top: 0 });

  // Re-render on entry: a view can be stale if something was saved from
  // another tab — starring a job, or adding it straight to the tracker.
  if (view === "dashboard") renderDashboard();
  if (view === "tracker") renderTracker();
  if (view === "checklist") renderChecklist();
}

/* ══════════════════ Dashboard ══════════════════ */
function renderDashboard() {
  const strong = JOBS.filter((j) => j.band === "strong" && !store.isHidden(j.id));
  const apps = store.all.applications;
  const live = apps.filter((a) => !["Closed"].includes(a.stage));

  const closing = JOBS
    .filter((j) => j.deadline)
    .map((j) => ({ ...j, left: daysUntil(j.deadline) }))
    .filter((j) => j.left !== null && j.left >= 0 && j.left <= 30)
    .sort((a, b) => a.left - b.left)
    .slice(0, 6);

  const appDeadlines = apps
    .filter((a) => a.deadline && a.stage !== "Closed")
    .map((a) => ({ ...a, left: daysUntil(a.deadline) }))
    .filter((a) => a.left !== null && a.left <= 45)
    .sort((a, b) => a.left - b.left);

  const uniProg = store.trackProgress("universal", flatItems(UNIVERSAL).map((i) => i.id));

  $("#dashContent").innerHTML = `
    <div class="grid">
      <div class="stat stat--strong"><div class="stat__num">${strong.length}</div><div class="stat__lab">Strong matches in the feed</div></div>
      <div class="stat stat--accent"><div class="stat__num">${JOBS.length}</div><div class="stat__lab">Total listings scored</div></div>
      <div class="stat"><div class="stat__num">${live.length}</div><div class="stat__lab">Applications in flight</div></div>
      <div class="stat ${appDeadlines.some((a) => a.left <= 7) ? "stat--danger" : ""}">
        <div class="stat__num">${appDeadlines.length}</div><div class="stat__lab">Your deadlines within 45 days</div></div>
    </div>

    ${uniProg.pct < 100 ? `
    <div class="panel">
      <h3>Start here — one-time prep</h3>
      <p class="sub">${uniProg.done} of ${uniProg.total} done. Finish this once and every later application becomes a short job instead of a long one.</p>
      <div class="bar ${uniProg.pct === 100 ? "bar--done" : ""}"><i style="width:${uniProg.pct}%"></i></div>
      <div style="margin-top:12px"><button class="btn btn--sm" data-go="checklist">Open the checklist →</button></div>
    </div>` : ""}

    ${appDeadlines.length ? `
    <div class="panel">
      <h3>Your deadlines</h3>
      <p class="sub">From your tracker.</p>
      <div class="rows">
        ${appDeadlines.map((a) => `
          <div class="row">
            <span class="pill ${a.left <= 7 ? "pill--urgent" : "pill--muted"}">${a.left < 0 ? "passed" : a.left + "d"}</span>
            <span class="row__grow"><strong>${esc(a.title || "Untitled")}</strong> — ${esc(a.org || "—")}</span>
            <span class="pill pill--muted">${esc(a.stage)}</span>
          </div>`).join("")}
      </div>
    </div>` : ""}

    ${closing.length ? `
    <div class="panel">
      <h3>Closing soon in the feed</h3>
      <p class="sub">Listings with a stated deadline in the next 30 days.</p>
      <div class="rows">
        ${closing.map((j) => `
          <a class="row" href="${esc(j.url)}" target="_blank" rel="noopener">
            <span class="pill ${j.left <= 7 ? "pill--urgent" : "pill--muted"}">${j.left}d</span>
            <span class="row__grow">${esc(j.title)}</span>
            <span class="pill pill--${j.band}">${j.score}</span>
          </a>`).join("")}
      </div>
    </div>` : ""}

    <div class="panel">
      <h3>Best matches right now</h3>
      <p class="sub">Scored against your profile: medical imaging, deep learning, and post-PhD level roles.</p>
      ${strong.length ? `<div class="rows">
        ${strong.slice(0, 8).map((j) => `
          <a class="row" href="${esc(j.url)}" target="_blank" rel="noopener">
            <span class="pill pill--strong">${j.score}</span>
            <span class="row__grow">${esc(j.title)}<span style="color:var(--muted)"> — ${esc(j.org)}</span></span>
            <span class="pill pill--muted">${esc(j.source)}</span>
          </a>`).join("")}
      </div>
      <div style="margin-top:12px"><button class="btn btn--sm" data-go="feed">See the whole feed →</button></div>`
      : `<p class="hint" style="margin:0">Nothing scoring 45+ this week. Try the <button class="btn btn--sm" data-go="portals">search portals</button> — India and Gulf posts almost never appear in machine-readable feeds.</p>`}
    </div>

    <div class="panel">
      <h3>Your profile, as this app sees it</h3>
      <p class="sub">Scoring and every generated document read from <code>assets/js/profile.js</code>. Edit that file when your CV changes.</p>
      <div class="grid">
        <div><div class="stat__num" style="font-size:20px">${PROFILE.bibliometrics.publications}</div><div class="stat__lab">publications (${PROFILE.bibliometrics.firstAuthor} first-author)</div></div>
        <div><div class="stat__num" style="font-size:20px">${PROFILE.bibliometrics.q1Scie}</div><div class="stat__lab">Q1 SCIE journals</div></div>
        <div><div class="stat__num" style="font-size:20px">${PROFILE.bibliometrics.hIndex}</div><div class="stat__lab">h-index</div></div>
        <div><div class="stat__num" style="font-size:20px">${PROFILE.bibliometrics.citations}+</div><div class="stat__lab">citations</div></div>
      </div>
    </div>`;

  $$("[data-go]", $("#dashContent")).forEach((b) => b.onclick = () => show(b.dataset.go));
}

/* ══════════════════ Feed ══════════════════ */
function renderFeed() {
  const q = $("#feedSearch").value.trim().toLowerCase();
  const track = $("#feedTrack").value;
  const bandF = $("#feedBand").value;
  const sort = $("#feedSort").value;
  const savedOnly = $("#feedSavedOnly").checked;

  let rows = JOBS.filter((j) => !store.isHidden(j.id));
  if (savedOnly) rows = rows.filter((j) => store.isSaved(j.id));
  if (track) rows = rows.filter((j) => j.track === track);
  if (bandF === "strong") rows = rows.filter((j) => j.band === "strong");
  if (bandF === "possible") rows = rows.filter((j) => j.band !== "weak");
  if (q) rows = rows.filter((j) =>
    `${j.title} ${j.org} ${j.location} ${j.description} ${j.field}`.toLowerCase().includes(q));

  rows.sort((a, b) => {
    if (sort === "posted") return (b.posted || "").localeCompare(a.posted || "");
    if (sort === "deadline") {
      const A = daysUntil(a.deadline), B = daysUntil(b.deadline);
      if (A === null && B === null) return b.score - a.score;
      if (A === null) return 1;
      if (B === null) return -1;
      return A - B;
    }
    return b.score - a.score;
  });

  $("#feedCount").textContent = rows.length;
  $("#feedList").innerHTML = rows.length
    ? rows.slice(0, 250).map(jobCard).join("")
    : `<div class="empty">Nothing matches those filters.${store.all.hidden.length
        ? ` <button class="btn btn--sm" id="unhideBtn">Restore ${store.all.hidden.length} dismissed</button>` : ""}</div>`;

  const un = $("#unhideBtn");
  if (un) un.onclick = () => { store.unhideAll(); renderFeed(); };

  $$("[data-save]", $("#feedList")).forEach((b) =>
    b.onclick = () => { store.toggleSave(b.dataset.save); renderFeed(); });
  $$("[data-hide]", $("#feedList")).forEach((b) =>
    b.onclick = () => { store.hide(b.dataset.hide); renderFeed(); });
  $$("[data-track-add]", $("#feedList")).forEach((b) =>
    b.onclick = () => {
      const j = JOBS.find((x) => x.id === b.dataset.trackAdd);
      if (!j) return;
      store.addApplication({
        title: j.title, org: j.org, url: j.url, deadline: j.deadline || "",
        track: j.track === "gulf" ? "gulf" : j.track === "india" ? "india-private" : "postdoc",
      });
      b.textContent = "✓ in tracker"; b.disabled = true;
      refreshCounts();
    });
}

function jobCard(j) {
  const left = daysUntil(j.deadline);
  const age = daysOld(j.posted);
  const saved = store.isSaved(j.id);
  return `
  <article class="card">
    <div class="card__head">
      <h3 class="card__title"><a href="${esc(j.url)}" target="_blank" rel="noopener">${esc(j.title)}</a></h3>
      <span class="pill pill--${j.band}" title="Relevance score against your profile">${j.score}</span>
    </div>
    <div class="card__meta">
      <span>🏛 ${esc(j.org || "—")}</span>
      ${j.location ? `<span>📍 ${esc(j.location).slice(0, 70)}</span>` : ""}
      <span>🔗 ${esc(j.source)}</span>
      ${age !== null ? `<span>🕑 ${age === 0 ? "today" : age + "d ago"}</span>` : ""}
      ${left !== null ? `<span class="pill ${left <= 14 ? "pill--urgent" : "pill--muted"}">closes in ${left}d</span>` : ""}
    </div>
    ${j.description ? `<p class="card__desc">${esc(j.description)}</p>` : ""}
    ${j.matched?.length ? `<div class="item__tags">${j.matched.slice(0, 6).map((m) => `<span class="pill pill--kw">${esc(m)}</span>`).join("")}</div>` : ""}
    <div class="card__foot">
      <a class="btn btn--sm btn--primary" href="${esc(j.url)}" target="_blank" rel="noopener">Open listing</a>
      <button class="btn btn--sm" data-track-add="${esc(j.id)}">+ Track</button>
      <button class="btn btn--sm" data-save="${esc(j.id)}">${saved ? "★ Saved" : "☆ Save"}</button>
      <span class="spacer"></span>
      <button class="btn btn--sm btn--ghost" data-hide="${esc(j.id)}" title="Hide this listing">Dismiss</button>
    </div>
  </article>`;
}

/* ══════════════════ Portals ══════════════════ */
function renderPortals() {
  const q = $("#portalQuery").value || "assistant professor";
  const order = ["india-govt", "india-private", "gulf", "postdoc", "fellowship", "fellowship-india"];

  $("#portalList").innerHTML = order.map((g) => {
    const items = PORTALS.filter((p) => p.group === g);
    if (!items.length) return "";
    return `
      <div>
        <div class="pgroup__head">${GROUPS[g].icon} ${GROUPS[g].label}</div>
        <div class="pgrid">
          ${items.map((p) => `
            <a class="portal" href="${esc(portalUrl(p, q))}" target="_blank" rel="noopener">
              <strong>${esc(p.name)}</strong>
              ${p.note ? `<small>${esc(p.note)}</small>` : ""}
            </a>`).join("")}
        </div>
      </div>`;
  }).join("");
}

/* ══════════════════ Checklists ══════════════════ */
let activeTrack = "universal";

function renderTrackPicker() {
  const all = [{ id: "universal", label: "One-time prep", icon: "⭐" }, ...TRACKS];
  $("#trackPicker").innerHTML = all.map((t) => {
    const cl = t.id === "universal" ? UNIVERSAL : CHECKLISTS[t.id];
    const p = store.trackProgress(t.id, flatItems(cl).map((i) => i.id));
    return `<button data-track="${t.id}" aria-pressed="${t.id === activeTrack}">
      ${t.icon} ${esc(t.label)} <span style="opacity:.75">${p.done}/${p.total}</span></button>`;
  }).join("");
  $$("[data-track]", $("#trackPicker")).forEach((b) =>
    b.onclick = () => { activeTrack = b.dataset.track; renderChecklist(); });
}

function renderChecklist() {
  renderTrackPicker();
  const cl = activeTrack === "universal" ? UNIVERSAL : CHECKLISTS[activeTrack];
  const items = flatItems(cl);
  const p = store.trackProgress(activeTrack, items.map((i) => i.id));

  const critLeft = items.filter((i) => i.critical && !store.isTicked(activeTrack, i.id)).length;

  $("#checklistBody").innerHTML = `
    <div class="panel">
      <h3>${esc(cl.title)}</h3>
      <p class="sub">${esc(cl.blurb)}</p>
      <div class="bar ${p.pct === 100 ? "bar--done" : ""}"><i style="width:${p.pct}%"></i></div>
      <div class="card__meta" style="margin-top:9px">
        <span>${p.done} of ${p.total} done (${p.pct}%)</span>
        ${critLeft ? `<span class="pill pill--urgent">${critLeft} critical item${critLeft > 1 ? "s" : ""} outstanding</span>` : `<span class="pill pill--strong">no critical gaps</span>`}
      </div>
    </div>

    ${cl.eligibilityNote ? `<div class="callout"><strong>Where you stand:</strong> ${esc(cl.eligibilityNote)}</div>` : ""}

    ${cl.sections.map((s) => `
      <div class="sec">
        <div class="sec__head">${esc(s.name)}</div>
        ${s.items.map((i) => {
          const done = store.isTicked(activeTrack, i.id);
          return `
          <div class="item ${done ? "item--done" : ""}">
            <input type="checkbox" id="ck_${esc(i.id)}" ${done ? "checked" : ""} data-item="${esc(i.id)}">
            <div class="item__body">
              <label class="item__label" for="ck_${esc(i.id)}">${esc(i.label)}</label>
              ${i.detail ? `<div class="item__detail">${esc(i.detail)}</div>` : ""}
              <div class="item__tags">
                ${i.critical ? `<span class="tag tag--crit">critical</span>` : ""}
                ${i.leadDays ? `<span class="tag tag--lead">start ${i.leadDays} days ahead</span>` : ""}
                ${i.have ? `<span class="tag tag--have">you have: ${esc(i.have)}</span>` : ""}
              </div>
            </div>
          </div>`;
        }).join("")}
      </div>`).join("")}`;

  $$("[data-item]", $("#checklistBody")).forEach((c) =>
    c.onchange = () => { store.toggle(activeTrack, c.dataset.item); renderChecklist(); });
}

/* ══════════════════ Apply / generators ══════════════════ */
let activeGen = null;

function renderGenList() {
  $("#genList").innerHTML = GENERATORS.map((g) => `
    <button data-gen="${g.id}" aria-pressed="${activeGen === g.id}">
      ${esc(g.name)}<small>${esc(g.blurb)}</small>
    </button>`).join("");
  $$("[data-gen]", $("#genList")).forEach((b) =>
    b.onclick = () => { activeGen = b.dataset.gen; renderGen(); });
}

function renderGen() {
  renderGenList();
  const g = GENERATORS.find((x) => x.id === activeGen);
  if (!g) return;

  $("#genTitle").textContent = g.name;
  $("#genFields").innerHTML = g.fields.map((f) => `
    <input class="input" data-field="${f}" placeholder="${esc(labelFor(f))}">`).join("");

  const build = () => {
    const args = {};
    $$("[data-field]", $("#genFields")).forEach((i) => { if (i.value.trim()) args[i.dataset.field] = i.value.trim(); });
    const text = g.fn(args);
    $("#genOutput").value = text;
    const holes = (text.match(/\[[A-Z][^\]]{3,}\]/g) || []).length;
    $("#genWarn").innerHTML = holes
      ? `<span style="color:var(--possible)">⚠ ${holes} placeholder${holes > 1 ? "s" : ""} still to fill — search the text for <code>[</code>. The bracketed parts are the only bits that make this letter specific to them; leaving them in is worse than not applying.</span>`
      : `<span style="color:var(--strong)">✓ No placeholders left. Read it once more in their voice, then send.</span>`;
  };

  $$("[data-field]", $("#genFields")).forEach((i) => i.oninput = build);
  build();
}

const LABELS = {
  piName: "PI surname", institution: "Institution", topic: "Their research topic",
  paper: "Their recent paper title", department: "Department", position: "Position title",
  refNo: "Advertisement number", post: "Post applied for", chair: "Search committee chair",
  refereeName: "Referee name", deadline: "Deadline", appliedDate: "Date you applied", contact: "Contact name",
};
const labelFor = (f) => LABELS[f] || f;

/* ══════════════════ Tracker ══════════════════ */
function renderTracker() {
  const apps = store.all.applications;
  $("#trackerCount").textContent = apps.filter((a) => a.stage !== "Closed").length;

  $("#trackerBoard").innerHTML = STAGES.map((stage) => {
    const inStage = apps.filter((a) => a.stage === stage);
    return `
      <div class="col">
        <div class="col__head"><span>${stage}</span><span>${inStage.length}</span></div>
        ${inStage.map(appCard).join("") || `<div style="font-size:12.5px;color:var(--muted);padding:6px 2px">—</div>`}
      </div>`;
  }).join("");

  $$("[data-stage]", $("#trackerBoard")).forEach((s) =>
    s.onchange = () => { store.updateApplication(s.dataset.stage, { stage: s.value }); renderTracker(); });
  $$("[data-del]", $("#trackerBoard")).forEach((b) =>
    b.onclick = () => {
      const a = store.all.applications.find((x) => x.id === b.dataset.del);
      if (confirm(`Remove "${a?.title || "this application"}" from the tracker?`)) {
        store.removeApplication(b.dataset.del); renderTracker();
      }
    });
  $$("[data-edit]", $("#trackerBoard")).forEach((b) =>
    b.onclick = () => editApplication(b.dataset.edit));
}

function appCard(a) {
  const left = daysUntil(a.deadline);
  return `
  <div class="appcard">
    <h4>${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${esc(a.title || "Untitled")}</a>` : esc(a.title || "Untitled")}</h4>
    <div class="org">${esc(a.org || "—")}</div>
    ${left !== null ? `<div style="margin-top:5px"><span class="pill ${left <= 7 ? "pill--urgent" : "pill--muted"}">${left < 0 ? "deadline passed" : `closes in ${left}d`}</span></div>` : ""}
    ${a.notes ? `<div class="item__detail" style="margin-top:6px">${esc(a.notes).slice(0, 160)}</div>` : ""}
    <div class="appcard__row">
      <select data-stage="${esc(a.id)}">
        ${STAGES.map((s) => `<option ${s === a.stage ? "selected" : ""}>${s}</option>`).join("")}
      </select>
      <span class="spacer"></span>
      <button class="btn btn--sm btn--ghost" data-edit="${esc(a.id)}" title="Edit">✎</button>
      <button class="btn btn--sm btn--ghost" data-del="${esc(a.id)}" title="Remove">✕</button>
    </div>
  </div>`;
}

function editApplication(id) {
  const a = store.all.applications.find((x) => x.id === id);
  if (!a) return;
  const title = prompt("Position title:", a.title); if (title === null) return;
  const org = prompt("Institution:", a.org); if (org === null) return;
  const deadline = prompt("Deadline (YYYY-MM-DD, blank for none):", a.deadline); if (deadline === null) return;
  const url = prompt("Link to the advertisement:", a.url); if (url === null) return;
  const notes = prompt("Notes:", a.notes); if (notes === null) return;
  store.updateApplication(id, { title, org, deadline, url, notes });
  renderTracker();
}

function refreshCounts() {
  $("#trackerCount").textContent = store.all.applications.filter((a) => a.stage !== "Closed").length;
}

/* ══════════════════ Boot ══════════════════ */
async function init() {
  theme.init();
  $("#themeBtn").onclick = theme.toggle;
  $("#brandSub").textContent = `${PROFILE.name} · ${PROFILE.tagline}`;

  $$(".tab").forEach((t) => t.onclick = () => show(t.dataset.view));

  await loadJobs();

  // Feed
  ["#feedSearch", "#feedTrack", "#feedBand", "#feedSort", "#feedSavedOnly"]
    .forEach((s) => { const el = $(s); el.oninput = renderFeed; el.onchange = renderFeed; });
  renderFeed();

  // Portals
  $("#portalPreset").innerHTML =
    `<option value="">Preset searches…</option>` +
    Object.entries(QUERIES).map(([k, v]) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
  $("#portalPreset").onchange = (e) => {
    if (e.target.value) { $("#portalQuery").value = e.target.value; renderPortals(); }
  };
  $("#portalQuery").oninput = renderPortals;
  renderPortals();

  renderChecklist();

  activeGen = GENERATORS[0].id;
  renderGen();
  $("#copyBtn").onclick = async () => {
    await navigator.clipboard.writeText($("#genOutput").value);
    $("#copyBtn").textContent = "Copied ✓";
    setTimeout(() => ($("#copyBtn").textContent = "Copy"), 1400);
  };
  $("#downloadBtn").onclick = () => {
    const g = GENERATORS.find((x) => x.id === activeGen);
    const blob = new Blob([$("#genOutput").value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${g.id}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Tracker
  $("#addAppBtn").onclick = () => {
    const a = newApplication();
    a.title = prompt("Position title:", "") || "";
    if (!a.title) return;
    a.org = prompt("Institution:", "") || "";
    a.deadline = prompt("Deadline (YYYY-MM-DD, blank for none):", "") || "";
    a.url = prompt("Link to the advertisement:", "") || "";
    store.addApplication(a);
    renderTracker();
  };
  $("#exportBtn").onclick = () => store.export();
  $("#importInput").onchange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      await store.import(f);
      alert("Backup restored.");
      renderTracker(); renderChecklist(); renderFeed(); renderDashboard();
    } catch (err) { alert("Could not read that file:\n\n" + err.message); }
    e.target.value = "";
  };
  renderTracker();

  renderDashboard();
  show(location.hash.slice(1) || "dashboard");

  window.addEventListener("store:changed", refreshCounts);
}

init();
