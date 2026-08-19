/* ──────────────────────────────────────────────────────────────
   checklists.js — what you actually have to do to apply.

   Four tracks, because the four kinds of application are genuinely
   different animals. The Gulf one in particular encodes the document
   attestation chain, which is the thing that silently kills Gulf
   applications: people find the job, then discover the paperwork
   takes eight weeks and the deadline was in three.

   `leadDays` = start this many days before the deadline.
   `have`     = a file already sitting in your Education-Certificates
                folder, so the app can tell you what you don't need
                to chase.
   `critical` = if this is missing, the application is void.
   ────────────────────────────────────────────────────────────── */

/* Applies to every application. Do it once, reuse forever. */
export const UNIVERSAL = {
  id: "universal",
  title: "One-time prep (do this once, reuse for every application)",
  blurb: "Roughly a weekend of work. After this, most applications become a 30-minute job instead of a two-day job.",
  sections: [
    {
      name: "Master documents",
      items: [
        { id: "u-cv", label: "Master CV compiled and current", detail: "Your LaTeX CV in CV_Mohsin/ builds to cv-llt.pdf. Rebuild it after every acceptance.", have: "CV_Mohsin/Mohsin_Furkh_Dar_CV.pdf", critical: true },
        { id: "u-cv-short", label: "2-page short CV", detail: "Many Indian and Gulf forms cap the CV at 2 pages. Cut teaching detail, keep publications and grants.", leadDays: 2 },
        { id: "u-research", label: "Master research statement (3 pages)", detail: "Past work → current programme → 5-year plan. Use the generator on the Apply tab as a starting draft.", critical: true },
        { id: "u-teaching", label: "Master teaching statement (1–2 pages)", detail: "Your project-based, maths-plus-implementation approach. Reused almost verbatim everywhere." },
        { id: "u-pubs", label: "Publication list with DOI, indexing and impact factor", detail: "Indian institutions want SCIE/Scopus/UGC-CARE status and IF stated per paper. Build it once as a table." },
        { id: "u-pdfs", label: "PDF reprints of all 9 publications in one folder", detail: "Named Year_Journal_ShortTitle.pdf. Govt applications often want reprints attached." },
      ],
    },
    {
      name: "Identity and scholarly profiles",
      items: [
        { id: "u-orcid", label: "ORCID up to date", detail: "0000-0003-1756-9087 — push new papers here first; other systems harvest from it." },
        { id: "u-scopus", label: "Scopus profile merged and clean", detail: "Author ID 58484416800. Check for duplicate author records after each publication." },
        { id: "u-wos", label: "Web of Science ResearcherID current", detail: "KIB-9833-2024." },
        { id: "u-vidwan", label: "Vidwan profile current", detail: "ID 638631. Indian govt institutions increasingly check this." },
        { id: "u-scholar", label: "Google Scholar profile tidy", detail: "Remove mis-attributed papers; the h-index on your CV must match what they see." },
      ],
    },
    {
      name: "Referees",
      items: [
        { id: "u-ref1", label: "Dr. Avatharam Ganivada — asked and willing", detail: "Doctoral advisor, avatharg@uohyd.ac.in. Your default first referee.", critical: true },
        { id: "u-ref2", label: "Second referee confirmed", detail: "Prof. Tanupriya Choudhury (UPES, ICMR Co-I) is the natural choice — he can speak to your independent work." },
        { id: "u-ref3", label: "Third referee confirmed", detail: "For postdocs abroad, an international referee helps a lot. Consider an editor or a co-author outside India.", leadDays: 21 },
        { id: "u-ref-brief", label: "One-page brief prepared for referees", detail: "Give each referee your CV, the job ad, and 3 bullet points you want emphasised. Dramatically improves letter quality." },
      ],
    },
    {
      name: "Scanned document set",
      items: [
        { id: "u-scan", label: "All certificates scanned as clear PDFs under 2 MB each", detail: "Most portals reject files over 2 MB. Keep a compressed copy of everything.", have: "Education-Certificates/" },
        { id: "u-photo", label: "Passport photo (recent, white background)", have: "Photograph.jpeg" },
        { id: "u-sign", label: "Signature scan on white paper", have: "Signature .jpg" },
        { id: "u-passport", label: "Passport valid for 2+ years", detail: "Required before any Gulf or postdoc application. Renewal takes 3–6 weeks.", leadDays: 45, critical: true },
      ],
    },
  ],
};

