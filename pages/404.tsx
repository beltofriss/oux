import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronRight, Shield } from "lucide-react";

type LinkItem = {
  label: string;
  href: string;
};

const hansLinks: LinkItem[] = [
  { label: "首页", href: "/" },
  { label: "欧易OKX入口", href: "/ouyi-xiazai/" },
  { label: "网页版入口", href: "/ouyi-web/" },
  { label: "安卓下载", href: "/ouyi-anzhuo/" },
  { label: "电脑版", href: "/ouyi-pc/" },
  { label: "注册开户", href: "/ouyi-zhuce/" },
  { label: "新手入门", href: "/ouyi-beginner/" },
  { label: "欧易交易所介绍", href: "/ouyi-jiaoyisuo/" },
];

const hantLinks: LinkItem[] = [
  { label: "首頁", href: "/zh-hant/" },
  { label: "歐易OKX入口", href: "/zh-hant/ouyi-xiazai/" },
  { label: "網頁版入口", href: "/zh-hant/ouyi-web/" },
  { label: "安卓下載", href: "/zh-hant/ouyi-anzhuo/" },
  { label: "電腦版", href: "/zh-hant/ouyi-pc/" },
  { label: "註冊開戶", href: "/zh-hant/ouyi-zhuce/" },
  { label: "新手入門", href: "/zh-hant/ouyi-beginner/" },
  { label: "歐易交易所介紹", href: "/zh-hant/ouyi-jiaoyisuo/" },
];

export default function Custom404() {
  const router = useRouter();
  const isHant = router.asPath.replace(/^\/oux/, "").startsWith("/zh-hant");
  const links = isHant ? hantLinks : hansLinks;

  const copy = isHant
    ? {
        lang: "zh-Hant",
        title: "404 - 頁面不存在 | 歐易OKX入口",
        heading: "頁面不存在或連結已失效",
        description:
          "可以從常用入口繼續訪問歐易OKX下載、網頁入口、註冊開戶和新手頁面。",
        section: "常用入口",
        hint: "如果是手動輸入網址，請先檢查拼寫；如果是站內連結，可以回到入口頁重新選擇。",
        related: ["歐易", "歐易OKX", "OKX", "歐易下載", "歐易新手"],
      }
    : {
        lang: "zh-CN",
        title: "404 - 页面不存在 | 欧易OKX入口",
        heading: "页面不存在或链接已失效",
        description:
          "可以从常用入口继续访问欧易OKX下载、网页入口、注册开户和新手页面。",
        section: "常用入口",
        hint: "如果是手动输入网址，请先检查拼写；如果是站内链接，可以回到入口页重新选择。",
        related: ["欧易", "欧易OKX", "OKX", "欧易下载", "欧易新手"],
      };

  return (
    <>
      <Head>
        <title>{copy.title}</title>
        <meta name="robots" content="noindex,follow" />
        <meta
          name="description"
          content={
            isHant
              ? "頁面不存在。可繼續訪問歐易OKX入口、網頁版、安卓下載、電腦版、註冊開戶和新手頁面。"
              : "页面不存在。可继续访问欧易OKX入口、网页版、安卓下载、电脑版、注册开户和新手页面。"
          }
        />
      </Head>

      <main
        className="min-h-screen bg-slate-50 px-5 py-12 text-slate-950 sm:py-16"
        lang={copy.lang}
      >
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Shield className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <span className="text-sm font-semibold tracking-wide text-blue-600">
              404
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black leading-tight sm:text-5xl">
              {copy.heading}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              {copy.description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold">{copy.section}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:text-blue-600 hover:shadow-sm"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-500">{copy.hint}</p>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
            {copy.related.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
