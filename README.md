# Academic Job Radar

A personal job-search application for **Dr. Mohsin Furkh Dar** — Assistant
Professor posts in India (government and private) and the Gulf, postdoctoral
positions and fellowships worldwide, filtered to deep learning for medical
image analysis.

It does four things:

1. **Finds** — a weekly GitHub Action pulls live listings from EURAXESS and
   jobRxiv, scores each one against your CV, and drops the noise.
2. **Launches** — 69 pre-filled searches across the portals that block
   automated fetching (Naukri, Bayt, GulfTalent, FacultyPlus, university
   career pages, fellowship schemes).
3. **Prepares** — four application checklists, one per kind of post, with
   lead times and a map of which certificates you already hold.
4. **Writes** — eight document generators pre-filled from your CV: cover
   letters, a cold email to a postdoc PI, research and teaching statements,
   referee requests, follow-ups.

---

## ⚠ Read this before you push

Your working folder contains documents that **must not go into a public
repository**:

| Folder / file | Why |
|---|---|
| `Education-Certificates/` | Date of birth, residence proof, marksheets — identity-theft material |
| `Signature .jpg` | A scanned signature can be lifted and reused on documents you never signed |
| `Photograph.jpeg` | Not needed on a public site |
| `CV_Mohsin/` | LaTeX sources and build artefacts |

`.gitignore` already excludes all of them. **Verify before your first push:**

```bash
git status --short
```

Nothing from those folders should appear. If you *want* your CV PDF public
(many academics do), that one file can be forced in:

```bash
git add -f CV_Mohsin/Mohsin_Furkh_Dar_CV.pdf
```

The tracker stores your application history in your browser's localStorage,
never in the repo, so your job search stays private even though the site is
public.

---

## Running it locally

Node 20 or newer.

```bash
npm run serve
```

Then open <http://localhost:5173>. ES modules and `fetch()` do not work over
`file://`, so opening `index.html` directly will not work — use the server.

To refresh the job feed on your own machine:

```bash
npm run fetch
```

To check whether any portal links have rotted:

```bash
npm run check-portals
```

---

## Publishing to GitHub Pages

```bash
git init
git add .
git commit -m "Academic Job Radar"
git branch -M main
git remote add origin https://github.com/mohsinfurkh/academic-job-radar.git
git push -u origin main
```

Then in the repository: **Settings → Pages → Source: Deploy from a branch →
`main` / `(root)` → Save.**

The site appears at `https://mohsinfurkh.github.io/academic-job-radar/` within
a minute or two. No build step, no framework, no dependencies.

### Letting the Action commit

**Settings → Actions → General → Workflow permissions → Read and write
permissions.** Without this the weekly refresh runs but cannot push its
results.

---

## The weekly refresh

`.github/workflows/update-jobs.yml` runs every **Monday at 03:00 UTC
(08:30 IST)**, and can also be triggered by hand from the Actions tab.

It fetches, scores, filters, and commits `data/jobs.json` — but only if the
listings actually changed, so the commit history stays meaningful.

### Sources

| Source | Status | Coverage |
|---|---|---|
| **jobRxiv** | Working, no key | ~620 listings/run. Biomedical and imaging postdocs worldwide. The best source here. |
| **EURAXESS** | Working, no key | ~210 listings/run. Europe's official research jobs portal. |
| **Adzuna** | Optional, needs a free key | India, UAE, UK, Germany, Netherlands. **The only automated India/Gulf coverage.** |

Everything else — Naukri, Bayt, GulfTalent, UGC, university career pages —
blocks scripted access. Those are handled as one-click launcher links on the
**Search portals** tab, not scraped. That is a deliberate choice: a launcher
that always works beats a scraper that silently breaks.

### Switching on India and Gulf coverage (recommended)

Adzuna gives 5,000 free API calls a month and needs no card.

1. Register at <https://developer.adzuna.com/>
2. Repository **Settings → Secrets and variables → Actions → New repository
   secret**
3. Add `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`

Without them the Adzuna step is skipped and everything else still runs.

---

## Tuning it

| What | Where |
|---|---|
| Your CV facts, used by scoring *and* every generated letter | `assets/js/profile.js` |
| Keyword weights — feed too noisy or too quiet | `PROFILE.keywords` in `assets/js/profile.js` |
| Score cutoff (currently 22) | `MIN_SCORE` in `scripts/fetch-jobs.mjs` |
| Portal links and search templates | `assets/js/portals.js` |
| Checklist items and lead times | `assets/js/checklists.js` |
| Letter and statement wording | `assets/js/letters.js` |

Scoring is additive and deliberately simple: keyword buckets contribute a
weight once each, breadth beats repetition, fresh postings get a small nudge,
and PhD-studentship vocabulary is scored *negatively* so it drops out. Each
listing carries the keywords it matched, so you can always see why it scored
what it did.

---

## Layout

```
index.html                    the whole interface
assets/css/app.css            light and dark themes
assets/js/
  profile.js                  your CV as data — the single source of truth
  score.js                    relevance scoring, shared with the fetcher
  portals.js                  69 launcher links
  checklists.js               four application checklists
  letters.js                  eight document generators
  store.js                    localStorage, export/import
  app.js                      UI
scripts/
  fetch-jobs.mjs              the weekly job
  sources/{euraxess,jobrxiv,adzuna}.mjs
  check-portals.mjs           link rot detector
  serve.mjs                   local static server
data/jobs.json                generated — committed by the Action
```

---

## A note on the two things worth doing first

Two items in the checklists are worth more than everything else here:

**The Gulf attestation chain.** Four to five separate authorities, six to ten
weeks end to end. Gulf applications are lost to this far more often than to a
weak CV. Start it before you have an offer.

**Fellowship timing.** Your PhD was awarded 28 July 2026, which puts you at
zero years post-PhD — inside the eligibility window for every early-career
scheme, including MSCA, Humboldt, EMBO and HFSP. That window closes on a
clock that is already running.
