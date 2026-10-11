import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { seoPlugin } from "./scripts/seo";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "SITE_");
  return {
    plugins: [
      react(),
      seoPlugin(env.SITE_URL || "https://chessplayground.app"),
    ],
  };
});
