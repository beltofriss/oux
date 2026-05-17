import {Head, Html, Main, NextScript} from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/oux/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/oux/favicon-16x16.png" />
        <link rel="icon" href="/oux/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/oux/favicon-32x32.png" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="bd4538e6-5aba-44dc-843f-9448e7246402"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