export const CHECKLISTS = {
  /* ══════════════════════════════════════════════════════════ */
  "india-govt": {
    id: "india-govt",
    title: "India — Government / publicly funded institution",
    blurb: "Central and state universities, NITs, IIITs, government degree colleges. Process-heavy and unforgiving on paperwork: a missing self-attestation voids the application, however good your record is.",
    eligibilityNote: "You hold a PhD (awarded 28 July 2026) and UGC-NET with JRF (AIR 53). That satisfies the standard Assistant Professor eligibility on both counts. Always re-read the specific advertisement — UGC regulations have been revised recently and institutions differ in what they count.",
    sections: [
      {
        name: "Before you start",
        items: [
          { id: "g-elig", label: "Read the advertisement end to end and confirm eligibility", detail: "Check the essential vs desirable split, age limit, and whether they want the PhD to predate the advertisement.", critical: true },
          { id: "g-score", label: "Compute your academic/API score on their proforma", detail: "Most institutions publish a scoring table. Your 4 Q1 SCIE first-author papers, JRF and PI-ship score well — compute it so you can argue it.", leadDays: 3 },
          { id: "g-noc", label: "Request NOC from UPES", detail: "A No Objection Certificate from your current employer. Government institutions require it, and HR departments are slow. This is the single most common cause of a missed government deadline.", leadDays: 21, critical: true },
          { id: "g-fee", label: "Check application fee and payment mode", detail: "Some still require a Demand Draft in favour of the Registrar. Keep the DD number and a photocopy." },
        ],
      },
      {
        name: "Documents to attach",
        items: [
          { id: "g-form", label: "Application form filled in their exact proforma", detail: "Never substitute your own format. Use their Word/PDF file.", critical: true },
          { id: "g-10", label: "Class 10 certificate (date-of-birth proof)", have: "Education-Certificates/10th DOB.pdf", critical: true },
          { id: "g-10m", label: "Class 10 marksheet", have: "Education-Certificates/10th Marks Sheet.pdf" },
          { id: "g-12", label: "Class 12 certificate and marksheet", have: "Education-Certificates/12th Degree Certificate.pdf" },
          { id: "g-bsc", label: "B.Sc. degree and marksheets", have: "Education-Certificates/BSc Degree Certificate.pdf" },
          { id: "g-mca", label: "MCA degree and marksheets", have: "Education-Certificates/MCA Degree Certificate.pdf", critical: true },
          { id: "g-mphil", label: "M.Phil. degree and marksheet", have: "Education-Certificates/MPhill Degree.pdf" },
          { id: "g-phd", label: "PhD degree certificate or result notification", have: "Education-Certificates/PhD Result Notification.pdf", detail: "Awarded 28 July 2026. If the formal degree certificate has not been issued yet, the notification plus a letter from the university is normally accepted — but confirm with them.", critical: true },
          { id: "g-net", label: "UGC-NET JRF award letter and scorecard", have: "Education-Certificates/JRF Award Letter.pdf", detail: "AIR 53 — state the rank explicitly, it is a strong differentiator.", critical: true },
          { id: "g-exp", label: "Experience certificates from every past employer", have: "Education-Certificates/7. Experience Certificate.pdf", detail: "Include GDC Uri (2019), UoH teaching assistantship, and UPES." },
          { id: "g-upes", label: "UPES appointment letter", have: "Education-Certificates/LOA UPES.pdf" },
          { id: "g-char", label: "Character certificate", have: "Education-Certificates/Character Certificate Kashmir University.pdf" },
          { id: "g-dom", label: "Domicile / residence certificate", have: "Education-Certificates/Residence Proof.pdf", detail: "Essential for J&K state posts; optional elsewhere." },
          { id: "g-cat", label: "Category certificate, if you are claiming one", detail: "Must be in the central government format if applying to a central institution." },
          { id: "g-pubs", label: "Reprints of publications, with the list on top", detail: "Number them to match your API score sheet so the screening committee can verify quickly." },
          { id: "g-photo", label: "Passport photographs and signature", have: "Photograph.jpeg" },
        ],
      },
      {
        name: "Submission",
        items: [
          { id: "g-attest", label: "Self-attest every photocopy", detail: "Sign and write 'Attested as true copy' on each page. Applications are rejected for this alone.", critical: true },
          { id: "g-online", label: "Online form submitted, PDF of the confirmation saved" },
          { id: "g-hard", label: "Hard copy dispatched by speed post", detail: "Many institutions require the printed application to reach the Registrar by the deadline — not be posted by it. Allow a week.", leadDays: 10, critical: true },
          { id: "g-track", label: "Speed post tracking number recorded", detail: "Paste it into the tracker. It is your only proof if the application goes missing." },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════ */
  "india-private": {
    id: "india-private",
    title: "India — Private university",
    blurb: "VIT, SRM, Amity, Manipal, BITS, Shiv Nadar, Plaksha and similar. Much faster and less formal than government hiring: usually CV → shortlist → demo lecture and research talk → offer, often inside a month.",
    eligibilityNote: "Research-intensive private universities weight publications heavily. Your 4 Q1 SCIE papers, h-index 4 and an INR 25 lakh ICMR bid as PI put you above the typical fresh-PhD applicant — lead with that.",
    sections: [
      {
        name: "Application pack",
        items: [
          { id: "p-cv", label: "CV tailored to the advertised area", detail: "Reorder so the matching research area is on page 1.", critical: true },
          { id: "p-cover", label: "Cover letter naming the department and why them", detail: "Use the generator on the Apply tab. Two paragraphs on fit beats two pages of biography." },
          { id: "p-research", label: "Research statement", detail: "Emphasise the independent programme you built at UPES — that is what distinguishes you from your own PhD output." },
          { id: "p-teaching", label: "Teaching statement plus the courses you can teach", detail: "You can credibly claim: Programming (C/Python), DSA, DBMS, ML, DL, Computer Vision, Medical Image Analysis, Soft Computing, XAI." },
          { id: "p-pubs", label: "Publication list with indexing, IF and citation counts", detail: "Private universities often score candidates on exactly this table. Make it easy to read.", critical: true },
          { id: "p-grants", label: "Grant history stated explicitly", detail: "PI on an ICMR ANVESHAN bid of INR 25,00,000 (under review) plus a competitive IoE travel grant. Most applicants at your stage have neither." },
        ],
      },
      {
        name: "Interview stage",
        items: [
          { id: "p-demo", label: "Demo lecture prepared (45–50 min, UG level)", detail: "Pick something you have taught: DSA or DBMS. They are testing clarity, not depth.", leadDays: 7, critical: true },
          { id: "p-talk", label: "Research seminar prepared (20 min + questions)", detail: "EfficientU-Net → UMA-Net → fuzzy rough set loss → MSCT-Trans is a clean narrative arc with a visible through-line." },
          { id: "p-plan", label: "5-year research and funding plan", detail: "Name the schemes you would apply to: ANRF, ICMR, DST. Search committees like a candidate who brings money." },
          { id: "p-questions", label: "Your questions for them", detail: "Teaching load per semester, PhD student allocation, seed grant, GPU access, consultancy policy. Ask about GPUs — your work needs them." },
        ],
      },
      {
        name: "Offer stage",
        items: [
          { id: "p-ctc", label: "Current and expected CTC decided in advance", detail: "They will ask on the form. Know your number before you are put on the spot." },
          { id: "p-notice", label: "Notice period at UPES confirmed", detail: "Check your appointment letter — private universities often have a 1–3 month clause." },
          { id: "p-negotiate", label: "Negotiate seed grant and startup, not just salary", detail: "Ask for GPU hardware, a PhD student position and a seed grant. These are often easier to get than salary and matter more for your output." },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════ */
  gulf: {
    id: "gulf",
    title: "Gulf (GCC) — UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain",
    blurb: "Excellent packages — tax-free salary, housing, annual flights, children's schooling. The catch is document attestation: a chain of four to five separate authorities that takes six to ten weeks. Start it before you have an offer, not after.",
    eligibilityNote: "Gulf universities recruit Indian CS faculty actively and your Q1 record is competitive. The binding constraint is paperwork lead time, not your CV.",
    sections: [
      {
        name: "⚠ Attestation chain — start 10 weeks before you need it",
        items: [
          { id: "gu-a1", label: "Step 1 — University/board verification of each degree", detail: "The awarding university confirms the certificate is genuine. University of Kashmir, Mewar and University of Hyderabad each have their own process.", leadDays: 21, critical: true },
          { id: "gu-a2", label: "Step 2 — State HRD / Home Department attestation", detail: "Done in the state that issued the certificate. J&K for your school and BSc/MCA; Telangana for the PhD.", leadDays: 14, critical: true },
          { id: "gu-a3", label: "Step 3 — MEA (Ministry of External Affairs) attestation", detail: "Central government stamp. Done through an MEA-authorised agent; MEA does not accept walk-ins. Apostille if the country is in the Hague Convention, normal attestation otherwise.", leadDays: 10, critical: true },
          { id: "gu-a4", label: "Step 4 — Destination country embassy attestation in India", detail: "UAE, Saudi, Qatar, Kuwait, Oman or Bahrain embassy/consulate. Fees vary widely by country.", leadDays: 10, critical: true },
          { id: "gu-a5", label: "Step 5 — MOFA attestation in the destination country", detail: "Done after you arrive, usually handled by the employer's HR/PRO. Budget for it but do not try to do it from India." },
          { id: "gu-equiv", label: "Degree equivalency certificate, if required", detail: "Saudi Arabia requires Ministry of Education equivalency; the UAE requires MOHESR attestation for the PhD. Ask HR which applies before you pay for anything.", leadDays: 30 },
        ],
      },
      {
        name: "Personal documents",
        items: [
          { id: "gu-pp", label: "Passport valid 2+ years with 4+ blank pages", leadDays: 45, critical: true },
          { id: "gu-pcc", label: "Police Clearance Certificate from the passport office", detail: "Apply on Passport Seva. Takes 2–4 weeks, longer if your address has changed recently.", leadDays: 30, critical: true },
          { id: "gu-med", label: "Medical fitness certificate", detail: "Some employers require a GAMCA/Wafid-approved centre. Confirm with HR — do not pay for the wrong one." },
          { id: "gu-photo", label: "Passport photographs to the destination country's spec", detail: "Saudi and UAE have specific background and size rules that differ from Indian passport photos." },
        ],
      },
      {
        name: "Academic pack",
        items: [
          { id: "gu-cv", label: "CV in international format", detail: "No photograph, no date of birth, no marital status. Gulf universities largely follow US/UK conventions now.", critical: true },
          { id: "gu-cover", label: "Cover letter addressed to the named chair or dean" },
          { id: "gu-research", label: "Research statement with an explicit funding plan", detail: "Name the local schemes: QNRF in Qatar, ASPIRE/Technology Innovation Institute in the UAE, KACST/NSTIP in Saudi Arabia. Showing you know the local funding landscape is unusual and lands well." },
          { id: "gu-teaching", label: "Teaching statement plus teaching evaluations if you have them", detail: "Get your UPES student feedback scores before you leave — you cannot obtain them afterwards.", leadDays: 14 },
          { id: "gu-refs", label: "3 referees with institutional email addresses", detail: "Gmail addresses are viewed with suspicion. Use university addresses only.", critical: true },
          { id: "gu-transcript", label: "Official transcripts with course-by-course marks", detail: "Requested from each university; UoH and Kashmir both take time.", leadDays: 21 },
        ],
      },
      {
        name: "Offer and package",
        items: [
          { id: "gu-package", label: "Get the full package in writing", detail: "Basic salary, housing allowance or provided accommodation, annual return flights for family, children's education allowance, health insurance, end-of-service gratuity. Headline salary alone is meaningless." },
          { id: "gu-tax", label: "Confirm tax position", detail: "GCC salary is untaxed locally. Your Indian tax residency depends on days spent in India — check before you plan the move." },
          { id: "gu-contract", label: "Contract length, renewal terms and exit clause", detail: "Ask what happens if you resign in year one — some contracts require repayment of relocation costs." },
          { id: "gu-visa", label: "Work visa and family sponsorship route confirmed", detail: "Confirm the employer sponsors dependants and what salary threshold that requires." },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════ */
  postdoc: {
    id: "postdoc",
    title: "Postdoc — worldwide",
    blurb: "Two routes, and they need different work. Advertised posts: apply like a job. Fellowships (MSCA, EMBO, Humboldt, HFSP): you win the money and bring it to a host — far more competitive, far better for your career, and needs a host agreed months ahead.",
    eligibilityNote: "Your PhD was awarded 28 July 2026, which puts you inside the eligibility window for every early-career fellowship scheme — most count 'years since PhD' and you are at zero. This window closes. MSCA and Humboldt are realistic targets right now.",
    sections: [
      {
        name: "Before applying — the part most people skip",
        items: [
          { id: "pd-pi", label: "Email the PI before you apply", detail: "For postdocs this matters more than the formal application. A short, specific email referencing their actual papers, with your CV attached. Use the generator on the Apply tab.", critical: true },
          { id: "pd-fit", label: "Read 2–3 of the group's recent papers properly", detail: "Your email has to show you read them. Generic enthusiasm reads as spam and is deleted." },
          { id: "pd-gap", label: "Identify what you bring that the group lacks", detail: "Usually: uncertainty-aware loss design, fuzzy-rough methods, and breast ultrasound experience. Most imaging groups have none of these." },
        ],
      },
      {
        name: "Application pack",
        items: [
          { id: "pd-cover", label: "Cover letter tailored to the lab", detail: "Three paragraphs: why this lab specifically, what you did, what you would do there.", critical: true },
          { id: "pd-cv", label: "Academic CV, 2–4 pages", detail: "International format — no photo, no DOB. Publications with DOIs.", critical: true },
          { id: "pd-proposal", label: "Research proposal, 1–3 pages", detail: "This is the differentiator. A concrete project that needs their infrastructure and your methods.", leadDays: 14, critical: true },
          { id: "pd-refs", label: "Referees briefed, letters requested 3–4 weeks ahead", detail: "Many systems email referees directly on submission — warn them first or the letter arrives late.", leadDays: 28, critical: true },
          { id: "pd-phd", label: "PhD certificate or award notification", have: "Education-Certificates/PhD Result Notification.pdf", critical: true },
          { id: "pd-transcript", label: "Transcripts, if requested" },
          { id: "pd-pubs", label: "Publication PDFs or links, with your role stated", detail: "7 of your 9 papers are first-author. Say so explicitly — it is not obvious from a citation list." },
        ],
      },
      {
        name: "Fellowship route (higher effort, much higher payoff)",
        items: [
          { id: "pd-host", label: "Host supervisor agreed and willing to co-write", detail: "Every fellowship needs a host who commits time. Secure this 4–6 months before the deadline.", leadDays: 120, critical: true },
          { id: "pd-msca", label: "MSCA Postdoctoral Fellowship considered", detail: "~€200k over 2 years at any European host. Deadline is usually September. The strongest single option for you." },
          { id: "pd-other", label: "Humboldt / EMBO / HFSP / JSPS checked", detail: "Humboldt has rolling deadlines and no country quota — the lowest-friction entry point of the four." },
          { id: "pd-india", label: "Indian schemes checked in parallel", detail: "ANRF N-PDF and the Ramanujan Fellowship, DST INSPIRE Faculty, DBT/Wellcome India Alliance. INSPIRE and Ramanujan come with a faculty position attached, not just a stipend." },
          { id: "pd-ethics", label: "Ethics and data-access section drafted", detail: "Medical imaging proposals need a clear answer on patient data: which dataset, whose approval, what governance. Reviewers penalise vagueness here." },
        ],
      },
      {
        name: "Practical",
        items: [
          { id: "pd-visa", label: "Visa and work-permit route checked for the country", detail: "EU Blue Card, UK Global Talent, US J-1 vs H-1B. The UK Global Talent route suits your publication record and does not need a job offer first." },
          { id: "pd-english", label: "English requirement checked", detail: "Usually waived for Indian applicants whose education was in English, but some visa routes still require IELTS. Check early — a test slot takes weeks.", leadDays: 30 },
          { id: "pd-family", label: "Dependant and relocation terms checked", detail: "Fellowship family allowances vary enormously; MSCA includes one, many national schemes do not." },
        ],
      },
    ],
  },
};

/** All tracks, for iteration in the UI. */
export const TRACKS = [
  { id: "india-govt",    label: "India — Government",  icon: "🏛️" },
  { id: "india-private", label: "India — Private",     icon: "🎓" },
  { id: "gulf",          label: "Gulf (GCC)",          icon: "🕌" },
  { id: "postdoc",       label: "Postdoc — worldwide", icon: "🌍" },
];

/** Flatten a checklist to a plain array of items. */
export function flatItems(checklist) {
  return checklist.sections.flatMap((s) => s.items.map((i) => ({ ...i, section: s.name })));
}

/** Total and critical counts, for progress bars. */
export function counts(checklist) {
  const items = flatItems(checklist);
  return { total: items.length, critical: items.filter((i) => i.critical).length };
}
