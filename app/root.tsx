import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useLoaderData,
} from "@remix-run/react";
import { ReactNode, useContext, useEffect } from "react";
import ClientStyleContext from "./styles/ClientStyleContext";
import ServerStyleContext from "./styles/server.context";
import { withEmotionCache } from "@emotion/react";
import {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  json,
} from "@remix-run/node";
import { publicEnvVars } from "./config/env.server";
import pick from "lodash.pick";

export const loader: LoaderFunction = () => {
  // Loading public variables into the application frontend.
  return json({
    ENV: pick(ENV, publicEnvVars),
  });
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unicons.iconscout.com/release/v3.0.0/css/line.css",
  },
];

export const meta: MetaFunction = () => [
  {
    charSet: "utf-8",
  },
];

interface DocumentProps {
  children: ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext);
    const serverStyleData = useContext(ServerStyleContext);
    const publicEnvs = useLoaderData<typeof loader>();

    // Only executed on client
    useEffect(() => {
      // re-link sheet container

      // eslint-disable-next-line no-param-reassign
      emotionCache.sheet.container = document.head;

      // re-inject tags
      const { tags } = emotionCache.sheet;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
        (emotionCache.sheet as any)._insertTag(tag);
      });

      // reset cache to re-apply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="pt">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body
          style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
        >
          {children}
          {/* Including selected env variables to client-side */}
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(publicEnvs)}`,
            }}
          />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  },
);

export function Layout({ children }: { children: React.ReactNode }) {
  return <Document>{children}</Document>;
}

export default function App() {
  return <Outlet />;
}
