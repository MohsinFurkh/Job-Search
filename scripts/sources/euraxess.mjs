/* EURAXESS — the European Commission's research jobs portal.

   It has no public API and its keyword search is a POST form, so we
   read the paginated "latest offers" listing (which IS server-rendered
   and GET-addressable) and filter locally against the profile
   keywords. Reading ~40 pages gives roughly the last two weeks of
   postings, which is exactly the cadence this app runs at.

   The card markup is stable Europa ECL — the `id-Work-Locations`,
   `id-Research-Field` blocks are component class names, not styling,
   so they survive redesigns better than CSS selectors would. */

const BASE = "https://euraxess.ec.europa.eu";
const UA = "Mozilla/5.0 (compatible; AcademicJobRadar/1.0; +https://github.com/mohsinfurkh)";

const decode = (s = "") =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
   .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
   .replace(/\s+/g, " ").trim();

const strip = (html = "") => decode(html.replace(/<[^>]+>/g, " "));

/** Pull the text of a labelled meta block, e.g. "Work Locations". */
function metaBlock(card, idClass) {
  const re = new RegExp(`class="${idClass}[\\s\\S]*?<div class="ecl-text-standard[^"]*"[^>]*>([\\s\\S]*?)</div>\\s*</div>`, "i");
  const m = card.match(re);
  return m ? strip(m[1]) : "";
}

function parseCards(html) {
  const jobs = [];
  const chunks = html.split('<div id="job-teaser-content">').slice(1);

  for (const card of chunks) {
    const link = card.match(/href="\/jobs\/(\d+)"/);
    if (!link) continue;
    const id = link[1];

    const title = decode((card.match(/class="ecl-content-block__title"[\s\S]*?<span>([\s\S]*?)<\/span>/) || [, ""])[1]);
    if (!title) continue;

    // The two labels at the top of the card are the offer type and the country.
    const labels = [...card.matchAll(/class="ecl-label ecl-label--(?:low|highlight)"\s*>([^<]*)</g)].map((m) => decode(m[1]));
    const kind = labels[0] || "";
    const country = labels[1] || "";

    const org = decode((card.match(/class="ecl-content-block__primary-meta-item"><a[^>]*>([\s\S]*?)<\/a>/) || [, ""])[1]);
    const posted = decode((card.match(/Posted on:\s*([^<]+)</) || [, ""])[1]);
    const description = decode((card.match(/class="ecl-content-block__description"><p>([\s\S]*?)<\/p>/) || [, ""])[1]);

    const location = metaBlock(card, "id-Work-Locations") || country;
    const field = metaBlock(card, "id-Research-Field");
    const profile = metaBlock(card, "id-Researcher-Profile");
    const deadline = metaBlock(card, "id-Application-Deadline");

    // R1 is a PhD student, R2 is post-PhD. Anything R1-only is not for us.
    if (/First Stage Researcher \(R1\)/i.test(profile) && !/R2|R3|R4/i.test(profile)) continue;
    if (kind && !/JOB/i.test(kind)) continue;

    jobs.push({
      id: `euraxess:${id}`,
      source: "EURAXESS",
      title,
      org: org || "—",
      location: location || country,
      country,
      field,
      researcherProfile: profile,
      description,
      posted: normaliseDate(posted),
      deadline: normaliseDate(deadline),
      url: `${BASE}/jobs/${id}`,
    });
  }
  return jobs;
}

function normaliseDate(s) {
  if (!s) return "";
  const m = s.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!m) return "";
  const d = new Date(`${m[2]} ${m[1]}, ${m[3]}`);
  return isNaN(d) ? "" : d.toISOString().slice(0, 10);
}

export async function fetchEuraxess({ pages = 40, log = () => {} } = {}) {
  const out = [];
  let consecutiveFailures = 0;

  for (let p = 0; p < pages; p++) {
    try {
      const ac = new AbortController();
      const to = setTimeout(() => ac.abort(), 25000);
      const r = await fetch(`${BASE}/jobs/search?page=${p}`, {
        signal: ac.signal,
        headers: { "User-Agent": UA, Accept: "text/html" },
      });
      clearTimeout(to);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      const found = parseCards(await r.text());
      if (!found.length) { log(`  euraxess page ${p}: 0 cards — stopping`); break; }
      out.push(...found);
      consecutiveFailures = 0;
      if (p % 10 === 0) log(`  euraxess page ${p}: +${found.length} (total ${out.length})`);
    } catch (e) {
      consecutiveFailures++;
      log(`  euraxess page ${p} failed: ${e.message}`);
      if (consecutiveFailures >= 3) { log("  euraxess: 3 failures in a row, stopping"); break; }
    }
    await new Promise((r) => setTimeout(r, 250)); // be a polite citizen
  }

  const seen = new Set();
  return out.filter((j) => !seen.has(j.id) && seen.add(j.id));
}
