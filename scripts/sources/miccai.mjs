/* MICCAI job board — https://miccai.org/job-board/

   Small (about 20 live posts) but the highest signal-to-noise source
   in this app by a distance: it is the job board of the Medical Image
   Computing and Computer Assisted Intervention society, so essentially
   every posting is in Mohsin's exact field.

   It runs on WordPress with a custom `job` post type, which gives us
   two complementary views:
     • wp-json/wp/v2/job  — structured dates, titles, links, full body
     • /job-board/ HTML   — employer and location, which the API omits
   We fetch both and join them on the permalink. */

const UA = "Mozilla/5.0 (compatible; AcademicJobRadar/1.0; +https://github.com/MohsinFurkh)";

const decode = (s = "") =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#8217;/g, "'")
   .replace(/&#8211;/g, "–").replace(/&nbsp;/g, " ")
   .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
   .replace(/\s+/g, " ").trim();

const strip = (h = "") => decode(h.replace(/<[^>]+>/g, " "));

/** Employer + location keyed by permalink, scraped from the board page. */
async function boardIndex(log) {
  const index = new Map();
  try {
    const r = await fetch("https://miccai.org/job-board/", { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();

    for (const card of html.split('<div class="post-item">').slice(1)) {
      const link = (card.match(/<h4>\s*<a href="([^"]+)"/) || [])[1];
      if (!link) continue;
      index.set(link.replace(/\/$/, ""), {
        location: strip((card.match(/class="job-location"[^>]*>([\s\S]*?)<\/span>/) || [, ""])[1]),
        org: strip((card.match(/<\/h4>\s*<p>([\s\S]*?)<\/p>/) || [, ""])[1]),
        posted: strip((card.match(/class="post-date"[^>]*>([\s\S]*?)<\/span>/) || [, ""])[1]),
      });
    }
    log(`  miccai board page: ${index.size} cards indexed`);
  } catch (e) {
    log(`  miccai board page failed (continuing with API only): ${e.message}`);
  }
  return index;
}

export async function fetchMiccai({ log = () => {} } = {}) {
  const index = await boardIndex(log);

  const r = await fetch("https://miccai.org/wp-json/wp/v2/job?per_page=100&orderby=date&order=desc", {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const rows = await r.json();
  if (!Array.isArray(rows)) throw new Error("unexpected API shape");

  const jobs = rows.map((j) => {
    const link = String(j.link || "").replace(/\/$/, "");
    const extra = index.get(link) || {};
    const body = strip(j.content?.rendered || "");

    return {
      id: `miccai:${j.id}`,
      source: "MICCAI",
      title: decode(j.title?.rendered || ""),
      org: extra.org || "—",
      location: extra.location || "",
      country: extra.location || "",
      field: "Medical image computing",
      description: body.slice(0, 900),
      posted: j.date ? String(j.date).slice(0, 10) : "",
      deadline: "",
      url: j.link || "",
    };
  }).filter((j) => j.title && j.url);

  log(`  miccai: ${jobs.length} listings`);
  return jobs;
}
