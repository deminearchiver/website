import { addDts, createResolver, defineIntegration } from "astro-integration-kit";
import { spawn } from "child_process";
import { readFileSync } from "fs";
import { dirname, relative } from "path";
import sirv from "sirv";
import { fileURLToPath } from "url";

import pagefind from "pagefind";
import { ServerPort } from "./toolbar/port/server";

export default defineIntegration({
  name: "astro-pagefind",
  setup: ({ name, options }) => {
    const { resolve } = createResolver(import.meta.url);

    let outDir: string;
    return {
      hooks: {
        "astro:config:setup": (params) => {
          outDir = fileURLToPath(params.config.outDir);
          params.addDevToolbarApp({
            id: "pagefind",
            name: "Pagefind",
            entrypoint: resolve("./toolbar/index.ts"),
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/></svg>`,
          })
        },
        "astro:server:setup": ({ logger, server, toolbar }) => {
          const serve = sirv(outDir, {
            dev: true,
            etag: true,
          });
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith("/pagefind/")) {
              serve(req, res, next);
            } else next();
          });

          const port = new ServerPort({
            toolbar, logger,
            targetDir: outDir,
          });
          port.init();
        },
        "astro:build:done": async ({ dir }) => {
          const targetDir = fileURLToPath(dir);
          await runPagefind(targetDir);
        },
      },
    };
  },
});

const runPagefind = (targetDir: string) => {
  const cwd = dirname(fileURLToPath(import.meta.url));
  const relativeDir = relative(cwd, targetDir);
  return new Promise<void>(resolve => {
    spawn(
      "yarn", ["dlx", "pagefind", "--site", relativeDir],
      {
        stdio: "inherit",
        shell: true,
        cwd,
      }
    ).on("close", () => resolve());
  })
}

