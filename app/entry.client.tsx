/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useCallback, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import createEmotionCache from "./styles/createEmotionCache";
import ClientStyleContext from "./styles/ClientStyleContext";
import { CacheProvider } from "@emotion/react";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}
const ClientCacheProvider = ({ children }: ClientCacheProviderProps) => {
  const [cache, setCache] = useState(createEmotionCache());

  const reset = useCallback(() => {
    setCache(createEmotionCache());
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
};

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientCacheProvider>
        <RemixBrowser />
      </ClientCacheProvider>
    </StrictMode>,
  );
});
