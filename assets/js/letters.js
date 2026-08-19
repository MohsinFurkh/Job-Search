/* ──────────────────────────────────────────────────────────────
   letters.js — first drafts, not final text.

   Every generator returns plain text you can copy straight into an
   email or a document. They are written to be edited: anything in
   [SQUARE BRACKETS] is a hole you must fill. The app highlights
   those holes so you cannot accidentally send one unfilled.
   ────────────────────────────────────────────────────────────── */

import { PROFILE as P } from "./profile.js";

const topPubs = () => P.publications.slice(0, 3)
  .map((p) => `  • ${p.title}. ${p.venue}, ${p.year}.`).join("\n");

const sig = () => `${P.title} ${P.name}
Assistant Professor, School of Computer Science
UPES, Dehradun, India
${P.contact.workEmail} | ${P.contact.personalEmail}
Google Scholar: ${P.contact.scholar}
ORCID: ${P.ids.orcid}`;

/* ══════════════════════════════════════════════════════════════
   1. Cold email to a prospective postdoc supervisor.
   The highest-leverage document in this whole app: a good version
   of this gets you positions that were never advertised.
   ══════════════════════════════════════════════════════════════ */
export function coldEmailPI({ piName = "[PI NAME]", institution = "[INSTITUTION]", topic = "[THEIR RESEARCH TOPIC]", paper = "[THEIR RECENT PAPER TITLE]" } = {}) {
  return `Subject: Postdoctoral enquiry — uncertainty-aware deep learning for medical image analysis

Dear Professor ${piName},

I am writing to ask whether you expect to have a postdoctoral opening in
your group at ${institution}. I completed my PhD in Computer Science at the
University of Hyderabad, India, awarded on 28 July 2026, on deep learning
for medical image segmentation and classification.

I read your recent paper, "${paper}", with close attention. [ONE SPECIFIC
SENTENCE ABOUT WHAT YOU FOUND INTERESTING OR WHAT QUESTION IT LEFT OPEN —
THIS IS THE ONLY PART THAT PROVES YOU ACTUALLY READ IT. DO NOT SKIP IT.]

My own work has focused on the learning objective rather than the
architecture: designing losses that carry uncertainty explicitly. My fuzzy
rough set loss (Computerized Medical Imaging and Graphics, 2026) and the
adaptive ensemble objective in UMA-Net (Medical & Biological Engineering &
Computing, 2025) both improve boundary accuracy on breast ultrasound, where
the ground truth is genuinely ambiguous. Most recently I led MSCT-Trans
(Ultrasound in Medicine & Biology, 2026, in press), an interpretable
multi-scale CNN-token transformer, which I conceived and executed
independently of my doctoral supervision.

I think this transfers directly to ${topic}: [ONE OR TWO SENTENCES ON THE
CONCRETE THING YOU WOULD DO IN THEIR LAB. BE SPECIFIC — NAME A DATASET, A
MODALITY OR A FAILURE MODE OF THEIR CURRENT APPROACH.]

A little context on my position: I hold an Assistant Professorship at UPES
on the research track, and I am Principal Investigator on an ICMR extramural
proposal (INR 2.5 million, under review) on Doppler ultrasound for fetal
monitoring, with a clinical co-investigator. I am not looking to leave
research for teaching — I am looking for a group where I can push the
methodological work further.

I would also be glad to apply for external funding to support the position.
[PICK ONE: an MSCA Postdoctoral Fellowship / a Humboldt Research Fellowship /
an EMBO Fellowship] would fit the timing, and I would be happy to prepare
the proposal with you if the direction interests you.

My CV is attached. Selected publications:

${topPubs()}

Thank you for your time.

With best regards,

${sig()}`;
}

/* ══════════════════════════════════════════════════════════════
   2. Cover letter — Assistant Professor, India (private)
   ══════════════════════════════════════════════════════════════ */
