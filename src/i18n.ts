import type {PageData} from './constants';
import * as OpenCC from 'opencc-js';
import {PAGES_ZH_HANS} from './locales/zh-Hans';
import {PAGES_ZH_HANT} from './locales/zh-Hant';

export type Locale = 'zh-Hans' | 'zh-Hant';

export const DEFAULT_LOCALE: Locale = 'zh-Hans';
export const HANT_PREFIX = '/zh-hant';

export const getPagesByLocale = (locale: Locale): Record<string, PageData> =>
  locale === 'zh-Hant' ? PAGES_ZH_HANT : PAGES_ZH_HANS;

export const resolveLocaleFromPath = (pathname: string): Locale => {
  const normalized = pathname.toLowerCase();
  if (normalized === HANT_PREFIX || normalized.startsWith(`${HANT_PREFIX}/`)) {
    return 'zh-Hant';
  }
  return DEFAULT_LOCALE;
};

export const stripLocalePrefix = (pathname: string, locale: Locale): string => {
  if (locale !== 'zh-Hant') return pathname;
  if (pathname === HANT_PREFIX) return '/';
  if (pathname.startsWith(`${HANT_PREFIX}/`)) {
    const stripped = pathname.slice(HANT_PREFIX.length);
    return stripped === '' ? '/' : stripped;
  }
  return pathname;
};

export const buildPathForLocale = (pageId: string, locale: Locale): string => {
  const localPath = pageId === 'home' ? '/' : `/${pageId}/`;
  if (locale === 'zh-Hant') {
    return localPath === '/' ? HANT_PREFIX : `${HANT_PREFIX}${localPath}`;
  }
  return localPath;
};

export const toHtmlLang = (locale: Locale): string =>
  locale === 'zh-Hant' ? 'zh-Hant' : 'zh-CN';

const toTraditional = OpenCC.Converter({from: 'cn', to: 'tw'});

export const localizeText = (text: string, locale: Locale): string =>
  locale === 'zh-Hant' ? toTraditional(text) : text;
