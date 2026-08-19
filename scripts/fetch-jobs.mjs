/* ──────────────────────────────────────────────────────────────
   fetch-jobs.mjs — the weekly job.

   Runs in GitHub Actions (or locally with `npm run fetch`), pulls
   every configured source, scores each listing against your profile,
   drops the weak ones, and writes data/jobs.json. The site reads
   that file — so the published page is static and instant, and no
   scraping happens in your browser.

   Design decision: one source failing must never lose the run. Each
   adapter is wrapped, and if everything fails we keep the previous
   jobs.json rather than publishing an empty one.
   ────────────────────────────────────────────────────────────── */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchEuraxess } from "./sources/euraxess.mjs";
import { fetchJobRxiv } from "./sources/jobrxiv.mjs";
import { fetchAdzuna } from "./sources/adzuna.mjs";
import { scoreJob, classifyTrack, daysUntil } from "../assets/js/score.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data", "jobs.json");

const VERBOSE = process.argv.includes("--verbose");
const log = (m) => VERBOSE && console.log(m);
const say = (m) => console.log(m);

// Anything below this is noise. Raise it if the feed gets too busy.
const MIN_SCORE = 22;

async function safely(name, fn) {
  const t0 = Date.now();
  try {
    const rows = await fn();
    say(`  ✓ ${name.padEnd(10)} ${String(rows.length).padStart(4)} listings  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    return rows;
  } catch (e) {
    say(`  ✗ ${name.padEnd(10)} failed: ${e.message}`);
    return [];
  }
}

async function main() {
  say(`\n  Academic Job Radar — fetch run ${new Date().toISOString()}\n`);

  const collected = (await Promise.all([
    safely("euraxess", () => fetchEuraxess({ pages: 40, log })),
    safely("jobrxiv", () => fetchJobRxiv({ log })),
    safely("adzuna", () => fetchAdzuna({
      appId: process.env.ADZUNA_APP_ID,
      appKey: process.env.ADZUNA_APP_KEY,
      log,
    })),
  ])).flat();

  say(`\n  Collected ${collected.length} raw listings.`);

  if (!collected.length) {
    say("\n  Every source returned nothing. Keeping the existing data file untouched.\n");
    process.exit(existsSync(OUT) ? 0 : 1);
  }

  // Score, classify, drop the weak and the expired.
  const seen = new Set();
  const jobs = collected
    .filter((j) => j.id && j.title && j.url && !seen.has(j.id) && seen.add(j.id))
    .map((j) => {
      const { score, matched, band } = scoreJob(j);
      return { ...j, score, matched, band, track: classifyTrack(j) };
    })
    .filter((j) => j.score >= MIN_SCORE)
    .filter((j) => {
      const left = daysUntil(j.deadline);
      return left === null || left >= 0;
    })
    .sort((a, b) => b.score - a.score || (b.posted || "").localeCompare(a.posted || ""));

  const byTrack = jobs.reduce((acc, j) => ((acc[j.track] = (acc[j.track] || 0) + 1), acc), {});
  const byBand = jobs.reduce((acc, j) => ((acc[j.band] = (acc[j.band] || 0) + 1), acc), {});
  const bySource = jobs.reduce((acc, j) => ((acc[j.source] = (acc[j.source] || 0) + 1), acc), {});

  const payload = {
    generatedAt: new Date().toISOString(),
    counts: { total: jobs.length, raw: collected.length, byTrack, byBand, bySource },
    minScore: MIN_SCORE,
    jobs,
  };

  mkdirSync(dirname(OUT), { recursive: true });

  // Only rewrite if something actually changed, so the weekly commit is
  // meaningful rather than a timestamp bump. Compare the listing content,
  // not just the ids — otherwise an improvement to a parser would never
  // reach the published file.
  const digest = (rows) => createHash("sha1")
    .update(JSON.stringify([...rows].sort((a, b) => a.id.localeCompare(b.id))))
    .digest("hex");

  let changed = true;
  if (existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, "utf8"));
      changed = digest(prev.jobs || []) !== digest(jobs);
    } catch { /* unreadable previous file — just overwrite */ }
  }

  if (!changed) {
    say(`\n  No new or expired listings since the last run. Nothing to commit.\n`);
    return;
  }

  writeFileSync(OUT, JSON.stringify(payload, null, 2));

  say(`\n  Kept ${jobs.length} listings scoring ≥ ${MIN_SCORE}.`);
  say(`    by track:  ${Object.entries(byTrack).map(([k, v]) => `${k} ${v}`).join("  ")}`);
  say(`    by match:  ${Object.entries(byBand).map(([k, v]) => `${k} ${v}`).join("  ")}`);
  say(`    by source: ${Object.entries(bySource).map(([k, v]) => `${k} ${v}`).join("  ")}`);
  say(`\n  Wrote ${OUT}\n`);
}

main().catch((e) => {
  console.error("\n  Fetch run failed outright:", e);
  process.exit(1);
});