export function coverLetterIndiaPrivate({ institution = "[UNIVERSITY]", department = "[DEPARTMENT]", position = "Assistant Professor", refNo = "[ADVERTISEMENT NO.]" } = {}) {
  return `To
The Registrar / Head of ${department}
${institution}

Subject: Application for the post of ${position} (Ref: ${refNo})

Respected Sir/Madam,

I wish to apply for the post of ${position} in ${department} at
${institution}. I hold a PhD in Computer Science from the University of
Hyderabad, awarded on 28 July 2026, and UGC-NET with Junior Research
Fellowship in Computer Science & Applications at All India Rank 53. I am
currently an Assistant Professor at UPES, Dehradun, appointed on the
Research Faculty track.

Research. I work on deep learning for medical image analysis, with an
emphasis on the design of learning objectives rather than architectures
alone. I have nine peer-reviewed publications, seven as first author and
four in Q1 SCIE journals, with an h-index of 4 and over 100 citations. My
recent work includes a fuzzy rough set loss for medical image segmentation
(Computerized Medical Imaging and Graphics, 2026), a saliency-guided
dual-branch classifier (Biomedical Signal Processing and Control, 2026),
and MSCT-Trans (Ultrasound in Medicine & Biology, 2026, in press).

Independent research programme. Since joining UPES I have established a
line of work separate from my doctoral supervision. I am Principal
Investigator on an ICMR ANVESHAN extramural proposal of INR 25,00,000 on
AI-assisted quantification of umbilical artery Doppler ultrasound, with a
clinical co-investigator, and I published MSCT-Trans as first and
corresponding author with my own postgraduate student. I also serve as a
reviewer for IEEE Transactions on Medical Imaging, IEEE Journal of
Biomedical and Health Informatics and Information Fusion.

Teaching. I have taught Programming in C, Python Programming, Data
Structures and Algorithms, and Database Management Systems at
undergraduate level, and assisted graduate courses in Deep Learning for
Computer Vision and Advanced Machine Learning. I am prepared to teach
Machine Learning, Deep Learning, Computer Vision, Medical Image Analysis,
Soft Computing and Explainable AI at postgraduate level. My teaching pairs
mathematical foundations with reproducible implementation, drawing on
current research problems.

What I would bring to ${institution}. [TWO OR THREE SENTENCES NAMING
SOMETHING SPECIFIC ABOUT THIS INSTITUTION — A CENTRE, A FACULTY MEMBER, A
HOSPITAL PARTNERSHIP, AN EXISTING GPU FACILITY. GENERIC LETTERS ARE
OBVIOUS AND THEY GET FILTERED OUT.]

My detailed CV, publication list and supporting documents are enclosed. I
would welcome the opportunity to discuss my suitability further.

Thanking you,

Yours sincerely,

${sig()}`;
}

/* ══════════════════════════════════════════════════════════════
   3. Cover letter — Assistant Professor, India (government)
   Deliberately more formal; govt committees expect this register.
   ══════════════════════════════════════════════════════════════ */
export function coverLetterIndiaGovt({ institution = "[INSTITUTION]", department = "[DEPARTMENT]", refNo = "[ADVERTISEMENT NO. AND DATE]", post = "Assistant Professor" } = {}) {
  return `To
The Registrar
${institution}

Subject: Application for the post of ${post} in ${department}
         (Advertisement No. ${refNo})

Respected Sir/Madam,

With reference to the above advertisement, I submit my application for the
post of ${post} in ${department}. I enclose the prescribed application
form, self-attested copies of all certificates, my detailed curriculum
vitae, the academic score proforma, and reprints of my publications.

I hereby state my eligibility as follows:

  1. Ph.D. in Computer Science, University of Hyderabad, awarded
     28 July 2026. Thesis: "Advances in Deep Learning for Medical Image
     Segmentation and Classification."
  2. UGC-NET with Junior Research Fellowship, Computer Science &
     Applications, All India Rank 53 (2019).
  3. Master of Computer Applications, University of Kashmir.
  4. Teaching experience: Assistant Professor, UPES Dehradun
     (2025 – present); Assistant Professor, Government Degree College Uri,
     J&K (2019); Teaching Assistant, University of Hyderabad (2022–2024).
  5. Research output: 9 peer-reviewed publications, 7 as first author,
     4 in Q1 SCIE-indexed journals; h-index 4; 108+ citations.
  6. Principal Investigator, ICMR ANVESHAN extramural research proposal,
     INR 25,00,000 (under review).

I confirm that the information furnished above is true to the best of my
knowledge, and that the enclosed documents are genuine. [IF EMPLOYED: The
No Objection Certificate from my present employer is enclosed / has been
applied for and will be submitted on receipt.]

I request you to kindly consider my application.

Thanking you,

Yours faithfully,

${sig()}

Enclosures:
  1. Prescribed application form
  2. Detailed curriculum vitae
  3. Academic score / API proforma
  4. Self-attested copies of all educational certificates and marksheets
  5. UGC-NET JRF award letter and scorecard
  6. Experience certificates
  7. Reprints of publications
  8. Category / domicile certificate (if applicable)
  9. Demand draft / fee payment receipt`;
}

