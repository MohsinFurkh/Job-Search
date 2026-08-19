/* ──────────────────────────────────────────────────────────────
   profile.js — your academic identity, in one place.
   Everything the app knows about you comes from here: relevance
   scoring, checklist logic, and the document generators all read
   this object. Edit this file when your CV changes.
   Source: CV_Mohsin/*.tex (extracted 19 Aug 2026).
   ────────────────────────────────────────────────────────────── */

export const PROFILE = {
  name: "Mohsin Furkh Dar",
  title: "Dr.",
  headline: "Assistant Professor, School of Computer Science, UPES, Dehradun",
  tagline: "Deep Learning • Medical Image Analysis • Explainable AI",

  contact: {
    personalEmail: "mohsinfaurkh@gmail.com",
    workEmail: "mohsin.dar@ddn.upes.ac.in",
    linkedin: "https://www.linkedin.com/in/mohsinfurkh/",
    scholar: "https://scholar.google.com/citations?user=DGm9l2wAAAAJ&hl=en",
    researchgate: "https://www.researchgate.net/profile/Mohsin-Furkh",
    github: "https://github.com/mohsinfurkh",
    portfolio: "https://mohsinfurkh.github.io/",
  },

  // Persistent scholarly identifiers — almost every application form
  // asks for at least one of these. Kept here so you never hunt for them.
  ids: {
    orcid: "0000-0003-1756-9087",
    scopus: "58484416800",
    wosResearcherId: "KIB-9833-2024",
    vidwan: "638631",
  },

  bibliometrics: {
    publications: 9,
    firstAuthor: 7,
    q1Scie: 4,
    hIndex: 4,
    citations: 108,
    asOf: "August 2026",
  },

  education: [
    {
      degree: "Ph.D. in Computer Science",
      institution: "University of Hyderabad, India",
      period: "Nov 2020 – Jul 2026",
      awarded: "28 July 2026",
      thesis: "Advances in Deep Learning for Medical Image Segmentation and Classification",
      advisor: "Dr. Avatharam Ganivada",
      funding: "UGC Junior Research Fellowship (AIR 53)",
    },
    {
      degree: "M.Phil. in Computer Science",
      institution: "Mewar University, India",
      period: "Sep 2017 – Mar 2019",
      thesis: "Performance Comparison of Face Detection and Recognition Algorithms",
    },
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "University of Kashmir, India",
      period: "Mar 2013 – Jun 2016",
    },
    {
      degree: "B.Sc. (Mathematics, Physics, Information Technology)",
      institution: "University of Kashmir, India",
      period: "Mar 2010 – Jan 2013",
    },
  ],

  appointments: [
    { role: "Assistant Professor", org: "School of Computer Science, UPES, Dehradun", period: "2025 – Present", note: "Research Faculty track" },
    { role: "Teaching Assistant", org: "SCIS, University of Hyderabad", period: "Jan 2022 – Dec 2024" },
    { role: "System Administrator, AI Lab", org: "SCIS, University of Hyderabad", period: "Jan 2021 – Dec 2022" },
    { role: "Assistant Professor", org: "Government Degree College Uri, Baramulla, J&K", period: "2019" },
  ],

  // Ordered best-first. The generators quote the top three.
  publications: [
    { year: 2026, title: "MSCT-Trans: Multi-Scale CNN Token Transformer for Interpretable Ultrasound Image Classification", venue: "Ultrasound in Medicine & Biology", role: "first & corresponding", note: "in press" },
    { year: 2026, title: "Saliency-guided AttentionNet: Dual-branch deep learning for breast ultrasound classification", venue: "Biomedical Signal Processing and Control", doi: "10.1016/j.bspc.2026.111194", role: "first" },
    { year: 2026, title: "Fuzzy rough set loss for deep learning-based precise medical image segmentation", venue: "Computerized Medical Imaging and Graphics", doi: "10.1016/j.compmedimag.2026.102716", role: "first" },
    { year: 2025, title: "Adaptive ensemble loss and multi-scale attention in breast ultrasound segmentation with UMA-Net", venue: "Medical & Biological Engineering & Computing", doi: "10.1007/s11517-025-03301-5", role: "first" },
    { year: 2024, title: "Deep learning and genetic algorithm-based ensemble model for feature selection and classification of breast ultrasound images", venue: "Image and Vision Computing", doi: "10.1016/J.IMAVIS.2024.105018", role: "first" },
    { year: 2023, title: "EfficientU-Net: A Novel Deep Learning Method for Breast Tumor Segmentation and Classification in Ultrasound Images", venue: "Neural Processing Letters", doi: "10.1007/s11063-023-11333-x", role: "first" },
  ],

  grants: [
    { year: 2026, name: "ICMR ANVESHAN Small Extramural Grant", role: "Principal Investigator", amount: "INR 25,00,000", status: "under review", topic: "AI-assisted quantification of umbilical artery Doppler ultrasound for early detection of fetal compromise" },
    { year: 2024, name: "IoE International Travel Grant, University of Hyderabad", role: "Awardee", amount: "INR 1,00,000", status: "awarded" },
  ],

  awards: [
    { year: 2019, name: "UGC NET with Junior Research Fellowship, Computer Science & Applications", detail: "All India Rank 53" },
    { year: 2024, name: "IoE International Travel Grant", detail: "INR 1,00,000, Manchester UK" },
  ],

  peerReview: [
    "IEEE Transactions on Medical Imaging",
    "IEEE Journal of Biomedical and Health Informatics",
    "Information Fusion (Elsevier)",
    "Image and Vision Computing (Elsevier)",
    "Engineering Applications of Artificial Intelligence (Elsevier)",
    "Neural Computing and Applications (Springer)",
    "Multimedia Tools and Applications (Springer)",
    "Journal of Clinical Ultrasound (Wiley)",
  ],

  teaching: {
    taught: ["Introduction to Programming using C", "Python Programming", "Data Structures and Algorithms", "Database Management Systems"],
    assisted: ["Deep Learning for Computer Vision", "Advanced Machine Learning", "Neural Networks and Applications", "Research Methodology"],
    readyUG: ["Programming (C/Python)", "Data Structures and Algorithms", "Database Management Systems", "Operating Systems", "Introduction to Artificial Intelligence", "Digital Image Processing"],
    readyPG: ["Machine Learning", "Deep Learning", "Computer Vision", "Medical Image Analysis", "Soft Computing and Fuzzy Systems", "Explainable AI", "Research Methodology"],
  },

  skills: {
    programming: ["Python", "C", "MATLAB", "SQL"],
    deepLearning: ["TensorFlow", "Keras", "PyTorch", "CUDA/GPU training"],
    ml: ["scikit-learn", "NumPy", "Pandas", "SciPy", "OpenCV", "Matplotlib", "Seaborn"],
    tools: ["Git", "Docker", "Jupyter", "LaTeX", "Linux/HPC", "Zotero"],
  },

  referees: [
    { name: "Dr. Avatharam Ganivada", relation: "Doctoral advisor", org: "SCIS, University of Hyderabad", email: "avatharg@uohyd.ac.in", phone: "+91-40-2313 4105" },
    { name: "Prof. Tanupriya Choudhury", relation: "Co-Investigator, ICMR proposal", org: "UPES, Dehradun", email: "" },
    { name: "Dr. Ufaque Muzaffar", relation: "Clinical Co-PI, ICMR proposal", org: "Dept. of Health & Family Welfare, J&K", email: "" },
  ],

  /* ── Relevance scoring vocabulary ──────────────────────────────
     Weights are additive. A job scoring >= 45 is a "strong match".
     Tune these numbers if the feed gets too noisy or too quiet. */
  keywords: {
    core: {
      weight: 18,
      terms: ["medical image", "medical imaging", "image segmentation", "breast ultrasound", "ultrasound",
              "radiology", "computer-aided diagnosis", "computer aided diagnosis", "biomedical imaging",
              "medical ai", "clinical ai", "healthcare ai", "digital pathology", "mri", "ct imaging"],
    },
    strong: {
      weight: 11,
      terms: ["deep learning", "computer vision", "machine learning", "neural network", "artificial intelligence",
              "explainable ai", "interpretable", "foundation model", "transformer", "segmentation",
              "image analysis", "pattern recognition"],
    },
    adjacent: {
      weight: 6,
      terms: ["fuzzy", "rough set", "soft computing", "evolutionary", "genetic algorithm", "optimisation",
              "optimization", "feature selection", "data science", "bioinformatics", "health informatics",
              "biomedical engineering", "signal processing"],
    },
    role: {
      weight: 14,
      terms: ["assistant professor", "postdoc", "post-doc", "post doc", "postdoctoral", "research fellow",
              "lecturer", "faculty position", "tenure track", "tenure-track", "research associate",
              "senior lecturer", "assistant prof"],
    },
    // Subtracted — filters out the noise these boards are full of.
    negative: {
      weight: -30,
      terms: ["phd student", "phd position", "phd scholarship", "phd fellowship", "phd studentship",
              "doctoral candidate", "doctoral student", "doctoral position", "phd candidate",
              "studentship", "masters student", "internship", "undergraduate", "technician",
              "administrator", "accountant", "sales", "marketing", "nurse", "cleaner", "secretary"],
    },
  },
};

/* Countries and cities treated as "Gulf" for filtering. */
export const GULF = ["united arab emirates", "uae", "saudi arabia", "qatar", "kuwait",
                     "oman", "bahrain", "ksa", "dubai", "abu dhabi", "riyadh", "doha",
                     "muscat", "manama", "sharjah", "jeddah", "dhahran"];
