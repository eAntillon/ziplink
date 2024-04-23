import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Open_Sans } from "next/font/google";
import '@radix-ui/themes/styles.css';
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Theme } from "@radix-ui/themes";
import { Toaster } from 'react-hot-toast';


const sanchez = Open_Sans({
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Theme>
        <main className={sanchez.className + " bg-pattern"}>
          <Component {...pageProps} />
          <Toaster />
        </main>
      </Theme>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