/* ══════════════════════════════════════════════════════════════
   4. Cover letter — Gulf universities
   ══════════════════════════════════════════════════════════════ */
export function coverLetterGulf({ institution = "[UNIVERSITY]", department = "[DEPARTMENT]", position = "Assistant Professor", chair = "[SEARCH COMMITTEE CHAIR]" } = {}) {
  return `Dear ${chair},

I am applying for the ${position} position in ${department} at
${institution}.

I completed my PhD in Computer Science at the University of Hyderabad,
India, in July 2026, and I currently hold an Assistant Professorship at
UPES, Dehradun on the research track. My research is in deep learning for
medical image analysis, specifically the design of uncertainty-aware
learning objectives for segmentation and classification of ultrasound.

Research record. Nine peer-reviewed publications, seven as first author,
four in Q1 SCIE journals including Computerized Medical Imaging and
Graphics, Biomedical Signal Processing and Control, Image and Vision
Computing, and Ultrasound in Medicine & Biology. h-index 4, 108+
citations. I review for IEEE Transactions on Medical Imaging, IEEE Journal
of Biomedical and Health Informatics, and Information Fusion.

Independent funding. I am Principal Investigator on an ICMR extramural
proposal of INR 2.5 million for AI-assisted analysis of umbilical artery
Doppler ultrasound, developed with a clinical co-investigator. I have
also held a competitive international travel grant.

Fit with ${institution}. [TWO OR THREE SENTENCES: NAME THE CENTRE, THE
HOSPITAL PARTNER, OR THE FACULTY MEMBER YOU WOULD WORK WITH. MENTION THE
LOCAL FUNDING BODY YOU WOULD TARGET — QNRF IN QATAR, ASPIRE OR TII IN THE
UAE, KACST IN SAUDI ARABIA. THIS IS WHAT SEPARATES A SERIOUS APPLICATION
FROM A MASS MAILING.]

Teaching. I have taught programming, data structures and database systems
at undergraduate level, and I am prepared to teach machine learning, deep
learning, computer vision, medical image analysis and explainable AI at
graduate level, in English.

I am available to begin [MONTH YEAR] and my documents are ready for
attestation. My CV, research statement, teaching statement and referee
details are attached.

Thank you for your consideration.

Sincerely,

${sig()}`;
}

/* ══════════════════════════════════════════════════════════════
   5. Research statement skeleton
   ══════════════════════════════════════════════════════════════ */
