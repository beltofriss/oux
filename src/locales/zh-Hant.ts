import {type PageData} from '../constants';
import * as OpenCC from 'opencc-js';
import {PAGES_ZH_HANS} from './zh-Hans';

const toTraditional = OpenCC.Converter({from: 'cn', to: 'tw'});

const convertDeep = <T,>(value: T): T => {
  if (typeof value === 'string') {
    return toTraditional(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => convertDeep(item)) as T;
  }
  if (value && typeof value === 'object') {
    const convertedEntries = Object.entries(value).map(([key, nestedValue]) => [
      key,
      convertDeep(nestedValue),
    ]);
    return Object.fromEntries(convertedEntries) as T;
  }
  return value;
};

export const PAGES_ZH_HANT: Record<string, PageData> = convertDeep(PAGES_ZH_HANS);
