/* ──────────────────────────────────────────────────────────────
   portals.js — the launcher.

   Most Indian and Gulf job sites block automated fetching, so the
   app cannot scrape them. Instead it builds a pre-filled search
   URL for each one and opens it in a tab. `{q}` in a template is
   replaced with the URL-encoded query you pick in the UI.

   Run `npm run check-portals` to find links that have rotted.
   ────────────────────────────────────────────────────────────── */

export const QUERIES = {
  apCS: "assistant professor computer science",
  apAI: "assistant professor artificial intelligence",
  apML: "assistant professor machine learning",
  facultyCS: "faculty computer science",
  postdocMI: "postdoc medical imaging",
  postdocDL: "postdoctoral deep learning",
  postdocCV: "postdoctoral computer vision",
  researchFellow: "research fellow medical image analysis",
};

export const PORTALS = [
  /* ══════════ INDIA — GOVERNMENT / PUBLICLY FUNDED ══════════ */
  { id: "ugc", name: "UGC — University Grants Commission", group: "india-govt",
    url: "https://www.ugc.gov.in/", note: "Regulations, pay scales and the CARE journal list. Check before every govt application." },
  { id: "employment-news", name: "Employment News", group: "india-govt",
    url: "https://employmentnews.gov.in/", note: "Official weekly gazette of central government vacancies, including central universities." },
  { id: "facultyplus", name: "FacultyPlus", group: "india-govt",
    url: "https://facultyplus.com/?s={q}", note: "Dedicated Indian faculty-recruitment aggregator. The single highest-signal India source." },
  { id: "iisc", name: "IISc Bangalore — Faculty", group: "india-govt",
    url: "https://iisc.ac.in/careers/", note: "Rolling faculty recruitment; CS & Automation and Computational Data Sciences are your fit." },
  { id: "iitd", name: "IIT Delhi — Faculty", group: "india-govt",
    url: "https://www.iitd.ac.in/", note: "IITs recruit rolling. Search 'faculty recruitment' on each IIT site." },
  { id: "iiith", name: "IIIT Hyderabad — Faculty", group: "india-govt",
    url: "https://www.iiit.ac.in/careers/", note: "Strong medical-imaging and CVIT groups — a natural home for your work." },
  { id: "uoh", name: "University of Hyderabad", group: "india-govt",
    url: "https://uohyd.ac.in/", note: "Your alma mater. Watch SCIS advertisements." },
  { id: "jkpsc", name: "JKPSC — J&K Public Service Commission", group: "india-govt",
    url: "https://jkpsc.nic.in/",
    note: "Assistant Professor posts in J&K Government Degree Colleges. You have prior GDC Uri experience. (Opens fine in a browser; the link checker cannot reach .nic.in over TLS.)" },
  { id: "nit-recruit", name: "NIT / IIIT / Central University vacancies", group: "india-govt",
    url: "https://www.google.com/search?q=%22assistant+professor%22+computer+science+recruitment+2026+site%3Anitt.edu+OR+site%3Anitw.ac.in+OR+site%3Anitk.ac.in+OR+site%3Amnit.ac.in",
    note: "Composite search across major NIT domains — no single NIT portal exists." },

  /* ══════════ INDIA — PRIVATE UNIVERSITIES ══════════ */
  { id: "naukri", name: "Naukri", group: "india-private",
    url: "https://www.naukri.com/{q-slug}-jobs", slugify: true, note: "Largest Indian board. Private universities post here first." },
  { id: "linkedin-in", name: "LinkedIn Jobs — India", group: "india-private",
    url: "https://www.linkedin.com/jobs/search/?keywords={q}&location=India&f_TPR=r604800",
    note: "Filtered to the last 7 days — ideal for a weekly run." },
  { id: "indeed-in", name: "Indeed India", group: "india-private",
    url: "https://in.indeed.com/jobs?q={q}&fromage=7", note: "Last 7 days." },
  { id: "timesascent", name: "Times Ascent", group: "india-private",
    url: "https://www.timesascent.com/", note: "Print + online academic recruitment, heavy on private universities." },
  { id: "vit", name: "VIT Vellore", group: "india-private", url: "https://careers.vit.ac.in/" },
  { id: "srm", name: "SRM Institute of Science & Technology", group: "india-private", url: "https://www.srmist.edu.in/career/" },
  { id: "manipal", name: "Manipal Academy of Higher Education", group: "india-private", url: "https://www.manipal.edu/" },
  { id: "amity", name: "Amity University", group: "india-private", url: "https://www.amity.edu/" },
  { id: "bits", name: "BITS Pilani", group: "india-private", url: "https://www.bits-pilani.ac.in/careers/",
    note: "Strong CS department; values publication record over teaching load." },
  { id: "snu", name: "Shiv Nadar University", group: "india-private", url: "https://snu.edu.in/careers/",
    note: "Research-intensive, low teaching load. Good match for your Q1 record." },
  { id: "ashoka", name: "Ashoka University", group: "india-private", url: "https://www.ashoka.edu.in/careers/" },
  { id: "plaksha", name: "Plaksha University", group: "india-private", url: "https://plaksha.edu.in/",
    note: "New, research-first, well funded. Actively hiring in AI/health." },
  { id: "thapar", name: "Thapar Institute", group: "india-private", url: "https://www.thapar.edu/" },
  { id: "bennett", name: "Bennett University", group: "india-private", url: "https://www.bennett.edu.in/careers/" },
  { id: "christ", name: "Christ University", group: "india-private", url: "https://christuniversity.in/career" },
  { id: "graphicera", name: "Graphic Era, Dehradun", group: "india-private", url: "https://www.geu.ac.in/",
    note: "Local to you — no relocation cost if you move from UPES." },
  { id: "chandigarh", name: "Chandigarh University", group: "india-private", url: "https://www.cuchd.in/" },
  { id: "lpu", name: "Lovely Professional University", group: "india-private", url: "https://www.lpu.in/" },

  /* ══════════ GULF (GCC) ══════════ */
  { id: "bayt", name: "Bayt — Gulf", group: "gulf",
    url: "https://www.bayt.com/en/international/jobs/{q-slug}-jobs/", slugify: true,
    note: "The dominant GCC job board." },
  { id: "gulftalent", name: "GulfTalent", group: "gulf",
    url: "https://www.gulftalent.com/jobs/search?q={q}", note: "Professional/academic roles across the GCC." },
  { id: "naukrigulf", name: "NaukriGulf", group: "gulf",
    url: "https://www.naukrigulf.com/{q-slug}-jobs", slugify: true, note: "Gulf arm of Naukri — strong for Indian applicants." },
  { id: "academicgates", name: "AcademicGates", group: "gulf",
    url: "https://www.academicgates.com/", note: "Academic-only aggregator with genuinely good Gulf coverage." },
  { id: "kaust", name: "KAUST — Saudi Arabia", group: "gulf", url: "https://www.kaust.edu.sa/en/join/careers",
    note: "Best-funded research university in the region. Strong AI and bioengineering." },
  { id: "kfupm", name: "KFUPM — Saudi Arabia", group: "gulf", url: "https://www.kfupm.edu.sa/",
    note: "Actively recruits Indian CS faculty; tax-free package." },
  { id: "ksu", name: "King Saud University", group: "gulf", url: "https://ksu.edu.sa/en/" },
  { id: "qu", name: "Qatar University", group: "gulf", url: "https://www.qu.edu.qa/" },
  { id: "hbku", name: "Hamad Bin Khalifa University — Qatar", group: "gulf", url: "https://www.hbku.edu.qa/en/careers",
    note: "Qatar Computing Research Institute sits here — very strong applied AI." },
  { id: "ku-ae", name: "Khalifa University — UAE", group: "gulf", url: "https://www.ku.ac.ae/careers",
    note: "Highest-ranked UAE university; has a healthcare-engineering programme." },
  { id: "uaeu", name: "United Arab Emirates University", group: "gulf", url: "https://www.uaeu.ac.ae/en/" },
  { id: "aus", name: "American University of Sharjah", group: "gulf", url: "https://www.aus.edu/careers" },
  { id: "zu", name: "Zayed University — UAE", group: "gulf", url: "https://www.zu.ac.ae/main/en/careers/index.aspx" },
  { id: "nyuad", name: "NYU Abu Dhabi", group: "gulf", url: "https://nyuad.nyu.edu/en/about/careers.html",
    note: "US-standard tenure track, US-standard expectations." },
  { id: "squ", name: "Sultan Qaboos University — Oman", group: "gulf", url: "https://www.squ.edu.om/" },
  { id: "kuniv", name: "Kuwait University", group: "gulf", url: "https://www.ku.edu.kw/" },
  { id: "uob", name: "University of Bahrain", group: "gulf", url: "https://www.uob.edu.bh/" },
  { id: "bits-dubai", name: "BITS Pilani, Dubai Campus", group: "gulf", url: "https://www.bits-dubai.ac.ae/",
    note: "Indian-system university in the UAE — smoothest transition path." },
  { id: "manipal-dubai", name: "Manipal Academy, Dubai", group: "gulf", url: "https://www.manipaldubai.com/" },

  /* ══════════ POSTDOC — WORLDWIDE BOARDS ══════════ */
  { id: "jobrxiv", name: "jobRxiv", group: "postdoc",
    url: "https://jobrxiv.org/?s={q}", note: "Auto-fetched weekly by this app. Browse here for anything the filter missed." },
  { id: "euraxess", name: "EURAXESS — Europe", group: "postdoc",
    url: "https://euraxess.ec.europa.eu/jobs/search", note: "Auto-fetched weekly. Europe's official research-jobs portal." },
  { id: "naturecareers", name: "Nature Careers", group: "postdoc",
    url: "https://www.nature.com/naturecareers/jobs?q={q}" },
  { id: "sciencecareers", name: "Science Careers", group: "postdoc",
    url: "https://jobs.sciencecareers.org/jobs/?keywords={q}" },
  { id: "jobsacuk", name: "jobs.ac.uk", group: "postdoc",
    url: "https://www.jobs.ac.uk/search/?keywords={q}", note: "The UK academic board. UK postdocs rarely require IELTS for Indian PhDs." },
  { id: "academicpositions", name: "AcademicPositions", group: "postdoc",
    url: "https://academicpositions.com/find-jobs?q={q}", note: "Europe-heavy, well curated." },
  { id: "findapostdoc", name: "FindAPostDoc", group: "postdoc",
    url: "https://www.findapostdoc.com/search/?Keywords={q}" },
  { id: "ajo", name: "AcademicJobsOnline", group: "postdoc",
    url: "https://academicjobsonline.org/ajo", note: "Where many US/Canada maths & CS groups post." },
  { id: "higheredjobs", name: "HigherEdJobs — US", group: "postdoc",
    url: "https://www.higheredjobs.com/search/advanced_action.cfm?Keyword={q}" },
  { id: "the-unijobs", name: "Times Higher Education Unijobs", group: "postdoc",
    url: "https://www.timeshighereducation.com/unijobs/listings/?keywords={q}" },

  /* ══════════ POSTDOC — NAMED FELLOWSHIP SCHEMES ══════════
     These are the ones you apply FOR, then bring the money to a host.
     For someone with 4 Q1 first-author papers and a JRF rank of 53,
     these are realistic — and far better paid than an advertised post. */
  { id: "msca", name: "MSCA Postdoctoral Fellowships (EU)", group: "fellowship",
    url: "https://marie-sklodowska-curie-actions.ec.europa.eu/actions/postdoctoral-fellowships",
    note: "~€200k, 2 years, any EU host. Annual deadline is usually September. The single best target for you." },
  { id: "embo", name: "EMBO Postdoctoral Fellowships", group: "fellowship",
    url: "https://www.embo.org/funding/fellowships-grants-and-career-support/postdoctoral-fellowships/",
    note: "Life sciences — your imaging work qualifies if framed biomedically. Two rounds a year." },
  { id: "hfsp", name: "HFSP Postdoctoral Fellowships", group: "fellowship",
    url: "https://www.hfsp.org/funding/hfsp-funding/postdoctoral-fellowships",
    note: "Rewards changing field or country. Interdisciplinary by design." },
  { id: "humboldt", name: "Humboldt Research Fellowship (Germany)", group: "fellowship",
    url: "https://www.humboldt-foundation.de/en/apply/sponsorship-programmes/humboldt-research-fellowship",
    note: "Rolling deadlines, no quota by country. Very achievable with your record." },
  { id: "jsps", name: "JSPS Fellowship (Japan)", group: "fellowship",
    url: "https://www.jsps.go.jp/english/e-fellow/", note: "Generous; Indian applicants can apply via the standard route." },
  { id: "newton", name: "Newton International Fellowship (UK)", group: "fellowship",
    url: "https://royalsociety.org/grants/newton-international/", note: "Royal Society; 2 years in the UK." },
  { id: "banting", name: "Banting Postdoctoral Fellowships (Canada)", group: "fellowship",
    url: "https://banting.fellowships-bourses.gc.ca/",
    note: "CAD 70k/yr, highly competitive. (Opens fine in a browser; the link checker cannot reach .gc.ca over TLS.)" },

  /* ══════════ INDIA — FELLOWSHIPS & FACULTY SCHEMES ══════════
     Often overlooked and unusually well matched to your position:
     you already hold a PhD, a JRF rank and an independent grant bid. */
  { id: "anrf", name: "ANRF (formerly SERB) — N-PDF & Ramanujan", group: "fellowship-india",
    url: "https://anrfonline.in/",
    note: "National Post Doctoral Fellowship and the Ramanujan Fellowship. Ramanujan is aimed exactly at researchers like you." },
  { id: "inspire", name: "DST INSPIRE Faculty Fellowship", group: "fellowship-india",
    url: "https://online-inspire.gov.in/",
    note: "5 years of independent funding + a faculty position. Age and post-PhD limits apply — check them early, your PhD is dated 28 Jul 2026. (Opens fine in a browser; the link checker cannot reach .gov.in over TLS.)" },
  { id: "kothari", name: "UGC Dr. D. S. Kothari Postdoctoral Fellowship", group: "fellowship-india",
    url: "https://www.ugc.gov.in/", note: "For science PhDs; check current cycle status before investing time." },
  { id: "indiaalliance", name: "DBT/Wellcome India Alliance", group: "fellowship-india",
    url: "https://indiaalliance.org/fellowships", note: "Early Career Fellowship. Biomedical framing required — your Doppler/ICMR work fits." },
  { id: "icmr", name: "ICMR — Research & Fellowships", group: "fellowship-india",
    url: "https://www.icmr.gov.in/", note: "You already have an ANVESHAN bid in review here." },
  { id: "csir", name: "CSIR HRDG — Research Associateship", group: "fellowship-india",
    url: "https://csirhrdg.res.in/", note: "RA-I/II/III; straightforward route if you stay in India." },
];

export const GROUPS = {
  "india-govt":       { label: "India — Government & publicly funded", icon: "🏛️" },
  "india-private":    { label: "India — Private universities",         icon: "🎓" },
  "gulf":             { label: "Gulf (GCC)",                            icon: "🕌" },
  "postdoc":          { label: "Postdoc — worldwide boards",            icon: "🌍" },
  "fellowship":       { label: "Fellowships — international",           icon: "🏅" },
  "fellowship-india": { label: "Fellowships — India",                   icon: "🇮🇳" },
};

/** Build a portal's URL for a given query string. */
export function portalUrl(portal, query) {
  if (!portal.url.includes("{q")) return portal.url;
  const slug = query.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return portal.url
    .replace("{q-slug}", slug)
    .replace("{q}", encodeURIComponent(query));
}
