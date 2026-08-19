/* Verifies every portal URL still resolves. Run: npm run check-portals
   Some sites bot-block (403/503) — that means "works in a browser, refuses
   a script", which is fine for a launcher. Only 404 / DNS failure is a
   real problem worth fixing. */

import { PORTALS, portalUrl } from "../assets/js/portals.js";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

const check = async (p) => {
  const url = portalUrl(p, "assistant professor computer science");
  try {
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), 20000);
    const r = await fetch(url, { signal: ac.signal, redirect: "follow", headers: { "User-Agent": UA } });
    clearTimeout(to);
    return { p, url, status: r.status, ok: r.status < 400, blocked: [403, 429, 503, 999].includes(r.status) };
  } catch (e) {
    return { p, url, status: e.name === "AbortError" ? "timeout" : "dns/err", ok: false, blocked: false, err: e.message };
  }
};

const results = [];
for (let i = 0; i < PORTALS.length; i += 6) {
  results.push(...(await Promise.all(PORTALS.slice(i, i + 6).map(check))));
}

const bad = results.filter((r) => !r.ok && !r.blocked);
const blocked = results.filter((r) => r.blocked);
const good = results.filter((r) => r.ok);

console.log(`\n  OK ................ ${good.length}`);
console.log(`  Bot-blocked ....... ${blocked.length}  (fine — these work in a real browser)`);
console.log(`  BROKEN ............ ${bad.length}\n`);

if (bad.length) {
  console.log("  ── Needs fixing ──");
  for (const r of bad) console.log(`  ${String(r.status).padEnd(9)} ${r.p.id.padEnd(18)} ${r.url}`);
}
if (blocked.length) {
  console.log("\n  ── Bot-blocked (no action needed) ──");
  for (const r of blocked) console.log(`  ${String(r.status).padEnd(9)} ${r.p.id.padEnd(18)} ${r.p.name}`);
}
console.log();
process.exit(bad.length ? 1 : 0);
