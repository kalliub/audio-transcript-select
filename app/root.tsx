import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ReactNode, useContext, useEffect } from "react";
import ClientStyleContext from "./styles/ClientStyleContext";
import ServerStyleContext from "./styles/server.context";
import { withEmotionCache } from "@emotion/react";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unicons.iconscout.com/release/v3.0.0/css/line.css",
  },
];

interface DocumentProps {
  children: ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext);
    const serverStyleData = useContext(ServerStyleContext);

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
