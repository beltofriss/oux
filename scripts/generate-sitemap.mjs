#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const constantsPath = path.join(rootDir, 'src', 'constants.ts');
const publicDir = path.join(rootDir, 'public');
const outputPath = path.join(publicDir, 'sitemap.xml');

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function normalizeBase(base) {
  return (base || 'https://beltofriss.github.io/oux').replace(/\/+$/, '');
}

function extractPageIds(source) {
  const ids = [...source.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  return [...new Set(ids)];
}

function buildUrl(base, id, locale) {
  if (locale === 'zh-Hant') {
    if (id === 'home') return `${base}/zh-hant`;
    return `${base}/zh-hant/${id}`;
  }
  if (id === 'home') return `${base}/`;
  return `${base}/${id}`;
}

function generateSitemap(base, ids) {
  const now = new Date().toISOString();
  const locales = ['zh-Hans', 'zh-Hant'];
  const urls = ids
    .flatMap((id) => locales.map((locale) => buildUrl(base, id, locale)))
    .map(
      (url) => [
        '  <url>',
        `    <loc>${url}</loc>`,
        `    <lastmod>${now}</lastmod>`,
        '    <changefreq>daily</changefreq>',
        '    <priority>0.7</priority>',
        '  </url>',
      ].join('\n'),
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

const base = normalizeBase(getArg('--base', 'https://ouxcex.com'));
const source = fs.readFileSync(constantsPath, 'utf8');
const ids = extractPageIds(source);

fs.mkdirSync(publicDir, {recursive: true});
fs.writeFileSync(outputPath, generateSitemap(base, ids), 'utf8');

console.log(`Generated sitemap: ${outputPath}`);
console.log(`URL count: ${ids.length * 2}`);
