// vite.config.ts
import { defineConfig } from "file:///C:/Users/Claudia/Desktop/remix-of-next-path-infra-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Claudia/Desktop/remix-of-next-path-infra-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/Claudia/Desktop/remix-of-next-path-infra-main/node_modules/lovable-tagger/dist/index.js";
import cesium from "file:///C:/Users/Claudia/Desktop/remix-of-next-path-infra-main/node_modules/vite-plugin-cesium/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\Claudia\\Desktop\\remix-of-next-path-infra-main";
function crossOriginIsolationPlugin() {
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
    }
  };
}
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  plugins: [
    react(),
    cesium(),
    crossOriginIsolationPlugin(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query", "three", "@react-three/fiber", "@react-three/drei"]
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query"]
  },
  worker: {
    format: "es"
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxDbGF1ZGlhXFxcXERlc2t0b3BcXFxccmVtaXgtb2YtbmV4dC1wYXRoLWluZnJhLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXENsYXVkaWFcXFxcRGVza3RvcFxcXFxyZW1peC1vZi1uZXh0LXBhdGgtaW5mcmEtbWFpblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQ2xhdWRpYS9EZXNrdG9wL3JlbWl4LW9mLW5leHQtcGF0aC1pbmZyYS1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCB0eXBlIFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuaW1wb3J0IGNlc2l1bSBmcm9tIFwidml0ZS1wbHVnaW4tY2VzaXVtXCI7XG5cbi8vIENyb3NzLU9yaWdpbiBJc29sYXRpb24gcGx1Z2luIGZvciBTaGFyZWRBcnJheUJ1ZmZlciBzdXBwb3J0IGluIGRldlxuZnVuY3Rpb24gY3Jvc3NPcmlnaW5Jc29sYXRpb25QbHVnaW4oKTogUGx1Z2luIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcImNyb3NzLW9yaWdpbi1pc29sYXRpb25cIixcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChfcmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIkNyb3NzLU9yaWdpbi1PcGVuZXItUG9saWN5XCIsIFwic2FtZS1vcmlnaW5cIik7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDcm9zcy1PcmlnaW4tRW1iZWRkZXItUG9saWN5XCIsIFwiY3JlZGVudGlhbGxlc3NcIik7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY29uZmlndXJlUHJldmlld1NlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKF9yZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3lcIiwgXCJzYW1lLW9yaWdpblwiKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIkNyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3lcIiwgXCJjcmVkZW50aWFsbGVzc1wiKTtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgY2VzaXVtKCksXG4gICAgY3Jvc3NPcmlnaW5Jc29sYXRpb25QbHVnaW4oKSxcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCIsIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCIsIFwidGhyZWVcIiwgXCJAcmVhY3QtdGhyZWUvZmliZXJcIiwgXCJAcmVhY3QtdGhyZWUvZHJlaVwiXSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJAdGFuc3RhY2svcmVhY3QtcXVlcnlcIl0sXG4gIH0sXG4gIHdvcmtlcjoge1xuICAgIGZvcm1hdDogXCJlc1wiLFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VixTQUFTLG9CQUFpQztBQUN4WSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBQ2hDLE9BQU8sWUFBWTtBQUpuQixJQUFNLG1DQUFtQztBQU96QyxTQUFTLDZCQUFxQztBQUM1QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixnQkFBZ0IsUUFBUTtBQUN0QixhQUFPLFlBQVksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTO0FBQzFDLFlBQUksVUFBVSw4QkFBOEIsYUFBYTtBQUN6RCxZQUFJLFVBQVUsZ0NBQWdDLGdCQUFnQjtBQUM5RCxhQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsdUJBQXVCLFFBQVE7QUFDN0IsYUFBTyxZQUFZLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUztBQUMxQyxZQUFJLFVBQVUsOEJBQThCLGFBQWE7QUFDekQsWUFBSSxVQUFVLGdDQUFnQyxnQkFBZ0I7QUFDOUQsYUFBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsMkJBQTJCO0FBQUEsSUFDM0IsU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsRUFDNUMsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxJQUNBLFFBQVEsQ0FBQyxTQUFTLGFBQWEscUJBQXFCLHlCQUF5QixTQUFTLHNCQUFzQixtQkFBbUI7QUFBQSxFQUNqSTtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFNBQVMsYUFBYSx1QkFBdUI7QUFBQSxFQUN6RDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