export function researchStatement() {
  return `RESEARCH STATEMENT
${P.name}

─────────────────────────────────────────────────────────────────
1. The problem I work on
─────────────────────────────────────────────────────────────────
Medical image segmentation models are usually trained with objectives
borrowed from natural-image vision — cross-entropy, Dice — which assume the
ground truth is certain. In clinical imaging it is not. Two radiologists
disagree on a lesion boundary in breast ultrasound, and speckle noise makes
the true edge genuinely ill-defined. Training against a single hard mask
teaches the network a confidence the data does not support.

My work treats that ambiguity as something to model rather than something
to average away.

─────────────────────────────────────────────────────────────────
2. What I have done
─────────────────────────────────────────────────────────────────
Uncertainty-aware losses. I introduced a fuzzy rough set loss for medical
image segmentation (Computerized Medical Imaging and Graphics, 2026) that
represents boundary uncertainty through lower and upper approximations
rather than a single threshold.

Adaptive ensemble objectives. UMA-Net (Medical & Biological Engineering &
Computing, 2025) reweights component losses during training rather than
fixing the weights in advance, together with multi-scale attention. The
dynamic weighting idea was developed further at ICCCNet-2024 in Manchester,
supported by a competitive travel grant.

Interpretability. Saliency-guided AttentionNet (Biomedical Signal
Processing and Control, 2026) uses a dual-branch design in which the
saliency signal informs classification rather than merely explaining it
after the fact. MSCT-Trans (Ultrasound in Medicine & Biology, 2026)
extends this to a multi-scale CNN-token transformer.

Efficiency. EfficientU-Net (Neural Processing Letters, 2023) and a genetic
algorithm-based ensemble for feature selection (Image and Vision Computing,
2024) address the practical constraint that clinical deployment happens on
modest hardware, not on a research cluster.

─────────────────────────────────────────────────────────────────
3. What I am doing now
─────────────────────────────────────────────────────────────────
As Principal Investigator on an ICMR ANVESHAN proposal (INR 25,00,000,
under review) I am extending this work from breast ultrasound to obstetric
Doppler: automated quantification of umbilical artery waveforms for early
detection of fetal compromise, with a clinical co-investigator in the J&K
Department of Health & Family Welfare. This moves the work from a benchmark
setting into a screening setting, where the cost of a false negative is
measured in outcomes rather than in Dice score.

─────────────────────────────────────────────────────────────────
4. Where I am going — the next five years
─────────────────────────────────────────────────────────────────
[EDIT THIS SECTION FOR EACH APPLICATION. THREE CONCRETE THREADS,
 EACH WITH A NAMED FUNDING TARGET AND A ROUGH TIMELINE. E.G.:]

Thread 1 — Uncertainty-aware adaptation of imaging foundation models.
[WHAT, WHY IT IS OPEN, WHAT YOU WOULD DO FIRST. TARGET: ANRF / MSCA.]

Thread 2 — Cross-modality generalisation from ultrasound to Doppler and MRI.
[TARGET: ICMR / DBT-Wellcome India Alliance.]

Thread 3 — Deployable, auditable models for low-resource clinical settings.
[TARGET: industry or hospital partnership.]

─────────────────────────────────────────────────────────────────
5. Why here
─────────────────────────────────────────────────────────────────
[REWRITE PER APPLICATION. NAME THE GROUP, THE CLINICAL PARTNER, THE
 IMAGING FACILITY OR THE DATASET THAT MAKES THIS INSTITUTION THE RIGHT
 PLACE FOR THREADS 1–3. IF YOU CANNOT WRITE THIS PARAGRAPH SPECIFICALLY,
 THE APPLICATION IS PROBABLY NOT WORTH SENDING.]`;
}

/* ══════════════════════════════════════════════════════════════
   6. Teaching statement
   ══════════════════════════════════════════════════════════════ */
export function teachingStatement() {
  return `TEACHING STATEMENT
${P.name}

I teach on the assumption that students understand a method when they can
implement it and say why it fails. That shapes three things about how I run
a course.

Mathematics first, then code — but never mathematics alone. In Data
Structures and in Machine Learning I derive the result on the board and
then have students implement it from that derivation, not from a library
call. A student who has written a convolution loop reads a PyTorch model
differently afterwards.

Projects drawn from live research problems. My own work on breast
ultrasound segmentation supplies problems that have no published answer,
which changes the classroom dynamic: the student is not reproducing a
result, they are attempting one. I have mentored over ten B.Tech, M.Tech
and IMTech students on projects of this kind, and co-authored a
peer-reviewed paper — MSCT-Trans, Ultrasound in Medicine & Biology, 2026 —
with a postgraduate student.

Reproducibility as a graded requirement. Code must run from a clean
checkout, with fixed seeds and a documented environment. Students find this
tedious until the first time their own results fail to reproduce.

Courses taught: Introduction to Programming using C, Python Programming,
Data Structures and Algorithms, Database Management Systems.

Courses assisted at graduate level: Deep Learning for Computer Vision,
Advanced Machine Learning, Neural Networks and Applications, Research
Methodology.

Prepared to teach — undergraduate: Programming (C/Python), Data Structures
and Algorithms, Database Management Systems, Operating Systems,
Introduction to Artificial Intelligence, Digital Image Processing.

Prepared to teach — postgraduate: Machine Learning, Deep Learning,
Computer Vision, Medical Image Analysis, Soft Computing and Fuzzy Systems,
Explainable AI, Research Methodology.

[OPTIONAL PARAGRAPH: ADD ONE SPECIFIC THING ABOUT TEACHING AT THIS
 INSTITUTION — A COURSE IN THEIR CATALOGUE YOU WOULD WANT TO TEACH OR
 REDESIGN, OR A GAP YOU COULD FILL.]`;
}

