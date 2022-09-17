import type { AppContext, AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useEffect, useState } from 'react';
import Router from 'next/router';

import {Spinner} from '../common/Spinner/Spinner';

import '../../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

config.autoAddCss = false;
function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
  };
  const end = () => {
    setLoading(false);
  };

  useEffect(() => {
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return <>{loading ? <Spinner /> : <Component {...pageProps} />}</>;
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { ...pageProps };
};

export default MyApp;
