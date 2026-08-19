/* Checks your Adzuna credentials and reports which markets respond.
   Run it yourself so the key never leaves your machine:

     Windows PowerShell
       $env:ADZUNA_APP_ID="..."; $env:ADZUNA_APP_KEY="..."; npm run test-adzuna

     Git Bash / macOS / Linux
       ADZUNA_APP_ID=... ADZUNA_APP_KEY=... npm run test-adzuna

   It makes one call per market (8 total), so it costs almost nothing
   against your monthly quota. */

import { MARKETS } from "./sources/adzuna.mjs";

const appId = process.env.ADZUNA_APP_ID;
const appKey = process.env.ADZUNA_APP_KEY;

if (!appId || !appKey) {
  console.error(`
  ADZUNA_APP_ID and ADZUNA_APP_KEY are not set in this shell.

  PowerShell:
    $env:ADZUNA_APP_ID="your-id"; $env:ADZUNA_APP_KEY="your-key"; npm run test-adzuna

  Git Bash:
    ADZUNA_APP_ID=your-id ADZUNA_APP_KEY=your-key npm run test-adzuna
`);
  process.exit(1);
}

// Never print the credentials themselves, only enough to tell them apart.
const mask = (s) => `${s.slice(0, 4)}…${s.slice(-2)} (${s.length} chars)`;
console.log(`\n  app_id  ${mask(appId)}`);
console.log(`  app_key ${mask(appKey)}\n`);

let ok = 0, failed = 0;

for (const m of MARKETS) {
  const url = `https://api.adzuna.com/v1/api/jobs/${m.code}/search/1`
    + `?app_id=${encodeURIComponent(appId)}&app_key=${encodeURIComponent(appKey)}`
    + `&results_per_page=10&what=${encodeURIComponent("assistant professor computer science")}`
    + `&content-type=application/json`;

  try {
    const r = await fetch(url, { headers: { "User-Agent": "AcademicJobRadar/1.0" } });
    const body = await r.text();

    if (r.status === 401 || r.status === 403) {
      console.log(`  ✗ ${m.code}  ${String(r.status).padEnd(4)} credentials rejected — ${m.label}`);
      failed++;
      continue;
    }
    if (!r.ok) {
      console.log(`  ✗ ${m.code}  ${String(r.status).padEnd(4)} ${m.label}`);
      failed++;
      continue;
    }

    const json = JSON.parse(body);
    const n = json.results?.length ?? 0;
    const total = json.count ?? "?";
    const sample = json.results?.[0]?.title?.replace(/<[^>]+>/g, "").slice(0, 44) || "—";
    console.log(`  ✓ ${m.code}  ${String(n).padStart(2)} returned of ${String(total).padEnd(7)} ${m.label.padEnd(16)} e.g. ${sample}`);
    ok++;
  } catch (e) {
    console.log(`  ✗ ${m.code}  ${e.message.slice(0, 40)} — ${m.label}`);
    failed++;
  }
  await new Promise((r) => setTimeout(r, 300));
}

console.log(`\n  ${ok} market${ok === 1 ? "" : "s"} working, ${failed} failed.`);
if (ok === 0) {
  console.log(`
  Every market failed. That almost always means the key pair is wrong or
  not yet active — new Adzuna keys can take a few minutes. Check them at
  https://developer.adzuna.com/admin/access_details\n`);
  process.exit(1);
}
console.log(`
  Credentials work. Add them to GitHub so the weekly run uses them:
    Settings -> Secrets and variables -> Actions -> New repository secret
    ADZUNA_APP_ID    and    ADZUNA_APP_KEY
`);
