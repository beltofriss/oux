#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = 'E:\\okx content\\ds\\ouyi-ds-geo';
const constantsPath = path.join(rootDir, 'src', 'constants.ts');

const fileToSlug = (fileName) => {
  const base = fileName.replace(/\.md(?:\.md)?$/i, '').replace(/^ouyi-/, '');
  if (base === 'beginner-guide') return 'beginner';
  return `beginner/${base}`;
};

const toTitleCase = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const escapeText = (value) => JSON.stringify(value);

const readMarkdown = (filePath) =>
  fs
    .readFileSync(filePath, 'utf8')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\[([^\]]+)\]\(\s*\)/g, '$1')
    .trim();

const extractPage = (fileName) => {
  const filePath = path.join(contentDir, fileName);
  const raw = readMarkdown(filePath);
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  let title = titleMatch?.[1]?.trim() || `欧易 ${toTitleCase(fileToSlug(fileName).split('/').pop() || '')}`;
  title = title
    .replace(/^欧易\/欧意/, '欧易')
    .replace(/^欧意是什么？和欧易有什么关系？/, '欧易和欧意是什么关系？');
  const body = raw.replace(/^#\s+.+\n?/, '').trim();
  const description =
    body
      .split(/\n+/)
      .map((line) => line.replace(/^#+\s+/, '').trim())
      .find((line) => line && !line.startsWith('---') && !line.startsWith('|')) ||
    `${title}，面向欧易新手用户整理常见问题、操作路径和风险提醒。`;

  const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  const faqs = headings
    .filter((heading) => /[?？]/.test(heading))
    .slice(0, 6)
    .map((heading) => ({
      q: heading,
      a: `本文在正文中围绕“${heading.replace(/[?？]+$/, '')}”做了具体说明，建议结合页面步骤逐项核对。`,
    }));

  return {
    id: fileToSlug(fileName),
    title,
    breadcrumbName: fileToSlug(fileName) === 'beginner' ? '新手入门' : title.replace(/^欧易/, '').slice(0, 18).trim() || '教程',
    parentId: fileToSlug(fileName) === 'beginner' ? 'home' : 'beginner',
    keywords: ['欧易', '欧易OKX', 'OKX', title.replace(/[？?].*$/, '').slice(0, 24)],
    description: description.slice(0, 150),
    content: body,
    faqs,
  };
};

const files = fs
  .readdirSync(contentDir)
  .filter((fileName) => /\.md(?:\.md)?$/i.test(fileName))
  .sort((a, b) => fileToSlug(a).localeCompare(fileToSlug(b)));

const importedPages = files.map(extractPage);
const beginnerPage = importedPages.find((page) => page.id === 'beginner');
const childPages = importedPages.filter((page) => page.id !== 'beginner');

if (!beginnerPage) {
  throw new Error('Missing ouyi-beginner-guide.md for /beginner/ page.');
}

const articleLinks = childPages
  .map((page) => `- [${page.title}](/oux/${page.id}/)`)
  .join('\n');

beginnerPage.content = `${beginnerPage.content}\n\n## 欧易新手专题目录\n\n${articleLinks}`;
beginnerPage.faqs = [
  {q: '欧易OKX新手应该先看哪篇？', a: '建议先阅读新手入门页，再按注册、安全、C2C、资金划转、提现和 Web3 钱包的顺序阅读。'},
  {q: '欧易和欧意有什么区别？', a: '欧易是常用中文名称，欧意多为用户搜索时的误写或别称，本站统一以欧易和欧易OKX组织内容。'},
  ...beginnerPage.faqs,
].slice(0, 8);

const pages = [
  {
    id: 'home',
    title: '欧易OKX新手教程与安全指南',
    breadcrumbName: '首页',
    keywords: ['欧易OKX', '欧易', 'OKX', '欧易教程', '欧易新手入门', '欧易安全指南'],
    description:
      '欧易OKX新手教程站，围绕欧易注册、下载、C2C 买币、资金划转、提现、安全设置和 Web3 钱包整理清晰问答与操作指南。',
    content: `本站围绕 **欧易OKX** 整理新手常见问题，重点覆盖注册、下载、买币、资金划转、提现、安全设置、Web3 钱包和平台功能理解。\n\n内容采用问答式和步骤式结构，方便用户快速判断自己卡在哪一步，并继续阅读对应专题。\n\n## 推荐阅读路径\n\n1. 先看欧易新手入门，了解注册、认证、买 U、划转和交易的基本顺序。\n2. 再看安全设置，确认谷歌验证、资金密码、提现白名单和防钓鱼码是否完成。\n3. 最后根据需求阅读 C2C、提现、Web3 钱包、理财和模拟交易等专题。\n\n## 专题入口\n\n- [欧易新手入门](/oux/beginner/)\n${articleLinks}`,
    faqs: [
      {q: '本站主要讲什么？', a: '本站主要围绕欧易OKX的新手使用问题，整理注册、下载、买币、资金划转、安全和提现等教程。'},
      {q: '欧易OKX和OKX是什么关系？', a: '欧易是华语用户常用的中文称呼，OKX 是国际通用品牌名，本站用“欧易OKX”作为全站主词。'},
      {q: '新手应该从哪里开始？', a: '建议从 /beginner/ 新手入门页开始，再阅读安全、C2C 和资金划转等专题。'},
    ],
  },
  beginnerPage,
  ...childPages,
];

const pageBlock = pages
  .map((page) => {
    const features =
      page.id === 'home'
        ? `,\n    features: [\n      { title: '新手入门', desc: '从注册、认证到第一笔交易，按顺序理解欧易基础流程。', icon: Info, navId: 'beginner' },\n      { title: '账户安全', desc: '覆盖谷歌验证、资金密码、提现白名单和防钓鱼码。', icon: ShieldCheck, navId: 'beginner/security' },\n      { title: '资金流程', desc: '理解买 U、账户划转、提现与 C2C 的关键差异。', icon: BarChart3, navId: 'beginner/account-transfer' },\n    ]`
        : '';
    return `  ${escapeText(page.id)}: {
    id: ${escapeText(page.id)},
    title: ${escapeText(page.title)},
    breadcrumbName: ${escapeText(page.breadcrumbName)},
    ${page.parentId ? `parentId: ${escapeText(page.parentId)},` : ''}
    keywords: ${JSON.stringify(page.keywords, null, 6).replace(/\n/g, '\n    ')},
    description: ${escapeText(page.description)},
    content: ${escapeText(page.content)},
    faqs: ${JSON.stringify(page.faqs, null, 6).replace(/\n/g, '\n    ')}${features}
  }`;
  })
  .join(',\n');

const output = `/**
 * @fileoverview Generated content for the oux GitHub Pages site.
 */

import {
  BarChart3,
  Info,
  ShieldCheck,
} from 'lucide-react';

export interface PageData {
  id: string;
  title: string;
  breadcrumbName: string;
  parentId?: string;
  keywords: string[];
  description: string;
  content: string;
  icon?: any;
  faqs?: { q: string; a: string }[];
  features?: { title: string; desc: string; icon: any; navId?: string }[];
}

export const PAGES: Record<string, PageData> = {
${pageBlock},
};
`;

fs.writeFileSync(constantsPath, output, 'utf8');

console.log(`Imported ${pages.length} pages from ${contentDir}`);
