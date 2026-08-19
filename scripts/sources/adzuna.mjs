/* Adzuna — optional, and the only source here that covers India and
   the Gulf with a real API rather than a launcher link.

   It needs a free API key (5,000 calls/month, no card required):
     1. Register at https://developer.adzuna.com/
     2. In your GitHub repo: Settings → Secrets and variables →
        Actions → New repository secret
     3. Add ADZUNA_APP_ID and ADZUNA_APP_KEY
   Without the secrets this source is skipped silently and everything
   else still works. */

const UA = "Mozilla/5.0 (compatible; AcademicJobRadar/1.0)";

/* Adzuna country codes.

   Adzuna runs one site per country and has NO Gulf presence —
   adzuna.ae, adzuna.sa and adzuna.qa do not resolve. So this source
   closes the India gap, not the Gulf one. The Gulf still has no
   machine-readable feed anywhere in this app and stays on the portal
   launcher (Bayt, GulfTalent, NaukriGulf, AcademicGates and the
   university career pages).

   India is the reason this source exists; the rest are included
   because academic posts there are worth seeing anyway. */
export const MARKETS = [
  { code: "in", label: "India" },
  { code: "gb", label: "United Kingdom" },
  { code: "de", label: "Germany" },
  { code: "nl", label: "Netherlands" },
  { code: "us", label: "United States" },
  { code: "ca", label: "Canada" },
  { code: "au", label: "Australia" },
  { code: "sg", label: "Singapore" },
];

export const QUERIES = [
  "assistant professor computer science",
  "assistant professor artificial intelligence",
  "postdoctoral researcher machine learning",
  "research fellow medical imaging",
];

export async function fetchAdzuna({ appId, appKey, log = () => {} } = {}) {
  if (!appId || !appKey) {
    log("  adzuna: no API key configured — skipped (this is fine)");
    return [];
  }

  const out = [];
  for (const market of MARKETS) {
    for (const q of QUERIES) {
      const url = `https://api.adzuna.com/v1/api/jobs/${market.code}/search/1`
        + `?app_id=${encodeURIComponent(appId)}&app_key=${encodeURIComponent(appKey)}`
        + `&results_per_page=50&what=${encodeURIComponent(q)}&content-type=application/json`;
      try {
        const ac = new AbortController();
        const to = setTimeout(() => ac.abort(), 25000);
        const r = await fetch(url, { signal: ac.signal, headers: { "User-Agent": UA } });
        clearTimeout(to);

        /* Distinguish "your key is wrong" from "this one query failed".
           A bad key fails identically on all 32 calls, so bail out and
           say so plainly rather than logging the same error 32 times
           and reporting zero listings as though the source were empty. */
        if (r.status === 401 || r.status === 403) {
          log(`  adzuna: HTTP ${r.status} — the API credentials were rejected.`);
          log(`  adzuna: check ADZUNA_APP_ID and ADZUNA_APP_KEY; no listings fetched.`);
          return [];
        }
        if (r.status === 429) {
          log(`  adzuna: rate limit reached — stopping with ${out.length} listings so far.`);
          return out;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);

        const json = await r.json();
        const rows = (json.results || []).map((j) => ({
          id: `adzuna:${j.id}`,
          source: "Adzuna",
          title: j.title ? String(j.title).replace(/<[^>]+>/g, "") : "",
          org: j.company?.display_name || "—",
          location: j.location?.display_name || market.label,
          country: market.label,
          field: j.category?.label || "",
          description: (j.description || "").replace(/<[^>]+>/g, "").slice(0, 900),
          posted: j.created ? j.created.slice(0, 10) : "",
          deadline: "",
          url: j.redirect_url || "",
          matchedQuery: q,
        })).filter((j) => j.title && j.url);

        out.push(...rows);
        log(`  adzuna ${market.code} "${q}": ${rows.length}`);
      } catch (e) {
        log(`  adzuna ${market.code} "${q}" failed: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  const seen = new Set();
  return out.filter((j) => !seen.has(j.id) && seen.add(j.id));
}