/* ══════════════════════════════════════════════════════════════
   7. Referee request
   ══════════════════════════════════════════════════════════════ */
export function refereeRequest({ refereeName = "[REFEREE NAME]", position = "[POSITION]", institution = "[INSTITUTION]", deadline = "[DEADLINE]" } = {}) {
  return `Subject: Request for a reference — ${position}, ${institution}

Dear ${refereeName},

I hope you are well.

I am applying for a ${position} position at ${institution}, with a deadline
of ${deadline}. May I list you as a referee?

If you are willing, the system will email you a link directly. To make it
as easy as possible I have attached:

  • my current CV
  • the job advertisement
  • a short note on why I am applying and what the role involves

Three things it would help to have emphasised, if you agree with them:

  1. That the work since my PhD is independent — MSCT-Trans and the ICMR
     ANVESHAN proposal were conceived and led by me, not extensions of my
     doctoral project.
  2. The methodological contribution specifically: the fuzzy rough set loss
     and the adaptive ensemble objective, rather than the applications.
  3. [THIRD POINT, TAILORED TO THIS ROLE — TEACHING, SUPERVISION,
     COLLABORATION, WHATEVER THE ADVERTISEMENT EMPHASISES.]

Please tell me if the timing is difficult and I will look for an
alternative — I would much rather ask early than put you under pressure.

Thank you very much.

With best regards,

${sig()}`;
}

/* ══════════════════════════════════════════════════════════════
   8. Post-application follow-up
   ══════════════════════════════════════════════════════════════ */
export function followUp({ institution = "[INSTITUTION]", position = "[POSITION]", appliedDate = "[DATE APPLIED]", contact = "[NAME]" } = {}) {
  return `Subject: Following up — ${position} application, ${institution}

Dear ${contact},

I applied for the ${position} position at ${institution} on ${appliedDate}
and wanted to confirm my application was received in full.

I remain very interested in the role. Since applying, [ONE LINE ON
ANYTHING NEW — A PAPER ACCEPTED, A GRANT DECISION, A TALK. IF THERE IS
NOTHING NEW, DELETE THIS SENTENCE RATHER THAN PADDING IT.]

If it would be useful, I am happy to supply any further documents or to
speak at your convenience.

Thank you for your time.

With best regards,

${sig()}`;
}

export const GENERATORS = [
  { id: "cold-pi",       name: "Cold email to a postdoc PI",        blurb: "The highest-leverage document here. Most postdocs are filled this way, before any advert appears.", fn: coldEmailPI,            fields: ["piName", "institution", "topic", "paper"] },
  { id: "cover-private", name: "Cover letter — India, private",     blurb: "For VIT, SRM, Amity, BITS, Shiv Nadar, Plaksha and similar.", fn: coverLetterIndiaPrivate, fields: ["institution", "department", "position", "refNo"] },
  { id: "cover-govt",    name: "Cover letter — India, government",  blurb: "Formal register, numbered eligibility, enclosure list. What government committees expect.", fn: coverLetterIndiaGovt,   fields: ["institution", "department", "refNo", "post"] },
  { id: "cover-gulf",    name: "Cover letter — Gulf university",    blurb: "International format, with the local funding body named.", fn: coverLetterGulf,        fields: ["institution", "department", "position", "chair"] },
  { id: "research",      name: "Research statement",                blurb: "Your real work, structured. Sections 4 and 5 must be rewritten per application.", fn: researchStatement,      fields: [] },
  { id: "teaching",      name: "Teaching statement",                blurb: "Reusable almost verbatim; add one institution-specific paragraph.", fn: teachingStatement,      fields: [] },
  { id: "referee",       name: "Referee request email",             blurb: "Send 3–4 weeks before the deadline, never the day before.", fn: refereeRequest,         fields: ["refereeName", "position", "institution", "deadline"] },
  { id: "followup",      name: "Follow-up email",                   blurb: "Two to three weeks after applying, if you have heard nothing.", fn: followUp,               fields: ["institution", "position", "appliedDate", "contact"] },
];
