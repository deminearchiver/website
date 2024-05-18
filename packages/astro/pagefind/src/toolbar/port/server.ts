import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { MessagePort } from "./port";

import * as pagefind from "pagefind";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import type { LogType } from "./logger";

type ToolbarType = Parameters<Exclude<AstroIntegration["hooks"]["astro:server:setup"], undefined>>[0]["toolbar"];

export type ServerPortOptions = {
  toolbar: ToolbarType;
  logger: AstroIntegrationLogger;
  targetDir: string;
}

export class ServerPort extends MessagePort<ToolbarType> {
  private readonly targetDir: string;

  private readonly LOGGER_MAP: Record<LogType, AstroIntegrationLogger[LogType]>;

  public constructor({
    toolbar, logger, targetDir,
  }: ServerPortOptions) {
    super(toolbar);
    this.targetDir = targetDir;

    this.LOGGER_MAP = {
      info: logger.info.bind(logger),
      warn: logger.warn.bind(logger),
      error: logger.error.bind(logger),
      debug: logger.debug.bind(logger),
    };
  }
  protected log(type: LogType, message: string): void {
    this.LOGGER_MAP[type](message);
  }

  public init() {
    this.on<string>("log://info", payload => this.info`${payload.data}`);
    this.on<string>("log://warn", payload => this.warn`${payload.data}`);
    this.on<string>("log://error", payload => this.error`${payload.data}`);
    this.on<string>("log://debug", payload => this.debug`${payload.data}`);

    this.on<void>("pagefind://index", async payload => {
      this.info`[server] starting indexing`;

      try {
        const { index, errors: errors1 } = await pagefind.createIndex({});
        if(!index) {
          this.info`[server] error creating index`;
          this.send("pagefind://index?error", payload.copy(errors1));
          return;
        }
        this.info`[server] created index`;
        this.info`[server] adding directory to index`;
        await index.addDirectory({
          path: this.targetDir,
        });
        this.info`[server] added directory to index`;

        const writeDir = join(this.targetDir, "pagefind");
        this.info`[server] writing index files`;
        await index.writeFiles({
          outputPath: writeDir,
        });
        this.info`[server] written index files`;

        this.send("pagefind://index?done", payload.empty());
        this.info`[server] done`;
      } catch(error) {
        this.send("pagefind://index?error", payload.copy(error));
      }
    });

    this.info`[server] port initialized`;
  }
}

