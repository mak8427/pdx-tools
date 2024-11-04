import { defineConfig } from "vite";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [
    cloudflareDevProxyVitePlugin({
      getLoadContext,
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
    alias: {
      // https://github.com/remix-run/remix/issues/9245#issuecomment-2179517678
      ...(mode === 'development' && { 'postgres': path.resolve(__dirname, '../../node_modules/postgres/src/index.js') })
    }
  },
  build: {
    minify: true,
  },
}));