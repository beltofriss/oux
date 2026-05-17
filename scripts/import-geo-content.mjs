#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceConstantsPath = path.resolve(
  rootDir,
  "..",
  "ouxcex.com-bluestyle",
  "src",
  "constants.ts",
);
const contentDir = "E:\\okx content\\ds\\ouyi-ds-geo";
const constantsPath = path.join(rootDir, "src", "constants.ts");
const siteBasePath = "/oux";
const beginnerRoot = "ouyi-beginner";
const fileToSlug = (fileName) => {
  const base = fileName.replace(/\.md(?:\.md)?$/i, "").replace(/^ouyi-/, "");
  if (base === "beginner-guide") return beginnerRoot;
  return `${beginnerRoot}/${base}`;
};
const toTitleCase = (slug) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
const escapeText = (value) => JSON.stringify(value);
const readMarkdown = (filePath) =>
  fs
    .readFileSync(filePath, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .trim();
const relatedLinkTargets = new Map([
  ["欧易新手完整教程", beginnerRoot],
  ["欧易手续费多少？", `${beginnerRoot}/fee`],
  ["欧易新手买什么币好？", `${beginnerRoot}/buy-first-coin`],
  ["欧易C2C安全吗？防冻卡技巧", `${beginnerRoot}/c2c-safe`],
  ["欧易安卓下载安装教程", `${beginnerRoot}/android-download-guide`],
  ["欧易新手赚币高息指南", `${beginnerRoot}/earn-guide`],
  ["欧易新人注册奖励攻略", `${beginnerRoot}/reward-guide`],
  ["欧易谷歌验证怎么绑定？", `${beginnerRoot}/security`],
  ["欧易资金账户和交易账户区别？", `${beginnerRoot}/account-transfer`],
  ["欧易合约杠杆适合新手吗？", `${beginnerRoot}/leverage-warning`],
  ["欧易模拟交易是什么？", `${beginnerRoot}/simulate-trade`],
  ["欧易/欧意别名澄清", `${beginnerRoot}/vs-ouyi`],
]);
const fillEmptyRelatedLinks = (value) =>
  value.replace(/\[([^\]]+)\]\(\s*\)/g, (match, label) => {
    const target = relatedLinkTargets.get(label.trim());
    if (!target) return label;
    return `[${label}](${siteBasePath}/${target}/)`;
  });
