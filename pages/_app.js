import Head from "next/head";
import "styles/global.css";

export default function RootLayout({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="text-pool-black min-h-screen overflow-x-hidden">
        <Component {...pageProps} />
      </div>
    </>
  );
}
