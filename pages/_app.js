import localFont from "next/font/local";
import Head from "next/head";
import "styles/global.css";

const viceCityFont = localFont({
  src: [
    {
      path: "../public/fonts/vice-city-sans-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/vice-city-sans-light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
});

export default function RootLayout({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen overflow-x-hidden">
        <div className={`text-pool-black ${viceCityFont.className}`}>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
