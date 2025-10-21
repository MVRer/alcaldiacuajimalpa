import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const keyPath = "/etc/ssl/private/selfsigned.key";
const certPath = "/etc/ssl/certs/selfsigned.crt";

const httpsConfig = fs.existsSync(keyPath) && fs.existsSync(certPath) ? {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
} : undefined;

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: httpsConfig,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    https: httpsConfig,
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));
