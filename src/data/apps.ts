import type { Lang } from '../i18n/utils';

export type AppStatus = 'available' | 'comingSoon';

export interface AppLandingContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  flowTitle: string;
  flowSubtitle: string;
  flow: Array<{
    title: string;
    body: string;
  }>;
  featuresTitle: string;
  features: Array<{
    title: string;
    body: string;
  }>;
  privacyTitle: string;
  privacyBody: string;
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface AppEntry {
  slug: string;
  name: string;
  status: AppStatus;
  accent: string;
  category: Record<Lang, string>;
  description: Record<Lang, string>;
  highlight: Record<Lang, string>;
  tags: Record<Lang, string[]>;
  landing: Record<Lang, AppLandingContent>;
}

export const apps: AppEntry[] = [];

export function getApp(slug: string): AppEntry | undefined {
  return apps.find((app) => app.slug === slug);
}
