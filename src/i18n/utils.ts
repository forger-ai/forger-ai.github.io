import en from './en';
import es from './es';

export type Lang = 'en' | 'es';

export const translations = { en, es } as const;

export function getLang(url: URL): Lang {
  return url.pathname.startsWith('/es') ? 'es' : 'en';
}

export function t(lang: Lang) {
  return translations[lang];
}

export function localePath(lang: Lang, path: string): string {
  const clean = path.replace(/^\/es/, '') || '/';
  return lang === 'es' ? `/es${clean}` : clean;
}
