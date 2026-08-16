import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load environment variables from workspace root .env
  const env = loadEnv(mode, path.resolve(__dirname, "../../"), "");
  const adminToken = env.ADMIN_TOKEN || process.env.ADMIN_TOKEN || "a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6";
  const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL || "postgresql://neondb_owner:npg_OBj2LtShf1Rv@ep-gentle-king-axtrdlfg-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.DATABASE_URL": JSON.stringify(databaseUrl),
      "process.env.ADMIN_TOKEN": JSON.stringify(adminToken),
      "process.env.NODE_ENV": JSON.stringify(mode || "development"),
    },
    server: {
      port: 3002,
    },
  };
});
