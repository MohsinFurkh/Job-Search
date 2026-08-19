/* ──────────────────────────────────────────────────────────────
   score.js — relevance scoring, shared by the Node fetcher and
   the browser. Kept dependency-free so both can import it.

   Scoring is deliberately simple and inspectable: each keyword
   bucket contributes its weight once (not once per hit), so a
   listing that says "deep learning" nine times does not outrank
   one that genuinely spans your field. `matched` is returned so
   the UI can show WHY something scored well.
   ────────────────────────────────────────────────────────────── */

import { PROFILE, GULF } from "./profile.js";

/** Score one listing against the profile. Returns { score, matched, band }. */
export function scoreJob(job) {
  const haystack = [job.title, job.org, job.description, job.field, job.location]
    .filter(Boolean).join(" ").toLowerCase();

  let score = 0;
  const matched = [];

  for (const [bucket, { weight, terms }] of Object.entries(PROFILE.keywords)) {
    const hits = terms.filter((t) => haystack.includes(t));
    if (!hits.length) continue;
    score += weight;
    // A second distinct term in the same bucket is worth a little more,
    // but with diminishing returns so breadth beats repetition.
    if (hits.length > 1) score += Math.min(hits.length - 1, 3) * Math.sign(weight) * 2;
    if (bucket !== "negative") matched.push(...hits.slice(0, 4));
  }

  /* A match in the title is much stronger evidence than a match buried
     in the body, and it also levels the field between sources: boards
     like jobs.ac.uk publish a one-line summary, so they would otherwise
     be permanently outscored by sources that dump the full advert into
     the feed — regardless of how well the post actually fits. */
  const titleText = (job.title || "").toLowerCase();
  if (PROFILE.keywords.core.terms.some((t) => titleText.includes(t))) score += 9;
  if (PROFILE.keywords.role.terms.some((t) => titleText.includes(t))) score += 7;

  // Freshness nudge — a listing posted this week beats a month-old one.
  const age = daysOld(job.posted);
  if (age !== null) {
    if (age <= 7) score += 6;
    else if (age <= 21) score += 3;
    else if (age > 120) score -= 8;
  }

  // Deadline urgency is surfaced separately, but a closed job is dead weight.
  const left = daysUntil(job.deadline);
  if (left !== null && left < 0) score -= 40;

  score = Math.max(0, Math.round(score));
  return { score, matched: [...new Set(matched)], band: band(score) };
}

export function band(score) {
  if (score >= 45) return "strong";
  if (score >= 25) return "possible";
  return "weak";
}

/** Which of your three searches does this belong to? */
export function classifyTrack(job) {
  const t = `${job.title} ${job.description || ""}`.toLowerCase();
  const loc = `${job.location || ""} ${job.country || ""}`.toLowerCase();

  const isPostdoc = /postdoc|post-doc|post doc|postdoctoral|research fellow|research associate/.test(t);
  const isFaculty = /assistant professor|associate professor|lecturer|faculty|tenure.track|professor/.test(t);

  if (loc.includes("india")) return isPostdoc && !isFaculty ? "postdoc" : "india";
  if (GULF.some((g) => loc.includes(g))) return "gulf";
  if (isPostdoc) return "postdoc";
  if (isFaculty) return "world-faculty";
  return "postdoc";
}

export function daysOld(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

export function daysUntil(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return null;
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export function parseDate(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
