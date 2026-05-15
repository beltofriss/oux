import type {AppProps} from 'next/app';
import {GatewayProvider} from '../src/features/DownloadGateway/GatewayContext';
import '../src/index.css';

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <GatewayProvider>
      <Component {...pageProps} />
    </GatewayProvider>
  );
}
