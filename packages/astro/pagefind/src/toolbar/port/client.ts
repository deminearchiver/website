import type { ToolbarServerHelpers } from "astro";
import { MessagePort } from "./port";
import type { LogType } from "./logger";

const CONSOLE_LOG_MAP: Record<LogType, Console["log"]> = {
  "info": console.info,
  "warn": console.warn,
  "error": console.error,
  "debug": console.debug,
};

export class ClientPort extends MessagePort<ToolbarServerHelpers> {
  protected log(type: LogType, message: string): void {
    // message = `[client] ${message}`;
    CONSOLE_LOG_MAP[type](message);
    this.send(`log://${type}`, this.createPayload(message));
  }

  public constructor(server: ToolbarServerHelpers) {
    super(server);
  }


  public init() {
    this.debug`[client] port initialized`;
  }

  public async index(): Promise<void> {
    this.info`[client] starting indexing`;

    const payload = this.createEmptyPayload();

    this.send("pagefind://index", payload);

    return new Promise<void>((resolve, reject) => {
      this.once(
        "pagefind://index?done",
        payload,
        () => {
          this.send("log://info", this.createPayload("DONE!"));
          resolve();
        },
      );
      this.once<string[]>(
        "pagefind://index?error",
        payload,
        error => reject(error.data),
      );
    });
  }
}
