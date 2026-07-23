import type { ContentBlock } from "@/lib/content-blocks";
export type { ContentBlock } from "@/lib/content-blocks";

// ─── Raw JSON shape (updatedAt is a string in JSON) ──────────────────────────

interface PostRaw {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt: string; // "YYYY-MM-DD" in JSON
  readTime: string;
  tags: string[];
  keywords: string[];
  bannerImage: string;
  bannerAlt: string;
  body: ContentBlock[];
}

// ─── Public type (updatedAt promoted to Date) ────────────────────────────────

export interface Post extends Omit<PostRaw, "updatedAt"> {
  updatedAt: Date;
}

// ─── Load from JSON files ────────────────────────────────────────────────────
// Import each file explicitly — Next.js static analysis needs literal paths.

import kimivsfable5 from "@/content/posts/kimik3vsfable5.json";
import gsapPost from "@/content/posts/gsap.json";
import queryMethod from "@/content/posts/querymethod.json";
import customCrm from "@/content/posts/custom-crm-vs-saas-tool.json";
import whyBusinessEmailKeepGoingToSpam from "@/content/posts/why-business-email-keep-going-to-spam.json";
import vercelVsAwsForSmallBusinessApps from "@/content/posts/vercel-vs-aws-for-small-business.json";
import howMuchTimeAutomationActuallySavesASmallTeam from "@/content/posts/how-much-time-automation-actually-saves-a-small-team.json";
import signsYourBusinessNeedsAB2BBuyerPortal from "@/content/posts/signs-your-business-needs-a-b2b-buyer-portal.json";
function hydrate(raw: PostRaw): Post {
  return { ...raw, updatedAt: new Date(raw.updatedAt) };
}

// Sorted newest-first so callers can simply slice(0, n)
export const posts: Post[] = [
  hydrate(kimivsfable5 as PostRaw),
  hydrate(queryMethod as PostRaw),
  hydrate(gsapPost as PostRaw),
  hydrate(customCrm as PostRaw),
  hydrate(whyBusinessEmailKeepGoingToSpam as PostRaw),
  hydrate(vercelVsAwsForSmallBusinessApps as PostRaw),
  hydrate(howMuchTimeAutomationActuallySavesASmallTeam as PostRaw),
  hydrate(signsYourBusinessNeedsAB2BBuyerPortal as PostRaw),
].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
