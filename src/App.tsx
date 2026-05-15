/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Shield, 
  Download, 
  Smartphone, 
  Monitor, 
  Globe, 
  Wallet, 
  ChevronRight, 
  ChevronDown,
  AlertCircle, 
  Menu, 
  X, 
  CheckCircle2,
  ShieldCheck,
  ArrowDownToLine,
  UserPlus,
  Info,
  ArrowUpDown,
  Laptop,
  Apple,
  Zap,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { type PageData } from './constants';
import {
  buildPathForLocale,
  getPagesByLocale,
  localizeText,
  resolveLocaleFromPath,
  stripLocalePrefix,
  toHtmlLang,
  type Locale,
} from './i18n';
import BackToTop from './components/BackToTop';
import MobileStickyFooter from './components/MobileStickyFooter';

const CANONICAL_ORIGIN = 'https://beltofriss.github.io/oux';
const SITE_BASE_PATH = '/oux';

const stripSiteBasePath = (pathname: string) => {
  if (pathname === SITE_BASE_PATH) return '/';
  if (pathname.startsWith(`${SITE_BASE_PATH}/`)) {
    return pathname.slice(SITE_BASE_PATH.length) || '/';
  }
  return pathname;
};

const toCanonicalPath = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
};

const getHeroTitleParts = (rawTitle: string) => {
  const stripTail = (text: string) =>
    text.replace(/(_o[^_\s]+)\s*$/u, '').replace(/\s*\|\s*o[^|\s]+$/u, '').trim();

  const source = stripTail(rawTitle.trim());
  let main = source;
  let sub = '';

  const dashIndex = source.indexOf(' - ');
  const cnColonIndex = source.indexOf('\uFF1A');
  const enColonIndex = source.indexOf(':');
  const splitIndex =
    dashIndex >= 0
      ? dashIndex
      : cnColonIndex >= 0
        ? cnColonIndex
        : enColonIndex >= 0
          ? enColonIndex
          : -1;

  if (splitIndex >= 0) {
    const separator = source.slice(splitIndex, splitIndex + 3) === ' - ' ? ' - ' : source[splitIndex];
    const [left, ...rest] = source.split(separator);
    main = (left || source).trim();
    sub = rest.join(separator).trim();
  }

  sub = sub.replace(/^\u6B27\u610FOKX\s*/u, '').trim();
  return {main, sub};
};

// --- 子组件 ---

