import type { Lang } from '../i18n/utils';

export const TEAMS_SITE_URLS = {
  en: 'https://teams.forger.cloud/',
  es: 'https://teams.forger.cloud/es/',
} as const satisfies Record<Lang, string>;

export function teamsSiteUrl(lang: Lang): string {
  return TEAMS_SITE_URLS[lang];
}
