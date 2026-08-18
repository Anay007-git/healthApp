import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function run(script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("tsx", [join(here, script)], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} exited with code ${code}`));
    });
  });
}

async function setup(): Promise<void> {
  await run("migrate.ts");
  await run("seed.ts");
}

setup().catch((err) => {
  console.error("Database setup failed:", err);
  process.exit(1);
});
