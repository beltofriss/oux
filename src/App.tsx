/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, ReactNode } from "react";
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
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { useRouter } from "next/router";
import Head from "next/head";
import { type PageData } from "./constants";
import {
  buildPathForLocale,
  getPagesByLocale,
  localizeText,
  resolveLocaleFromPath,
  stripLocalePrefix,
  toHtmlLang,
  type Locale,
} from "./i18n";
import BackToTop from "./components/BackToTop";
import MobileStickyFooter from "./components/MobileStickyFooter";

const CANONICAL_ORIGIN = "https://beltofriss.github.io/oux";
const SITE_BASE_PATH = "/oux";

const stripSiteBasePath = (pathname: string) => {
  if (pathname === SITE_BASE_PATH) return "/";
  if (pathname.startsWith(`${SITE_BASE_PATH}/`)) {
    return pathname.slice(SITE_BASE_PATH.length) || "/";
  }
  return pathname;
};

const toCanonicalPath = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
};

const toLocalizedInternalHref = (href: string | undefined, locale: Locale) => {
  if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return href;

  const match = href.match(/^([^?#]*)([?#].*)?$/);
  const pathPart = match?.[1] || href;
  const suffix = match?.[2] || "";
  if (!pathPart.startsWith("/")) return href;

  const withoutBase = stripSiteBasePath(pathPart);
  const sourceLocale = resolveLocaleFromPath(withoutBase);
  const withoutLocale = stripLocalePrefix(withoutBase, sourceLocale);
  const pageId =
    withoutLocale === "/" || withoutLocale === ""
      ? "home"
      : withoutLocale.replace(/^\/+|\/+$/g, "");

  return `${SITE_BASE_PATH}${buildPathForLocale(pageId, locale)}${suffix}`;
};

const getHeroTitleParts = (rawTitle: string) => {
  const stripTail = (text: string) =>
    text
      .replace(/(_o[^_\s]+)\s*$/u, "")
      .replace(/\s*\|\s*o[^|\s]+$/u, "")
      .trim();

  const source = stripTail(rawTitle.trim());
  let main = source;
  let sub = "";

  const dashIndex = source.indexOf(" - ");
  const cnColonIndex = source.indexOf("\uFF1A");
  const enColonIndex = source.indexOf(":");
  const splitIndex =
    dashIndex >= 0
      ? dashIndex
      : cnColonIndex >= 0
        ? cnColonIndex
        : enColonIndex >= 0
          ? enColonIndex
          : -1;

  if (splitIndex >= 0) {
    const separator =
      source.slice(splitIndex, splitIndex + 3) === " - "
        ? " - "
        : source[splitIndex];
    const [left, ...rest] = source.split(separator);
    main = (left || source).trim();
    sub = rest.join(separator).trim();
  }

  sub = sub.replace(/^\u6B27\u610FOKX\s*/u, "").trim();
  return { main, sub };
};

// --- 子组件 ---

const Breadcrumbs = ({
  currentPath,
  onNavigate,
  pages,
  compact = false,
}: {
  currentPath: string;
  onNavigate: (path: string) => void;
  pages: Record<string, PageData>;
  compact?: boolean;
}) => {
  if (currentPath === "home") return null;

  const crumbs = [];
  let temp = pages[currentPath];
  while (temp) {
    crumbs.unshift(temp);
    temp = temp.parentId ? pages[temp.parentId] : undefined;
  }

  // Ensure home is at the base
  if (crumbs[0]?.id !== "home") {
    crumbs.unshift(pages["home"]);
  }

  return (
    <nav
      className={`flex items-center gap-1 text-xs md:text-sm text-slate-400 font-bold ${compact ? "mb-6" : "mb-10"}`}
    >
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          {index > 0 && (
            <ChevronRight
              size={14}
              className="mx-1 text-slate-400"
              strokeWidth={3}
            />
          )}
          <button
            onClick={() => onNavigate(crumb.id)}
            className={`hover:text-blue-600 transition-colors uppercase tracking-wider ${index === crumbs.length - 1 ? "text-slate-600 cursor-default pointer-events-none" : ""}`}
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
    { label: "首页", id: "home" },
    { label: "电脑版", id: "ouyi-pc" },
    { label: "网页版", id: "ouyi-web" },
    {
      label: "安卓",
      id: "ouyi-anzhuo",
      children: [
        { label: "华为专区", id: "ouyi-huawei" },
        { label: "小米专区", id: "ouyi-xiaomi" },
        { label: "OPPO专区", id: "ouyi-oppo" },
        { label: "一加专区", id: "ouyi-oneplus" },
        { label: "真我专区", id: "ouyi-realme" },
        { label: "VIVO专区", id: "ouyi-vivo" },
        { label: "荣耀专区", id: "ouyi-honor" },
        { label: "魅族专区", id: "ouyi-meizu" },
        { label: "三星专区", id: "ouyi-samsung" },
        { label: "酷派专区", id: "ouyi-coolpad" },
        { label: "夸克专区", id: "ouyi-quark" },
        { label: "全部机型", id: "ouyi-anzhuo", isDivider: true },
      ],
    },
    { label: "华为", id: "ouyi-huawei" },
    { label: "苹果", id: "ouyi-ios" },
    { label: "注册教程", id: "ouyi-zhuce" },
    { label: "新手入门", id: "ouyi-beginner" },
    {
      label: "常见教程",
      id: "ouyi-beginner",
      children: [
        { label: "安卓下载", id: "ouyi-beginner/android-download-guide" },
        { label: "手续费", id: "ouyi-beginner/fee" },
        { label: "账户安全", id: "ouyi-beginner/security" },
        { label: "提现提币", id: "ouyi-beginner/withdraw-faq" },
        { label: "Web3钱包", id: "ouyi-beginner/web3" },
        { label: "全部专题", id: "ouyi-beginner", isDivider: true },
      ],
    },
  ];
  const t = (text: string) => localizeText(text, locale);

  return (
    <nav className="fixed top-0 w-full z-50 relative overflow-visible bg-white/95 backdrop-blur-md border-b border-slate-100 h-16 sm:h-20 flex items-center">
      <div className="section-container w-full min-w-0 flex justify-between items-center gap-2">
        <div
          className="flex items-center cursor-pointer min-w-0"
          onClick={() => onNavigate("home")}
        >
          <div className="bg-slate-950 text-white p-1.5 rounded-lg mr-2 shrink-0">
            <Shield size={24} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 truncate">
            {t("欧易下载入口")}
          </span>
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
                  currentPath === item.id ||
                  item.children?.some((c) => c.id === currentPath)
                    ? "text-blue-600"
                    : "text-slate-500"
                }`}
              >
                {t(item.label)}
                {item.children && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeDropdown === item.id ? "rotate-180" : ""}`}
                  />
                )}
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
                          onClick={() => {
                            onNavigate(child.id);
                            setActiveDropdown(null);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-[13px] font-bold transition-all hover:bg-blue-50 ${
                            child.isDivider
                              ? "text-blue-600 border-t border-slate-50 mt-1 pt-3"
                              : "text-slate-600 hover:text-blue-600"
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
            aria-label={t("语言切换")}
            data-cta="false"
          >
            <option value="zh-Hans">{t("简体")}</option>
            <option value="zh-Hant">{t("繁體")}</option>
          </select>
          <a
            href={`${SITE_BASE_PATH}/ouyi-xiazai/`}
            data-cta="true"
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all"
          >
            {t("访问欧易OKX")}
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
            style={{ WebkitOverflowScrolling: "touch" }}
            data-cta="false"
          >
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 border-b border-slate-100 pb-3 last:border-0"
              >
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
                      currentPath === item.id
                        ? "text-blue-600"
                        : "text-slate-900"
                    }`}
                    data-cta="false"
                  >
                    <span className="leading-snug whitespace-normal break-words">
                      {t(item.label)}
                    </span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setActiveDropdown(
                          activeDropdown === item.id ? null : item.id,
                        );
                      }}
                      className={`w-full text-left text-base font-black py-2.5 flex items-center justify-between ${
                        currentPath === item.id
                          ? "text-blue-600"
                          : "text-slate-900"
                      }`}
                      data-cta="false"
                    >
                      <span className="leading-snug whitespace-normal break-words">
                        {t(item.label)}
                      </span>
                      <ChevronDown
                        size={18}
                        className={
                          activeDropdown === item.id ? "rotate-180" : ""
                        }
                      />
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
              <label className="block text-xs font-bold text-slate-400 mb-2">
                {t("语言")}
              </label>
              <select
                value={locale}
                onChange={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSwitchLocale(event.target.value as Locale);
                  setIsOpen(false);
                }}
                className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label={t("语言切换")}
                data-cta="false"
              >
                <option value="zh-Hans">{t("简体")}</option>
                <option value="zh-Hant">{t("繁體")}</option>
              </select>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100 italic text-[10px] text-slate-400">
              常用访问入口 @ {currentYear}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeader = ({ title, desc }: { title: string; desc?: string }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
      {title}
    </h2>
    {desc && (
      <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">{desc}</p>
    )}
  </div>
);

const articleMarkdownComponents = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-12 mb-5 border-l-4 border-blue-600 pl-4 text-2xl md:text-3xl font-black leading-snug text-slate-950">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-8 mb-3 text-xl font-black leading-snug text-slate-900">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-4 text-base leading-8 text-slate-600">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-4 space-y-2 pl-6 list-disc text-slate-600">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-4 space-y-2 pl-6 list-decimal text-slate-600">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-8">{children}</li>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-black text-slate-900">{children}</strong>
  ),
  hr: () => <hr className="my-10 border-slate-100" />,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} className="font-bold text-blue-600 hover:text-blue-700">
      {children}
    </a>
  ),
};

const commonEntryLinks = [
  { label: "首页", id: "home" },
  { label: "下载入口", id: "ouyi-xiazai" },
  { label: "电脑版", id: "ouyi-pc" },
  { label: "网页版", id: "ouyi-web" },
  { label: "安卓", id: "ouyi-anzhuo" },
  { label: "苹果", id: "ouyi-ios" },
  { label: "注册教程", id: "ouyi-zhuce" },
  { label: "新手入门", id: "ouyi-beginner" },
];

const CommonEntryLinks = ({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  locale: Locale;
  onNavigate: (path: string) => void;
}) => (
  <div className="mb-16 border-y border-slate-100 py-10">
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="mr-2 text-sm font-black text-slate-500">常用入口</span>
      {commonEntryLinks.map((link) => (
        <button
          key={link.id}
          onClick={() => onNavigate(link.id)}
          className={`rounded-full border px-5 py-2 text-sm font-black transition-colors ${
            currentPath === link.id
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
          }`}
        >
          {link.label}
        </button>
      ))}
    </div>
  </div>
);

const beginnerRelated = [
  { label: "欧易新手完整教程", id: "ouyi-beginner" },
  { label: "资金账户和交易账户区别", id: "ouyi-beginner/account-transfer" },
  { label: "第一笔买币怎么操作", id: "ouyi-beginner/buy-first-coin" },
  { label: "C2C 买币安全", id: "ouyi-beginner/c2c-safe" },
  { label: "提现提币问题", id: "ouyi-beginner/withdraw-faq" },
  { label: "账户安全设置", id: "ouyi-beginner/security" },
];

const BeginnerRelatedLinks = ({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  locale: Locale;
  onNavigate: (path: string) => void;
}) => {
  const links = beginnerRelated
    .filter((link) => link.id !== currentPath)
    .slice(0, 3);
  return (
    <div className="mb-16 max-w-4xl mx-auto rounded-[1.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <h3 className="mb-5 text-lg font-black text-slate-900">相关阅读：</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm font-black text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-50"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const beginnerQuickTopics = [
  {
    title: "账户先过认证",
    desc: "不完成身份认证，C2C 买币、提现等入口通常会受限。",
    navId: "ouyi-zhuce",
  },
  {
    title: "第一笔先买 USDT",
    desc: "先理解 USDT、C2C 订单和付款备注，再考虑买其他币。",
    navId: "ouyi-beginner/buy-first-coin",
  },
  {
    title: "买完要划转",
    desc: "C2C 买入后通常在资金账户，交易前要划到交易账户。",
    navId: "ouyi-beginner/account-transfer",
  },
  {
    title: "安全设置先做",
    desc: "谷歌验证、资金密码、白名单和防钓鱼码建议尽早设置。",
    navId: "ouyi-beginner/security",
  },
];

const beginnerTopicGrid = [
  { title: "安卓下载安装", navId: "ouyi-beginner/android-download-guide" },
  { title: "C2C 买币安全", navId: "ouyi-beginner/c2c-safe" },
  { title: "手续费说明", navId: "ouyi-beginner/fee" },
  { title: "提现提币", navId: "ouyi-beginner/withdraw-faq" },
  { title: "杠杆风险", navId: "ouyi-beginner/leverage-warning" },
  { title: "Web3 钱包", navId: "ouyi-beginner/web3" },
];

const BeginnerIndexContent = ({
  pageData,
  onNavigate,
  markdownComponents,
}: {
  pageData: PageData;
  onNavigate: (path: string) => void;
  markdownComponents: typeof articleMarkdownComponents;
}) => (
  <div className="mb-16 space-y-12">
    <section className="rounded-[2rem] border border-blue-100 bg-blue-50/60 p-8 md:p-10">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-slate-950">
          新手先理解这几件事
        </h2>
        <p className="mt-3 text-slate-500">
          欧易新手，先把认证、买 U、划转和安全设置弄清楚。
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-4">
        {beginnerQuickTopics.map((item, index) => (
          <button
            key={item.title}
            onClick={() => onNavigate(item.navId)}
            className="rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <div className="mb-4 text-3xl font-black text-blue-200">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="mb-2 text-lg font-black text-slate-950">
              {item.title}
            </h3>
            <p className="text-sm leading-6 text-slate-500">{item.desc}</p>
          </button>
        ))}
      </div>
    </section>

    <section className="grid gap-4 md:grid-cols-3">
      {beginnerTopicGrid.map((item) => (
        <button
          key={item.navId}
          onClick={() => onNavigate(item.navId)}
          className="rounded-2xl border border-slate-100 bg-white p-5 text-left font-black text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
        >
          {item.title}
        </button>
      ))}
    </section>

    <article className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-sm">
      <Markdown components={markdownComponents}>{pageData.content}</Markdown>
    </article>
  </div>
);

const Footer = ({
  onNavigate,
  locale,
}: {
  onNavigate: (path: string) => void;
  locale: Locale;
}) => {
  const currentYear = new Date().getFullYear();
  const t = (text: string) => localizeText(text, locale);

  const footLinks = {
    software: [
      { label: "手机端下载", id: "ouyi-app" },
      { label: "安卓版软件", id: "ouyi-anzhuo" },
      { label: "苹果版软件", id: "ouyi-ios" },
      { label: "电脑客户端", id: "ouyi-pc" },
      { label: "全部下载地址", id: "ouyi-xiazai" },
    ],
    brands: [
      { label: "华为/鸿蒙专区", id: "ouyi-huawei" },
      { label: "小米/澎湃专区", id: "ouyi-xiaomi" },
      { label: "OPPO/一加专区", id: "ouyi-oppo" },
      { label: "VIVO/真我专区", id: "ouyi-vivo" },
      { label: "荣耀/魅族专区", id: "ouyi-honor" },
      { label: "三星/酷派专区", id: "ouyi-samsung" },
      { label: "查看全部机型 >", id: "ouyi-anzhuo" },
    ],
    support: [
      { label: "账号注册教程", id: "ouyi-zhuce" },
      { label: "欧易交易所介绍", id: "ouyi-jiaoyisuo" },
      { label: "去中心化钱包", id: "ouyi-wallet" },
      { label: "OKB 平台币", id: "okb" },
      { label: "品牌称呼说明", id: "ouyi-brand-names" },
      { label: "网页版入口", id: "ouyi-web" },
      { label: "夸克/UC 访问专项", id: "ouyi-quark" },
      { label: "欧易 vs 币安", id: "ouyi-vs-bian" },
    ],
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center mb-6">
              <div className="bg-slate-950 text-white p-1.5 rounded-lg mr-2">
                <Shield size={24} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                欧易下载入口
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 pr-4 font-medium opacity-80">
              整理欧易OKX App
              下载、网页访问、安卓安装、电脑端使用和常见设备路径，方便用户按自己的设备选择入口。
            </p>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm italic text-[11px] text-slate-400 leading-normal">
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={16}
                  className="text-blue-500 shrink-0 mt-0.5"
                />
                <p>
                  本站为第三方信息整理页面，仅汇总常用访问入口与安装说明。登录、下载和资产操作前，请自行核对页面域名、App
                  名称与账户安全设置。
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">
                {t("软件下载")}
              </h4>
              <ul className="space-y-4">
                {footLinks.software.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onNavigate(link.id)}
                      className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors"
                    >
                      {t(link.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">
                {t("品牌指引")}
              </h4>
              <ul className="space-y-4">
                {footLinks.brands.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onNavigate(link.id)}
                      className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors text-left"
                    >
                      {t(link.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">
                {t("使用支持")}
              </h4>
              <ul className="space-y-4">
                {footLinks.support.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onNavigate(link.id)}
                      className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors text-left"
                    >
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
            © {currentYear} 欧易下载入口.
            常用访问与安装信息整理，仅限技术交流与参考。
          </p>
          <div className="flex gap-4 md:gap-8 text-[9px] text-slate-300 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Shield size={10} className="text-blue-400" /> Access Notes
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={10} className="text-blue-400" /> User Check
            </span>
            <span className="flex items-center gap-1">
              <Zap size={10} className="text-blue-400" /> Updated
            </span>
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
    if (typeof window !== "undefined") {
      return stripSiteBasePath(window.location.pathname || "/");
    }
    const raw = (router.asPath || "/").split("?")[0].split("#")[0];
    return stripSiteBasePath(raw || "/");
  }, [router.asPath, router.isReady]);
  const locale = useMemo<Locale>(
    () => resolveLocaleFromPath(pathname),
    [pathname],
  );
  const localizedPath = useMemo(
    () => stripLocalePrefix(pathname, locale),
    [pathname, locale],
  );
  const normalizedPath = localizedPath.replace(/\/+$/, "");
  const requestedPath =
    normalizedPath === "" || normalizedPath === "/"
      ? "home"
      : normalizedPath.slice(1);
  const pages = useMemo(() => getPagesByLocale(locale), [locale]);
  const isNotFound = requestedPath !== "home" && !pages[requestedPath];
  const currentPath = isNotFound ? "home" : requestedPath;
  const pageData = useMemo(
    () => pages[currentPath] || pages["home"],
    [currentPath, pages],
  );
  const heroTitle = useMemo(
    () => getHeroTitleParts(pageData.title),
    [pageData.title],
  );
  const t = (text: string) => localizeText(text, locale);
  const isBeginnerArticle = pageData.id.startsWith("ouyi-beginner/");
  const isBeginnerIndex = pageData.id === "ouyi-beginner";
  const isBeginnerPage = isBeginnerIndex || isBeginnerArticle;
  const isPrimaryPage = !pageData.id.includes("/");
  const markdownComponents = useMemo(
    () => ({
      ...articleMarkdownComponents,
      a: ({ href, children }: { href?: string; children?: ReactNode }) => (
        <a
          href={toLocalizedInternalHref(href, locale)}
          className="font-bold text-blue-600 hover:text-blue-700"
        >
          {children}
        </a>
      ),
    }),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = toHtmlLang(locale);
    window.scrollTo(0, 0);
  }, [locale, pathname]);

  const currentCanonicalPath = isNotFound
    ? toCanonicalPath(pathname)
    : toCanonicalPath(buildPathForLocale(currentPath, locale));
  const canonicalUrl = `${CANONICAL_ORIGIN}${currentCanonicalPath}`;
  const hansUrl = `${CANONICAL_ORIGIN}${buildPathForLocale(currentPath, "zh-Hans")}`;
  const hantUrl = `${CANONICAL_ORIGIN}${buildPathForLocale(currentPath, "zh-Hant")}`;

  const beginnerSuffix = locale === "zh-Hant" ? " | 歐意OKX" : " | 欧意OKX";
  const metaTitle = isNotFound
    ? t("404 - 页面不存在 | 欧易下载入口")
    : isBeginnerPage
    ? `${pageData?.title}${beginnerSuffix}`
    : pageData?.title;
  const metaDescription = isNotFound
    ? t("您访问的页面不存在，请返回欧易下载入口继续浏览。")
    : pageData?.description;
  const metaKeywords = isNotFound
    ? t("404,页面不存在,欧易下载入口")
    : pageData?.keywords?.join(", ");
  const metaRobots = isNotFound ? "noindex,follow" : "index,follow";

  useEffect(() => {
    if (locale !== "zh-Hant") return;
    const root = document.body;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const textNode = node as Text;
      const parentTag = textNode.parentElement?.tagName;
      if (
        parentTag !== "SCRIPT" &&
        parentTag !== "STYLE" &&
        textNode.nodeValue
      ) {
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
      <Navbar
        onNavigate={navigate}
        onSwitchLocale={switchLocale}
        currentPath={currentPath}
        locale={locale}
      />

      <main className="pt-20 lg:pt-24 pb-24 lg:pb-0">
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
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                    404
                  </h1>
                  <p className="text-base md:text-lg text-slate-500 mb-8 max-w-2xl leading-relaxed">
                    页面不存在或链接已失效，请返回首页继续访问独立页面入口。
                  </p>
                  <button
                    onClick={() => navigate("home")}
                    className="btn-primary !py-3 !px-8"
                    data-cta="false"
                  >
                    返回首页
                  </button>
                </div>
              ) : (
                <>
                  <Breadcrumbs
                    currentPath={currentPath}
                    onNavigate={navigate}
                    pages={pages}
                    compact={isBeginnerPage}
                  />

                  {/* --- Hero 区域 --- */}
                  <div
                    className={`grid grid-cols-1 ${isBeginnerPage ? "mb-10 lg:mb-14" : "mb-14 lg:mb-20"}`}
                  >
                    <div
                      className={`${isPrimaryPage ? "mx-auto text-center" : ""} max-w-4xl`}
                    >
                      <h1 className="flex flex-col gap-2 md:gap-4 mb-8">
                        <span className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                          {heroTitle.main}
                        </span>
                        {heroTitle.sub && (
                          <span className="text-lg md:text-2xl lg:text-3xl font-medium text-blue-600/80 leading-tight">
                            {heroTitle.sub}
                          </span>
                        )}
                      </h1>
                      <p
                        className={`text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-xl ${isPrimaryPage ? "mx-auto" : ""}`}
                      >
                        {pageData.description}
                      </p>

                      <div
                        className={`flex flex-col sm:flex-row gap-4 mb-8 ${isPrimaryPage ? "justify-center" : ""}`}
                      >
                        <button
                          onClick={() => navigate("ouyi-xiazai")}
                          className="btn-primary group !py-3"
                          data-cta="true"
                        >
                          <Download
                            size={18}
                            className="group-hover:translate-y-0.5 transition-transform"
                          />
                          {pageData.id === "ouyi-xiazai"
                            ? "访问欧易OKX"
                            : "欧易OKX入口"}
                        </button>
                        <button
                          onClick={() => navigate("ouyi-zhuce")}
                          className="btn-secondary !py-3 !bg-slate-200 hover:!bg-slate-300"
                          data-cta="true"
                        >
                          <UserPlus size={18} /> 快速注册开户
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* --- 品牌快速入口 (已移除，功能整合至上方主要入口卡片) --- */}

                  {/* --- 核心特性或多端导航 --- */}
                  {!isBeginnerArticle && !isBeginnerIndex && (
                    <div className="mb-24">
                      <SectionHeader
                        title={
                          pageData.id === "home"
                            ? "多端平台全覆盖"
                            : `${pageData.breadcrumbName}相关入口`
                        }
                        desc={
                          pageData.id === "home"
                            ? "汇总常用访问入口，按安卓、苹果、电脑端和常见国产机型选择安装方式。"
                            : `整理 ${pageData.breadcrumbName} 的访问方式、安装步骤和常见问题。`
                        }
                      />
                      <div
                        className={`grid grid-cols-1 ${
                          (pageData.features?.length || 3) === 3
                            ? "md:grid-cols-3"
                            : (pageData.features?.length || 3) === 4
                              ? "md:grid-cols-2 lg:grid-cols-4"
                              : "md:grid-cols-2 lg:grid-cols-5"
                        } gap-8`}
                      >
                        {(
                          pageData.features || [
                            {
                              title: "手机端下载",
                              desc: "安卓与苹果全平台支持，按设备查看对应入口。",
                              icon: Smartphone,
                              navId: "ouyi-app",
                            },
                            {
                              title: "电脑端访问",
                              desc: "适合看盘、图表分析和长时间账户管理。",
                              icon: Monitor,
                              navId: "ouyi-pc",
                            },
                            {
                              title: "网页入口",
                              desc: "无需下载，整理常用网页访问方式。",
                              icon: Globe,
                              navId: "ouyi-web",
                            },
                          ]
                        ).map((f, i) => {
                          const Icon = f.icon;
                          return (
                            <button
                              key={i}
                              onClick={() => (f as any).navId && navigate((f as any).navId)}
                              className={`card-shadow p-8 flex flex-col items-start group hover:-translate-y-1 transition-all duration-300 text-left w-full${(f as any).navId ? " cursor-pointer" : ""}`}
                            >
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Icon size={24} />
                              </div>
                              <h3 className="text-2xl font-black mb-3">
                                {t(f.title)}
                              </h3>
                              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                                {t(f.desc)}
                              </p>
                              {(f as any).navId ? (
                                <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all">
                                  查看对应页面 <ChevronRight size={18} />
                                </div>
                              ) : (
                                <div className="mt-auto flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                  <ShieldCheck
                                    size={14}
                                    className="text-blue-500"
                                  />{" "}
                                  按设备入口查看
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {false && pageData.id === "home" && (
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
                            进入 Web3
                            钱包页面，查看多链资产管理与去中心化使用指南。
                          </p>
                          <button
                            onClick={() => navigate("ouyi-wallet")}
                            className="mt-auto flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                          >
                            立即查看 <ChevronRight size={18} />
                          </button>
                        </div>
                        <div className="card-shadow p-8 flex flex-col items-start group hover:-translate-y-1 transition-all duration-300">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-6">
                            <BarChart3 size={24} />
                          </div>
                          <h3 className="text-2xl font-black mb-3">
                            OKB 平台币
                          </h3>
                          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                            进入 OKB
                            专题页面，查看平台币权益、费率优惠与生态价值解析。
                          </p>
                          <button
                            onClick={() => navigate("okb")}
                            className="mt-auto flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                          >
                            立即查看 <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- SEO 文案深度区块 --- */}
                  {isBeginnerIndex ? (
                    <BeginnerIndexContent
                      pageData={pageData}
                      onNavigate={navigate}
                      markdownComponents={markdownComponents}
                    />
                  ) : isBeginnerArticle ? (
                    <div className="mb-16 max-w-4xl mx-auto">
                      <article className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-sm">
                        <Markdown components={markdownComponents}>
                          {pageData.content}
                        </Markdown>
                      </article>
                    </div>
                  ) : (
                    <div className="mb-24">
                      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-lg space-y-6">
                            <Markdown components={markdownComponents}>
                              {pageData.content}
                            </Markdown>
                          </div>
                        </div>
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                      </div>
                    </div>
                  )}

                  {/* --- FAQ / SEO 长尾内容 --- */}
                  {!isBeginnerArticle && !isBeginnerIndex && (
                    <div className="mb-24 max-w-4xl mx-auto">
                      <div className="text-center mb-12">
                        <h3 className="text-3xl font-black text-slate-900">
                          {pageData.id === "home"
                            ? "常见问题 (FAQ)"
                            : `${pageData.title.split(" - ")[0]} 常见问题`}
                        </h3>
                        <p className="mt-4 text-slate-500">
                          针对用户在搜索{" "}
                          {pageData.keywords.slice(0, 3).join("、")}{" "}
                          时关心的核心问题进行深度解答。
                        </p>
                      </div>
                      <div className="space-y-4">
                        {(pageData.faqs || []).map((faq, i) => (
                          <div
                            key={i}
                            className="card-shadow p-8 hover:border-blue-100 transition-colors"
                          >
                            <h4 className="font-black text-slate-900 mb-4 flex gap-3 items-start leading-tight">
                              <span className="shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs flex items-center justify-center font-black">
                                Q
                              </span>
                              {faq.q}
                            </h4>
                            <div className="text-slate-500 text-sm leading-relaxed pl-11 relative">
                              <span className="absolute left-0 top-0 font-bold text-slate-300">
                                回答：
                              </span>
                              {faq.a}
                            </div>
                          </div>
                        ))}
                      </div>
                      {pageData.id === "home" && (
                        <div className="mt-8 text-center text-sm text-slate-500">
                          关于“欧易 / 欧意 / OKX / OKEx / 易欧 / o易 / 欧亿 /
                          殴易 / 欧交所”等称呼差异，可查看
                          <button
                            onClick={() => navigate("ouyi-beginner/vs-ouyi")}
                            className="ml-1 font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                          >
                            品牌称呼说明
                          </button>
                          。
                        </div>
                      )}
                    </div>
                  )}

                  {isBeginnerArticle && (
                    <BeginnerRelatedLinks
                      currentPath={currentPath}
                      locale={locale}
                      onNavigate={navigate}
                    />
                  )}
                  <CommonEntryLinks
                    currentPath={currentPath}
                    locale={locale}
                    onNavigate={navigate}
                  />

                  {/* --- LSI 关键词云 --- */}
                  <div className="text-center pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">
                      相关搜索:
                    </span>
                    {pageData.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
                      >
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
          访问欧易OKX
        </button>
      </MobileStickyFooter>
    </div>
  );
}