const prefixInternalLinks = (value) =>
  value.replace(
    /\]\((\/(?!\/|oux\/)[^)#?]+\/?)([#?][^)]*)?\)/g,
    (_, linkPath, suffix = "") => {
      const normalized = linkPath.replace(/\/+$/, "");
      return `](${siteBasePath}${normalized}/${suffix})`;
    },
  );
const cleanTitle = (value) =>
  value
    .replace(/^欧易\/欧意/, "欧易")
    .replace(/^欧意是什么？和欧易有什么关系？/, "欧易和欧意是什么关系？");
const softenHomeCopy = (value) =>
  value
    .replace(/\r\n/g, "\n")
    .replace(
      "title: '欧易下载中心 - 欧意OKX版本下载 (手机版/安卓/苹果/电脑)_o易交易所'",
      "title: '欧易下载入口 - 欧意OKX App 下载与安装入口 (手机版/安卓/苹果/电脑)_o易交易所'",
    )
    .replace(
      "description: '欧易下载中心提供最新版欧易OKX App下载安装，支持安卓、苹果IOS、电脑全平台。整理多端下载与安装路径。'",
      "description: '欧易下载入口整理欧易OKX App 下载、安卓安装、苹果与电脑端访问方式，方便用户按设备选择常用访问入口。'",
    )
    .replace(
      `content: \`欧易（OKX）作为全球领先的数字资产服务平台，自 2017 年成立以来，始终致力于为全球数千万用户提供安全、稳定、可靠的加密货币交易与管理服务。作为欧易OKX下载信息整理页，我们通过全球分布的边缘节点构筑了冗余分发链路，旨在为用户提供一个 便于按设备核验和选择的访问入口。 ### 多端入口与设备选择
无论是在极度波动的行情下进行瞬时下单，还是进行深度的 K 线分析，欧易 App 都能保持极佳的响应速度。我们分发的每一个安卓 APK 包、iOS 教程及桌面客户端，均直接同步自欧易全球核心仓，确保文件原始签名未被改动。 ### 资产安全的源头保障
在虚标、仿冒 App 较多的环境下，下载前先核对 App 名称、页面域名和安装包来源。本页整理常用访问入口与安全核验步骤，方便用户在安装和登录前逐项检查。\``,
      `content: \`本页围绕欧易OKX App 下载、网页访问、安卓安装、苹果与电脑端使用方式进行整理，帮助用户按设备快速找到对应入口，并在安装和登录前完成必要核验。 ### 常用访问入口与设备选择
不同设备适合的访问方式并不相同。安卓用户通常需要关注安装包来源与系统拦截提示，苹果用户需要确认 App Store 区域与账户状态，电脑用户则更适合从网页版或桌面客户端入口开始。 ### 安装前的安全核验
在下载安装或登录前，建议核对页面域名、App 名称、开发者信息与账户安全设置。不要向任何页面或客服提供助记词、验证码、资金密码或私钥。\``,
    )
    .replace(
      "{ q: '这里的欧易下载链接怎么核对？', a: '不这样表述。下载和安装前请自行核对 App 名称、页面域名和账户安全设置。' }",
      "{ q: '这个页面主要解决什么问题？', a: '本页主要整理欧易OKX的常用访问入口、App 下载路径、安卓安装说明、苹果与电脑端访问方式。' }",
    )
    .replace(
      "{ q: '从首页进入注册有什么需要注意？', a: '是的。注册前先确认手机号或邮箱可用，完成身份认证后再使用买币等功能。' }",
      "{ q: '下载前需要注意什么？', a: '建议先核对页面域名、App 名称、开发者信息与账户安全设置，不要向任何页面或客服提供助记词、验证码、资金密码或私钥。' }",
    )
    .replace(
      "{ q: '如果常用入口打不开，怎么重新找到下载入口？', a: '建议先核对页面域名和 App 名称，再从常用入口、网页端或设备对应页面重新进入。' }",
      "{ q: '不同设备应该怎么选择入口？', a: '安卓、苹果、电脑端和不同国产机型的安装路径可能不同，建议按设备进入对应页面查看说明。' }",
    )
    .replace(
      "{ q: '下载后无法安装提示“报毒”是怎么回事？', a: '这是国产手机系统固有的防御机制。由于加密货币软件未上架特定应用商店，系统会默认提示风险。请放心忽略并点击“仍要安装”。' }",
      "{ q: '安装后无法打开或提示风险怎么办？', a: '先确认来源、设备系统限制和浏览器提示，再按对应设备页面逐项排查；涉及资产操作时务必谨慎核验。' }",
    );
const extractPage = (fileName) => {
  const filePath = path.join(contentDir, fileName);
  const raw = readMarkdown(filePath);
  const slug = fileToSlug(fileName);
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title = cleanTitle(
    titleMatch?.[1]?.trim() ||
      `欧易 ${toTitleCase(slug.split("/").pop() || "")}`,
  );
  const body = prefixInternalLinks(
    fillEmptyRelatedLinks(raw.replace(/^#\s+.+\n?/, "").trim()),
  );
  const description =
    body
      .split(/\n+/)
      .map((line) => line.replace(/^#+\s+/, "").trim())
      .find(
        (line) => line && !line.startsWith("---") && !line.startsWith("|"),
      ) || `${title}，面向欧易新手用户整理常见问题、操作路径和风险提醒。`;
  const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) =>
    match[1].trim(),
  );
  const faqs = headings
    .filter((heading) => /[?？]/.test(heading))
    .slice(0, 6)
    .map((heading) => ({
      q: heading,
      a: `可以先看页面里的“${heading.replace(/[?？]+$/, "")}”部分，里面按实际操作和常见情况拆开说明。`,
    }));
  return {
    id: slug,
    title,
    breadcrumbName:
      slug === beginnerRoot
        ? "新手入门"
        : title.replace(/^欧易/, "").slice(0, 18).trim() || "教程",
    parentId: slug === beginnerRoot ? "home" : beginnerRoot,
    keywords: [
      "欧易",
      "欧易OKX",
      "OKX",
      title.replace(/[：?？].*$/, "").slice(0, 24),
    ],
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
const beginnerPage = importedPages.find((page) => page.id === beginnerRoot);
const childPages = importedPages.filter((page) => page.id !== beginnerRoot);
if (!beginnerPage) {
  throw new Error(`Missing ouyi-beginner-guide.md for /${beginnerRoot}/ page.`);
}
const articleLinks = childPages
  .map((page) => `- [${page.title}](${siteBasePath}/${page.id}/)`)
  .join("\n");
beginnerPage.content = `${beginnerPage.content}\n\n## 欧易新手专题目录\n\n${articleLinks}`;
beginnerPage.faqs = [
  {
    q: "欧易OKX新手应该先看哪篇？",
    a: "建议先阅读新手入门页，再按注册、安全、C2C、资金划转、提现和 Web3 钱包的顺序阅读。",
  },
  {
    q: "欧易和欧意有什么区别？",
    a: "欧易是常用中文名称，欧意多为用户搜索时的误写或别称，本站统一以欧易和欧易OKX组织内容。",
  },
  ...beginnerPage.faqs,
].slice(0, 8);
beginnerPage.features = [
  {
    title: "账户安全",
    desc: "先完成谷歌验证、资金密码、提现白名单和防钓鱼码。",
    icon: "ShieldCheck",
    navId: `${beginnerRoot}/security`,
  },
  {
    title: "资金划转",
    desc: "理解 C2C 买 U、资金账户、交易账户和提现的关系。",
    icon: "BarChart3",
    navId: `${beginnerRoot}/account-transfer`,
  },
  {
    title: "Web3钱包",
    desc: "区分交易所账户和链上钱包，避免助记词与转账风险。",
    icon: "Wallet",
    navId: `${beginnerRoot}/web3`,
  },
];
const pages = [beginnerPage, ...childPages];
const pageBlock = pages
  .map((page) => {
    const features = page.features
      ? `,\n features: [\n${page.features.map((feature) => ` { title: ${escapeText(feature.title)}, desc: ${escapeText(feature.desc)}, icon: ${feature.icon}, navId: ${escapeText(feature.navId)} }`).join(",\n")}\n ]`
      : "";
    return ` ${escapeText(page.id)}: { id: ${escapeText(page.id)}, title: ${escapeText(page.title)}, breadcrumbName: ${escapeText(page.breadcrumbName)}, parentId: ${escapeText(page.parentId)}, keywords: ${JSON.stringify(page.keywords, null, 6).replace(/\n/g, "\n ")}, description: ${escapeText(page.description)}, content: ${escapeText(page.content)}, faqs: ${JSON.stringify(page.faqs, null, 6).replace(/\n/g, "\n ")}${features} }`;
  })
  .join(",\n");
const source = softenHomeCopy(
  fs.readFileSync(sourceConstantsPath, "utf8"),
).replace(/\s+$/, "");
if (!/\n};$/.test(source)) {
  throw new Error(
    `Could not find closing PAGES export in ${sourceConstantsPath}`,
  );
}
const output = source.replace(/\n};$/, `\n${pageBlock}\n};\n`);
fs.writeFileSync(constantsPath, output, "utf8");
console.log(
  `Restored base site structure and appended ${pages.length} beginner pages from ${contentDir}`,
);
