import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import cesium from "vite-plugin-cesium";

// Cross-Origin Isolation plugin for SharedArrayBuffer support in dev
function crossOriginIsolationPlugin(): Plugin {
  return {
    name: "cross-origin-isolation",
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    cesium(),
    crossOriginIsolationPlugin(),
  ].filter(Boolean) as Plugin[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query", "three", "@react-three/fiber", "@react-three/drei"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router-dom")) return "vendor-react";
          if (id.includes("node_modules/three") || id.includes("node_modules/@react-three/fiber") || id.includes("node_modules/@react-three/drei")) return "vendor-three";
          if (id.includes("node_modules/cesium")) return "vendor-cesium";
          if (id.includes("node_modules/framer-motion")) return "vendor-motion";
          if (id.includes("node_modules/@tanstack/react-query")) return "vendor-query";
        },
      },
    },
  },
  worker: {
    format: "es",
  },
  test: {
    browser: {
      enabled: true,
      // @ts-expect-error — vitest 4.x BrowserProviderOption<object> generic not narrowing literal
      provider: 'playwright',
      name: 'chromium',
    },
    setupFiles: ['./src/setupTests.ts'],
  },
});
