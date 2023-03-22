import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { useSession, SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import dynamic from "next/dynamic";

interface MyAppProps extends AppProps {
  session: Session | null;
}

const AppRouteLoadingIndicator = dynamic(
  () => import("~/components/loading/AppRouteLoadingIndicator"),
  {
    ssr: false,
  }
);

const MyApp: AppType<MyAppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppRouteLoadingIndicator />
      <Auth>
        <Component {...pageProps} />
        <Toaster
          position={"top-center"}
          containerClassName={"!bottom-16 !select-none !text-center"}
          gutter={16}
          toastOptions={{
            duration: 5000,
            className: "!backdrop-blur-md !bg-slate-100/90 !text-slate-900",
            success: {
              className:
                "!backdrop-blur-md !bg-emerald-100/90 !text-emerald-900",
            },
            error: {
              className: "!backdrop-blur-md !bg-red-100/90 !text-red-900",
              icon: "🚨",
            },
          }}
        />
      </Auth>
    </SessionProvider>
  );
};

interface AuthProps {
  children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <></>;
  }

  return <>{children}</>;
};

export default api.withTRPC(MyApp);
