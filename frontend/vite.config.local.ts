import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: false,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    https: false,
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));
