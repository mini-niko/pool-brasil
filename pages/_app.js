import localFont from "next/font/local";
import Head from "next/head";
import "styles/global.css";
import { UserProvider } from "interface/hooks/useUser.js";

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
  const className = `min-h-screen overflow-x-hidden text-pool-black ${viceCityFont.className}`;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <UserProvider>
        <div className={className}>
          <Component {...pageProps} />
        </div>
      </UserProvider>
    </>
  );
}
