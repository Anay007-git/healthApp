import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { DEFAULT_ADMIN_TOKEN } from "../../packages/database/src/constants";

export default defineConfig(({ mode }) => {
  // Load environment variables from workspace root .env
  const env = loadEnv(mode, path.resolve(__dirname, "../../"), "");
  const adminToken = env.ADMIN_TOKEN || process.env.ADMIN_TOKEN || DEFAULT_ADMIN_TOKEN;
  const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL || "postgresql://neondb_owner:npg_OBj2LtShf1Rv@ep-gentle-king-axtrdlfg-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

  return {
    base: "/admin/",
    plugins: [react(), tailwindcss()],
    build: {
      outDir: path.resolve(__dirname, "../web/dist/admin"),
      emptyOutDir: true,
    },
    define: {
      "process.env.DATABASE_URL": JSON.stringify(databaseUrl),
      "process.env.ADMIN_TOKEN": JSON.stringify(adminToken),
      "process.env.NODE_ENV": JSON.stringify(mode || "development"),
    },
    server: {
      port: 3002,
      proxy: {
        "/api": "http://localhost:3001",
      },
    },
  };
});
