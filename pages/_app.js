import Head from "next/head";
import "styles/global.css";
import { UserProvider } from "interface/hooks/useUser.js";
import { Geist } from "next/font/google";
import { RouterProtector } from "@/interface/hooks/RouterProtector";
import routes from "@/infra/routes";
import { useRouter } from "next/router";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({ Component, pageProps }) {
  const className = `min-h-screen overflow-x-hidden text-pool-dark ${geist.className}`;

  let pathname = useRouter().pathname;
  pathname = "/" + pathname.split("/")[1];

  const isPublic = routes.public.routes.some(
    (publicPathname) => publicPathname === pathname,
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={className}>
        {isPublic && <Component {...pageProps} />}
        {!isPublic && (
          <UserProvider>
            <RouterProtector>
              <Component {...pageProps} />
            </RouterProtector>
          </UserProvider>
        )}
      </div>
    </>
  );
}
