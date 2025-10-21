import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const keyPath = path.resolve(__dirname, "certs/selfsigned.key");
const certPath = path.resolve(__dirname, "certs/selfsigned.crt");

let httpsConfig: any = undefined;

try {
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
} catch (error) {
  console.warn("HTTPS certs not available, running without SSL");
}

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
