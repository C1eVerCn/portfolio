export type Locale = "zh" | "en";
export type ProjectSlug = "hermes" | "bhms";
export type ProjectAccent = "cyan" | "amber";
export type NornThreadId = "past" | "present" | "future";

export interface NornThreadContent {
  id: NornThreadId;
  norseName: "Urðr" | "Verðandi" | "Skuld";
  label: string;
  body: string;
}

export interface HeroContent {
  slogan: string;
  sloganEn: string;
  statement: string;
  explore: string;
  skipPrelude: string;
  replayPrelude: string;
}

export interface ProfileContent {
  name: string;
  englishName: string;
  role: string;
  email: string;
  github: string;
}

export interface CapabilityGroup {
  id: string;
  label: string;
  items: string[];
}

export interface ProjectSummary {
  slug: ProjectSlug;
  index: string;
  eyebrow: string;
  title: string;
  thesis: string;
  summary: string;
  accent: ProjectAccent;
  tags: string[];
}

export interface PrincipleContent {
  index: string;
  title: string;
  body: string;
}

export interface PortfolioContent {
  profile: ProfileContent;
  nav: { work: string; principles: string; about: string; contact: string };
  hero: HeroContent;
  threads: NornThreadContent[];
  capabilityIntro: { label: string; title: string; body: string };
  capabilities: CapabilityGroup[];
  workIntro: { label: string; title: string; body: string; openCase: string };
  projects: ProjectSummary[];
  principleIntro: { label: string; title: string };
  principles: PrincipleContent[];
  about: { label: string; title: string; body: string; email: string; github: string };
  footer: string;
}
