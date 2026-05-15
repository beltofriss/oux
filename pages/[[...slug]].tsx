import type {GetStaticPaths, GetStaticProps} from 'next';
import App from '../src/App';
import {PAGES} from '../src/constants';

export default function CatchAllPage() {
  return <App />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = Object.keys(PAGES);
  const paths: Array<{params: {slug?: string[]}}> = [{params: {slug: []}}, {params: {slug: ['zh-hant']}}];

  for (const id of ids) {
    if (id === 'home') continue;
    const slug = id.split('/').filter(Boolean);
    paths.push({params: {slug}});
    paths.push({params: {slug: ['zh-hant', ...slug]}});
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
