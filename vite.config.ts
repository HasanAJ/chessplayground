import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { seoPlugin } from "./scripts/seo.ts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "SITE_");
  return {
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "react",
                test: /node_modules\/(react|react-dom|scheduler)\//,
              },
            ],
          },
        },
      },
    },
    plugins: [
      react(),
      seoPlugin(env.SITE_URL || "https://chessplayground.app"),
    ],
  };
});