const Breadcrumbs = ({
  currentPath,
  onNavigate,
  pages,
}: {
  currentPath: string;
  onNavigate: (path: string) => void;
  pages: Record<string, PageData>;
}) => {
  if (currentPath === 'home') return null;

  const crumbs = [];
  let temp = pages[currentPath];
  while (temp) {
    crumbs.unshift(temp);
    temp = temp.parentId ? pages[temp.parentId] : undefined;
  }

  // Ensure home is at the base
  if (crumbs[0]?.id !== 'home') {
    crumbs.unshift(pages['home']);
  }

  return (
    <nav className="flex items-center gap-1 text-xs md:text-sm text-slate-400 mb-10 font-bold">
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          {index > 0 && <ChevronRight size={14} className="mx-1 text-slate-400" strokeWidth={3} />}
          <button 
            onClick={() => onNavigate(crumb.id)}
            className={`hover:text-blue-600 transition-colors uppercase tracking-wider ${index === crumbs.length - 1 ? 'text-slate-600 cursor-default pointer-events-none' : ''}`}
          >
            {crumb.breadcrumbName}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

const Navbar = ({
  onNavigate,
  onSwitchLocale,
  currentPath,
  locale,
}: {
  onNavigate: (path: string) => void;
  onSwitchLocale: (nextLocale: Locale) => void;
  currentPath: string;
  locale: Locale;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [currentPath]);

  const handleMobileToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const menuItems = [
    { label: '首页', id: 'home' },
    { label: '新手入门', id: 'beginner' },
    { label: '资金划转', id: 'beginner/account-transfer' },
    { label: 'C2C安全', id: 'beginner/c2c-safe' },
    {
      label: '常见教程',
      id: 'beginner',
      children: [
        { label: '安卓下载', id: 'beginner/android-download-guide' },
        { label: '手续费', id: 'beginner/fee' },
        { label: '账户安全', id: 'beginner/security' },
        { label: '提现提币', id: 'beginner/withdraw-faq' },
        { label: 'Web3钱包', id: 'beginner/web3' },
        { label: '全部专题', id: 'beginner', isDivider: true },
      ],
    },
    { label: '安全指南', id: 'beginner/security' },
  ];
  const t = (text: string) => localizeText(text, locale);

  return (
    <nav className="fixed top-0 w-full z-50 relative overflow-visible bg-white/95 backdrop-blur-md border-b border-slate-100 h-16 sm:h-20 flex items-center">
      <div className="section-container w-full min-w-0 flex justify-between items-center gap-2">
        <div 
          className="flex items-center cursor-pointer min-w-0" 
          onClick={() => onNavigate('home')}
        >
          <div className="bg-blue-600 text-white p-1.5 rounded-lg mr-2 shrink-0">
            <Shield size={24} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 truncate">{t('欧易OKX指南')}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="relative group"
              onMouseEnter={() => item.children && setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => onNavigate(item.id)}
                className={`text-[15px] font-bold transition-colors hover:text-blue-600 flex items-center gap-1 py-4 ${
                  currentPath === item.id || (item.children?.some(c => c.id === currentPath)) ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                {t(item.label)}
                {item.children && <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />}
              </button>

              {item.children && (
                <AnimatePresence>
                  {activeDropdown === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 w-48 bg-white shadow-2xl rounded-2xl border border-slate-100 py-3 overflow-hidden"
                    >
                      {item.children.map((child, i) => (
                        <button
                          key={i}
                          onClick={() => { onNavigate(child.id); setActiveDropdown(null); }}
                          className={`w-full text-left px-5 py-2.5 text-[13px] font-bold transition-all hover:bg-blue-50 ${
                            child.isDivider ? 'text-blue-600 border-t border-slate-50 mt-1 pt-3' : 'text-slate-600 hover:text-blue-600'
                          }`}
                        >
                          {t(child.label)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
          <select
            value={locale}
            onChange={(event) => onSwitchLocale(event.target.value as Locale)}
            className="text-[13px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label={t('语言切换')}
            data-cta="false"
          >
            <option value="zh-Hans">{t('简体')}</option>
            <option value="zh-Hant">{t('繁體')}</option>
          </select>
          <a
            href="/oux/beginner/"
            data-cta="true"
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all"
          >
            {t('新手入门')}
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-slate-900 shrink-0 ml-1"
          onClick={handleMobileToggle}
          data-cta="false"
          aria-label="打开菜单"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="md:hidden absolute left-0 right-0 top-full bg-white z-[70] px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] flex flex-col gap-2 border-b border-slate-100 shadow-xl max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
            data-cta="false"
          >
            {menuItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 border-b border-slate-100 pb-3 last:border-0">
                {!item.children ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onNavigate(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left text-base font-black py-2.5 ${
                      currentPath === item.id ? 'text-blue-600' : 'text-slate-900'
                    }`}
                    data-cta="false"
                  >
                    <span className="leading-snug whitespace-normal break-words">{t(item.label)}</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setActiveDropdown(activeDropdown === item.id ? null : item.id);
                      }}
                      className={`w-full text-left text-base font-black py-2.5 flex items-center justify-between ${
                        currentPath === item.id ? 'text-blue-600' : 'text-slate-900'
                      }`}
                      data-cta="false"
                    >
                      <span className="leading-snug whitespace-normal break-words">{t(item.label)}</span>
                      <ChevronDown size={18} className={activeDropdown === item.id ? 'rotate-180' : ''} />
                    </button>
                    {activeDropdown === item.id && (
                      <div className="grid grid-cols-1 gap-2 pl-1">
                        {item.children.map((child, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              onNavigate(child.id);
                              setIsOpen(false);
                            }}
                            className="text-left text-sm font-bold text-slate-600 py-2.5 bg-slate-50 px-3 rounded-xl active:bg-blue-50 whitespace-normal break-words leading-snug"
                            data-cta="false"
                          >
                            {t(child.label)}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div className="border-b border-slate-100 pb-3">
              <label className="block text-xs font-bold text-slate-400 mb-2">{t('语言')}</label>
              <select
                value={locale}
                onChange={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSwitchLocale(event.target.value as Locale);
                  setIsOpen(false);
                }}
                className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label={t('语言切换')}
                data-cta="false"
              >
                <option value="zh-Hans">{t('简体')}</option>
                <option value="zh-Hant">{t('繁體')}</option>
              </select>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100 italic text-[10px] text-slate-400">
              欧易OKX新手教程与安全指引 @ {currentYear}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeader = ({ title, desc }: { title: string, desc?: string }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{title}</h2>
    {desc && <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">{desc}</p>}
  </div>
);

const Footer = ({ onNavigate, locale }: { onNavigate: (path: string) => void; locale: Locale }) => {
  const currentYear = new Date().getFullYear();
  const t = (text: string) => localizeText(text, locale);
  
  const footLinks = {
    software: [
      { label: '新手入门', id: 'beginner' },
      { label: '安卓下载', id: 'beginner/android-download-guide' },
      { label: '第一笔买币', id: 'beginner/buy-first-coin' },
      { label: '资金划转', id: 'beginner/account-transfer' },
      { label: '提现提币', id: 'beginner/withdraw-faq' }
    ],
    brands: [
      { label: '欧易和欧意', id: 'beginner/vs-ouyi' },
      { label: '欧易OKX安全', id: 'beginner/security' },
      { label: 'C2C买币安全', id: 'beginner/c2c-safe' },
      { label: '手续费说明', id: 'beginner/fee' },
      { label: '邀请码奖励', id: 'beginner/invite' }
    ],
    support: [
      { label: '高息赚币', id: 'beginner/earn-guide' },
      { label: '活期理财', id: 'beginner/earn-live' },
      { label: '模拟交易', id: 'beginner/simulate-trade' },
      { label: '杠杆风险', id: 'beginner/leverage-warning' },
      { label: 'Web3钱包', id: 'beginner/web3' }
    ]
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg mr-2">
                <Shield size={24} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">欧易OKX指南</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 pr-4 font-medium opacity-80">
              围绕欧易OKX整理新手入门、买币、资金划转、安全设置、提现和 Web3 钱包等常见问题，帮助用户按步骤理解操作路径。
            </p>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm italic text-[11px] text-slate-400 leading-normal">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p>
                  本站系第三方资讯页面，仅整理欧易OKX相关新手问题与操作思路。请核对平台实际页面提示，并确保资产操作符合当地法律规范。
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">{t('入门路径')}</h4>
              <ul className="space-y-4">
                {footLinks.software.map((link, idx) => (
                  <li key={idx}>
                    <button onClick={() => onNavigate(link.id)} className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">
                      {t(link.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">{t('重点问题')}</h4>
              <ul className="space-y-4">
                {footLinks.brands.map((link, idx) => (
                  <li key={idx}>
                    <button onClick={() => onNavigate(link.id)} className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors text-left">
                      {t(link.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">{t('服务支持')}</h4>
              <ul className="space-y-4">
                {footLinks.support.map((link, idx) => (
                  <li key={idx}>
                    <button onClick={() => onNavigate(link.id)} className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors text-left">
                      {t(link.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-[10px] font-bold">
            © {currentYear} 欧易OKX新手教程与安全指南. 内容仅供学习参考。
          </p>
          <div className="flex gap-4 md:gap-8 text-[9px] text-slate-300 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><Shield size={10} className="text-blue-400" /> Official Release</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-blue-400" /> Verified Clean</span>
            <span className="flex items-center gap-1"><Zap size={10} className="text-blue-400" /> 24H Sync</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- 主程序 ---

export default function App() {
  const router = useRouter();
  const pathname = useMemo(() => {
    if (typeof window !== 'undefined') {
      return stripSiteBasePath(window.location.pathname || '/');
    }
    const raw = (router.asPath || '/').split('?')[0].split('#')[0];
    return stripSiteBasePath(raw || '/');
  }, [router.asPath, router.isReady]);
  const locale = useMemo<Locale>(() => resolveLocaleFromPath(pathname), [pathname]);
  const localizedPath = useMemo(
    () => stripLocalePrefix(pathname, locale),
    [pathname, locale],
  );
  const normalizedPath = localizedPath.replace(/\/+$/, '');
  const requestedPath = normalizedPath === '' || normalizedPath === '/' ? 'home' : normalizedPath.slice(1);
  const pages = useMemo(() => getPagesByLocale(locale), [locale]);
  const isNotFound = requestedPath !== 'home' && !pages[requestedPath];
  const currentPath = isNotFound ? 'home' : requestedPath;
  const pageData = useMemo(() => pages[currentPath] || pages['home'], [currentPath, pages]);
  const heroTitle = useMemo(() => getHeroTitleParts(pageData.title), [pageData.title]);
  const t = (text: string) => localizeText(text, locale);

  useEffect(() => {
    document.documentElement.lang = toHtmlLang(locale);
    window.scrollTo(0, 0);
  }, [locale, pathname]);

  const currentCanonicalPath = isNotFound ? toCanonicalPath(pathname) : toCanonicalPath(buildPathForLocale(currentPath, locale));
  const canonicalUrl = `${CANONICAL_ORIGIN}${currentCanonicalPath}`;
  const hansUrl = `${CANONICAL_ORIGIN}${buildPathForLocale(currentPath, 'zh-Hans')}`;
  const hantUrl = `${CANONICAL_ORIGIN}${buildPathForLocale(currentPath, 'zh-Hant')}`;

  const metaTitle = isNotFound ? t('404 - 页面不存在 | 欧易OKX指南') : pageData?.title;
  const metaDescription = isNotFound ? t('您访问的页面不存在，请返回欧易OKX指南继续浏览。') : pageData?.description;
  const metaKeywords = isNotFound ? t('404,页面不存在,欧易OKX指南') : pageData?.keywords?.join(', ');
  const metaRobots = isNotFound ? 'noindex,follow' : 'index,follow';

  useEffect(() => {
    if (locale !== 'zh-Hant') return;
    const root = document.body;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const textNode = node as Text;
      const parentTag = textNode.parentElement?.tagName;
      if (parentTag !== 'SCRIPT' && parentTag !== 'STYLE' && textNode.nodeValue) {
        textNode.nodeValue = localizeText(textNode.nodeValue, locale);
      }
      node = walker.nextNode();
    }
  }, [locale, pathname]);

  const navigate = (path: string) => {
    router.push(buildPathForLocale(path, locale));
  };

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    router.push(buildPathForLocale(currentPath, nextLocale));
  };

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        <meta name="robots" content={metaRobots} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        {!isNotFound && (
          <>
            <link rel="alternate" hrefLang="zh-Hans" href={hansUrl} />
            <link rel="alternate" hrefLang="zh-Hant" href={hantUrl} />
            <link rel="alternate" hrefLang="x-default" href={hansUrl} />
          </>
        )}
      </Head>
      <Navbar onNavigate={navigate} onSwitchLocale={switchLocale} currentPath={currentPath} locale={locale} />

      <main className="pt-24 lg:pt-32 pb-24 lg:pb-0">
        <div className="section-container">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {isNotFound ? (
                <div className="min-h-[55vh] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <AlertCircle size={36} />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">404</h1>
                  <p className="text-base md:text-lg text-slate-500 mb-8 max-w-2xl leading-relaxed">
                    页面不存在或链接已失效，请返回首页继续访问独立页面入口。
                  </p>
                  <button
                    onClick={() => navigate('home')}
                    className="btn-primary !py-3 !px-8"
                    data-cta="false"
                  >
                    返回首页
                  </button>
                </div>
              ) : (
                <>
              <Breadcrumbs currentPath={currentPath} onNavigate={navigate} pages={pages} />
              
              {/* --- Hero 区域 --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 lg:mb-32">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 uppercase border border-blue-100">
                    <Shield size={14} /> 新手教程 • 安全指引
                  </div>
                  <h1 className={`flex flex-col gap-2 md:gap-4 mb-8 ${pageData.id === 'home' ? 'text-center' : ''}`}>
                    <span className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                      {heroTitle.main}
                    </span>
                    {heroTitle.sub && (
                      <span className="text-lg md:text-2xl lg:text-3xl font-medium text-blue-600/80 leading-tight">
                        {heroTitle.sub}
                      </span>
                    )}
                  </h1>
                  <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-xl">
                    {pageData.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button 
                      onClick={() => navigate('beginner')}
                      className="btn-primary group !py-3"
                      data-cta="true"
                    >
                      <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> 
                      查看新手入门
                    </button>
                    <button 
                      onClick={() => navigate('beginner/security')}
                      className="btn-secondary !py-3 !bg-slate-200 hover:!bg-slate-300"
                      data-cta="true"
                    >
                      <UserPlus size={18} /> 账户安全指南
                    </button>
                  </div>

                  <div className="flex items-center gap-5 text-[13px] text-slate-400 font-bold bg-slate-50/50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> V8.2.0 稳定版</span>
                    <div className="w-px h-3 bg-slate-200" />
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> 已通过杀毒认证</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="card-shadow p-8 lg:p-12 relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                         <Info size={24} />
                       </div>
                       <h3 className="text-xl font-black">新手先看什么？</h3>
                    </div>
                    <ul className="space-y-6">
                      {[
                        { t: '先懂流程', d: '从注册、认证、买 U 到划转交易，先把顺序理清楚。' },
                        { t: '重视安全', d: '谷歌验证、资金密码、提现白名单和防钓鱼码建议优先设置。' },
                        { t: '控制风险', d: 'C2C、杠杆、提现和 Web3 钱包都需要按风险等级逐步尝试。' },
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <div className="font-black text-blue-200 text-3xl">0{i+1}</div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">{t(item.t)}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{t(item.d)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* 背景装饰 */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />
                </div>
              </div>

              {/* --- 品牌快速入口 (已移除，功能整合至上方主要入口卡片) --- */}

              {/* --- 核心特性或多端导航 --- */}
              <div className="mb-24">
                 <SectionHeader 
                   title={pageData.id === 'home' ? '欧易OKX新手专题' : `${pageData.breadcrumbName}阅读重点`}
                   desc={pageData.id === 'home' ? '按新手真实问题组织内容，从入门流程、安全设置到资金操作逐步展开。' : `本页围绕 ${pageData.breadcrumbName} 的常见问题、操作路径和风险提醒展开。`}
                 />
                 <div className={`grid grid-cols-1 ${ (pageData.features?.length || 3) === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-5' } gap-8`}>
                    {(pageData.features || [
                      { title: '新手入门', desc: '按注册、认证、买币、划转和交易顺序理解基础流程。', icon: Smartphone, navId: 'beginner' },
                      { title: '账户安全', desc: '集中查看谷歌验证、资金密码、白名单和防钓鱼码。', icon: ShieldCheck, navId: 'beginner/security' },
                      { title: '资金操作', desc: '理解 C2C、资金账户、交易账户和提现之间的关系。', icon: BarChart3, navId: 'beginner/account-transfer' },
                    ]).map((f, i) => {
                      const Icon = f.icon;
                      return (
                        <div key={i} className="card-shadow p-8 flex flex-col items-start group hover:-translate-y-1 transition-all duration-300">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Icon size={24} />
                          </div>
                          <h3 className="text-2xl font-black mb-3">{t(f.title)}</h3>
                          <p className="text-slate-500 mb-8 leading-relaxed font-medium">{t(f.desc)}</p>
                          {(f as any).navId ? (
                            <button 
                              onClick={() => navigate((f as any).navId)}
                              className="mt-auto flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                            >
                              查看专题 <ChevronRight size={18} />
                            </button>
                          ) : (
                            <div className="mt-auto flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                              <ShieldCheck size={14} className="text-blue-500" /> 专家方案已激活
                            </div>
                          )}
                        </div>
                      );
                    })}
                 </div>
              </div>

              {false && pageData.id === 'home' && (
                <div className="mb-24">
                  <SectionHeader
                    title="生态入口"
                    desc="欧易 OKX Web3 钱包与 OKB 专题入口"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card-shadow p-8 flex flex-col items-start group hover:-translate-y-1 transition-all duration-300">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-6">
                        <Wallet size={24} />
                      </div>
                      <h3 className="text-2xl font-black mb-3">欧易钱包</h3>
                      <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                        进入 Web3 钱包页面，查看多链资产管理与去中心化使用指南。
                      </p>
                      <button
                        onClick={() => navigate('ouyi-wallet')}
                        className="mt-auto flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                      >
                        立即查看 <ChevronRight size={18} />
                      </button>
                    </div>
                    <div className="card-shadow p-8 flex flex-col items-start group hover:-translate-y-1 transition-all duration-300">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-6">
                        <BarChart3 size={24} />
                      </div>
                      <h3 className="text-2xl font-black mb-3">OKB 平台币</h3>
                      <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                        进入 OKB 专题页面，查看平台币权益、费率优惠与生态价值解析。
                      </p>
                      <button
                        onClick={() => navigate('okb')}
                        className="mt-auto flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                      >
                        立即查看 <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- SEO 文案深度区块 --- */}
              <div className="mb-24">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-8 flex items-center gap-3">
                      <ArrowUpDown className="text-blue-400" /> 核心功能与安全说明
                    </h3>
                    <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-lg space-y-6">
                      <Markdown>{pageData.content}</Markdown>
                    </div>
                  </div>
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                </div>
              </div>

              {/* --- FAQ / SEO 长尾内容 --- */}
              <div className="mb-24 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-black text-slate-900">{pageData.id === 'home' ? '常见问题 (FAQ)' : `${pageData.title.split(' - ')[0]} 常见问题`}</h3>
                  <p className="mt-4 text-slate-500">针对用户在搜索 {pageData.keywords.slice(0, 3).join('、')} 时关心的核心问题进行深度解答。</p>
                </div>
                <div className="space-y-4">
                  {(pageData.faqs || []).map((faq, i) => (
                    <div key={i} className="card-shadow p-8 hover:border-blue-100 transition-colors">
                      <h4 className="font-black text-slate-900 mb-4 flex gap-3 items-start leading-tight">
                        <span className="shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs flex items-center justify-center font-black">Q</span>
                        {faq.q}
                      </h4>
                      <div className="text-slate-500 text-sm leading-relaxed pl-11 relative">
                        <span className="absolute left-0 top-0 font-bold text-slate-300">回答：</span> 
                        {faq.a}
                      </div>
                    </div>
                  ))}
                </div>
                {pageData.id === 'home' && (
                  <div className="mt-8 text-center text-sm text-slate-500">
                    关于“欧易 / 欧意 / OKX / OKEx / 易欧 / o易 / 欧亿 / 殴易 / 欧交所”等称呼差异，可查看
                    <button
                      onClick={() => navigate('beginner/vs-ouyi')}
                      className="ml-1 font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                    >
                      品牌称呼说明
                    </button>
                    。
                  </div>
                )}
              </div>

              {/* --- LSI 关键词云 --- */}
              <div className="text-center pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">相关搜索:</span>
                {pageData.keywords.map((kw) => (
                  <span key={kw} className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    {kw}
                  </span>
                ))}
              </div>

                </>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <Footer onNavigate={navigate} locale={locale} />
      <BackToTop />
      <MobileStickyFooter>
        <button
          type="button"
          data-cta="true"
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-lg flex items-center justify-center transition-colors shadow-lg"
        >
          访问欧易OKX官网
        </button>
      </MobileStickyFooter>
    </div>
  );
}
