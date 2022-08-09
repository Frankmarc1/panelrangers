import { Html, Main, NextScript, Head } from 'next/document';

const Document = () => {
  return (
    <Html lang='es' data-theme='light'>
      <Head />
      <body className='scroll-smooth'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
