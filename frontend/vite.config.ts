import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    https: fs.existsSync("/etc/ssl/private/selfsigned.key") ? {
      key: fs.readFileSync("/etc/ssl/private/selfsigned.key"),
      cert: fs.readFileSync("/etc/ssl/certs/selfsigned.crt"),
    } : undefined,
  },
  preview: {
    host: true,
    https: fs.existsSync("/etc/ssl/private/selfsigned.key") ? {
      key: fs.readFileSync("/etc/ssl/private/selfsigned.key"),
      cert: fs.readFileSync("/etc/ssl/certs/selfsigned.crt"),
    } : undefined,
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));
