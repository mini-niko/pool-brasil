import Head from "next/head";
import "styles/global.css";
import { UserProvider } from "interface/hooks/useUser.js";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({ Component, pageProps }) {
  const className = `min-h-screen overflow-x-hidden text-pool-dark ${geist.className}`;

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
