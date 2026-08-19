/* jobs.ac.uk — the main UK academic job board, and one of the largest
   sources of postdoc and lectureship posts in Europe.

   No API and no usable RSS, but the search results page is
   server-rendered and GET-addressable, so a keyword search works
   exactly as it does in a browser. Each result carries employer,
   department, location, salary and a "Date Placed" — everything we
   need, without visiting the individual advert.

   Worth noting for a UK move: most UK postdoc routes do not require
   IELTS for a PhD taught in English, and the Global Talent visa does
   not require a job offer first. */

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

export const QUERIES = [
  "medical imaging",
  "medical image analysis",
  "deep learning",
  "computer vision",
  "machine learning healthcare",
  "artificial intelligence imaging",
  "image analysis",
];

const decode = (s = "") =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&pound;/g, "£")
   .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
   .replace(/\s+/g, " ").trim();

const field = (card, cls) =>
  decode((card.match(new RegExp(`class="j-search-result__${cls}"[^>]*>([\\s\\S]*?)</div>`)) || [, ""])[1]
    .replace(/<[^>]+>/g, " "));

/* "Date Placed: 23 Jul" carries no year. Anything that would land in
   the future must belong to last year. */
function resolveDate(text) {
  const m = text.match(/Date Placed:\s*<\/strong>\s*(\d{1,2})\s+([A-Za-z]{3,})/i);
  if (!m) return "";
  const now = new Date();
  let d = new Date(`${m[2]} ${m[1]}, ${now.getFullYear()}`);
  if (isNaN(d)) return "";
  if (d.getTime() > now.getTime() + 86400000) d = new Date(`${m[2]} ${m[1]}, ${now.getFullYear() - 1}`);
  return isNaN(d) ? "" : d.toISOString().slice(0, 10);
}

function parseResults(html) {
  const out = [];
  for (const card of html.split('class="j-search-result__result').slice(1)) {
    const a = card.match(/<a href="(\/job\/([A-Z0-9]+)\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!a) continue;

    const title = decode(a[3].replace(/<[^>]+>/g, " "));
    if (!title) continue;

    const employer = decode((card.match(/class="j-search-result__employer"[^>]*>([\s\S]*?)<\/div>/) || [, ""])[1]
      .replace(/<[^>]+>/g, " "));
    const location = decode((card.match(/<div>\s*Location:\s*([\s\S]*?)<\/div>/) || [, ""])[1]
      .replace(/<[^>]+>/g, " "));
    const salary = decode((card.match(/<strong>Salary:\s*<\/strong>([\s\S]*?)<\/div>/) || [, ""])[1]
      .replace(/<[^>]+>/g, " "));
    const department = field(card, "department");

    out.push({
      id: `jobsacuk:${a[2]}`,
      source: "jobs.ac.uk",
      title,
      org: employer || "—",
      location: location ? `${location}, United Kingdom` : "United Kingdom",
      country: "United Kingdom",
      field: department,
      description: [department, salary && `Salary: ${salary}`].filter(Boolean).join(" · "),
      posted: resolveDate(card),
      deadline: "",
      url: `https://www.jobs.ac.uk${a[1]}`,
    });
  }
  return out;
}

export async function fetchJobsAcUk({ queries = QUERIES, log = () => {} } = {}) {
  const out = [];

  for (const q of queries) {
    try {
      const ac = new AbortController();
      const to = setTimeout(() => ac.abort(), 30000);
      const r = await fetch(
        `https://www.jobs.ac.uk/search/?keywords=${encodeURIComponent(q)}&sort=re`,
        { signal: ac.signal, headers: { "User-Agent": UA, Accept: "text/html" } },
      );
      clearTimeout(to);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      const found = parseResults(await r.text());
      out.push(...found);
      log(`  jobs.ac.uk "${q}": ${found.length}`);
    } catch (e) {
      log(`  jobs.ac.uk "${q}" failed: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  const seen = new Set();
  return out.filter((j) => !seen.has(j.id) && seen.add(j.id));
}
