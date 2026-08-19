/* jobRxiv — a preprint-style job board used heavily by biomedical,
   imaging and computational groups. It runs on WordPress, so any
   search has an RSS feed at ?s=<query>&feed=rss2. That makes it the
   most reliable free source in this app: no key, no bot blocking,
   and the query is ours to choose.

   We run several queries and merge, because one broad query returns
   noise and one narrow query returns nothing. */

const UA = "Mozilla/5.0 (compatible; AcademicJobRadar/1.0; +https://github.com/mohsinfurkh)";

export const QUERIES = [
  "medical image analysis",
  "medical imaging deep learning",
  "image segmentation",
  "ultrasound imaging",
  "computer vision postdoc",
  "deep learning postdoc",
  "explainable AI healthcare",
  "biomedical image computing",
  "radiology artificial intelligence",
];

const decode = (s = "") =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
   .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#8217;/g, "'")
   .replace(/&#8211;/g, "–").replace(/&nbsp;/g, " ")
   .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

const tag = (item, name) => {
  const m = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
};

/* jobRxiv's feed carries no structured organisation or location field —
   only free text. These two heuristics recover the institution and the
   country from the body often enough to be worth having, and return ""
   rather than guessing when they cannot. */

const ORG_RE = new RegExp(
  String.raw`\b((?:University|Universität|Universiteit|Université|Universidad)\s+(?:of\s+|College\s+)?[A-Z][\w'’-]*(?:\s+[A-Z][\w'’-]*){0,3}`
  + String.raw`|[A-Z][\w'’-]*(?:\s+[A-Z][\w'’-]*){0,3}\s+University`
  + String.raw`|(?:Max\s+Planck|Karolinska|ETH\s+Zurich|EPFL|MIT|Harvard|Stanford|Imperial\s+College|King's\s+College)[\w\s]{0,25}`
  + String.raw`|[A-Z][\w'’-]*(?:\s+[A-Z][\w'’-]*){0,3}\s+Institute(?:\s+of\s+[A-Z][\w'’-]*(?:\s+[A-Z][\w'’-]*){0,2})?)\b`
);

const COUNTRIES = ["United Kingdom", "United States", "Germany", "Netherlands", "Switzerland", "Sweden",
  "Denmark", "Norway", "Finland", "France", "Spain", "Italy", "Belgium", "Austria", "Ireland", "Portugal",
  "Poland", "Czech", "Canada", "Australia", "New Zealand", "Singapore", "Japan", "China", "Hong Kong",
  "South Korea", "Israel", "India", "Saudi Arabia", "United Arab Emirates", "Qatar", "Luxembourg", "USA", "UK"];

// Boilerplate that regularly precedes an institution name in these ads
// and would otherwise be captured as part of it.
const FILLER = /^(?:About|Benefits?|Statement|Overview|Join|The|At|Position|Summary|Role|Description|Company|Employer|Our|Background|Introduction|Context|Vacancy|Applications?)\s+/i;

function guessOrg(text) {
  const m = text.match(ORG_RE);
  if (!m) return "";

  let org = m[1].replace(/\s+/g, " ").trim();
  while (FILLER.test(org)) org = org.replace(FILLER, "");

  // Reject regex artefacts like "Biomedical Institute of Biomedical
  // Engineering", where a significant word repeats.
  const significant = org.toLowerCase().split(" ").filter((w) => w.length > 3 && w !== "college");
  if (new Set(significant).size !== significant.length) return "";

  // Must still name an actual kind of institution after cleaning.
  if (!/\b(University|Universit(?:ät|eit|é)|Institute|College|Hospital|Centre|Center|School|Laboratory|EPFL|MIT)\b/i.test(org)) return "";
  return org.length > 6 ? org.slice(0, 70) : "";
}

/* Country is only trusted when it appears in the title or the opening
   lines — a country named deep in the body is usually a collaborator,
   a funder or a conference, not the job's location. A wrong country is
   worse than none, because it drives the India/Gulf filters. */
function guessCountry(title, body) {
  const head = `${title} ${body.slice(0, 250)}`;
  const hit = COUNTRIES.find((c) => new RegExp(`\\b${c}\\b`, "i").test(head));
  if (!hit) return "";
  return hit === "UK" ? "United Kingdom" : hit === "USA" ? "United States" : hit;
}

function parseFeed(xml, query) {
  return xml.split(/<item[\s>]/).slice(1).map((item) => {
    const url = tag(item, "link");
    const title = tag(item, "title");
    if (!url || !title) return null;

    const pub = tag(item, "pubDate");
    const d = pub ? new Date(pub) : null;

    const body = tag(item, "content:encoded") || tag(item, "description");
    const searchable = `${title} ${body}`;
    const country = guessCountry(title, body);

    // Prefer the readable slug; fall back to the ?p= id for
    // listings that have not been given one.
    const slug = (url.match(/\/job\/([^/?#]+)/) || [])[1]
      || (url.match(/[?&]p=(\d+)/) || [])[1]
      || url.slice(-24);

    return {
      id: `jobrxiv:${slug}`,
      source: "jobRxiv",
      title,
      org: guessOrg(searchable) || "—",
      location: country,
      country,
      field: "",
      description: body.slice(0, 900),
      posted: d && !isNaN(d) ? d.toISOString().slice(0, 10) : "",
      deadline: "",
      url,
      matchedQuery: query,
    };
  }).filter(Boolean);
}

export async function fetchJobRxiv({ queries = QUERIES, log = () => {} } = {}) {
  const out = [];

  for (const q of queries) {
    try {
      const ac = new AbortController();
      const to = setTimeout(() => ac.abort(), 45000);
      const r = await fetch(`https://jobrxiv.org/?s=${encodeURIComponent(q)}&feed=rss2`, {
        signal: ac.signal,
        headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml" },
      });
      clearTimeout(to);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      const found = parseFeed(await r.text(), q);
      out.push(...found);
      log(`  jobrxiv "${q}": ${found.length}`);
    } catch (e) {
      log(`  jobrxiv "${q}" failed: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  const seen = new Set();
  return out.filter((j) => !seen.has(j.id) && seen.add(j.id));
}
