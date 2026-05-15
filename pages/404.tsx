import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';

export default function Custom404() {
  const router = useRouter();
  const asPath = (router.asPath || '').toLowerCase();
  const isHant = asPath.startsWith('/zh-hant');

  const title = isHant ? '404 - 頁面不存在 | 歐易下載中心' : '404 - 页面不存在 | 欧易下载中心';
  const desc = isHant
    ? '您訪問的頁面不存在，請返回歐易下載中心繼續瀏覽。'
    : '您访问的页面不存在，请返回欧易下载中心继续浏览。';
  const homeHref = isHant ? '/zh-hant' : '/';
  const heading = isHant ? '頁面不存在或連結已失效' : '页面不存在或链接已失效';
  const sub = isHant ? '您可返回首頁，繼續訪問各獨立下載頁面。' : '您可返回首页，继续访问各独立下载页面。';
  const btn = isHant ? '返回首頁' : '返回首页';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="card-shadow max-w-xl w-full p-10 text-center">
          <p className="text-5xl font-black text-slate-900 mb-5">404</p>
          <h1 className="text-2xl font-black text-slate-900 mb-3">{heading}</h1>
          <p className="text-slate-500 mb-8">{sub}</p>
          <Link href={homeHref} className="btn-primary inline-flex !py-3 !px-7">
            {btn}
          </Link>
        </div>
      </main>
    </>
  );
}
