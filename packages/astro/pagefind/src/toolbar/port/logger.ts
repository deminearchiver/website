export type LogType = "info" | "warn" | "error" | "debug";
export abstract class Logger {
  protected abstract log(type: LogType, message: string): void;
  protected info(strings: TemplateStringsArray, ...values: unknown[]): void {
    this.log("info", this.mergeStrings(strings, ...values));
  }
  protected warn(strings: TemplateStringsArray, ...values: unknown[]): void {
    this.log("warn", this.mergeStrings(strings, ...values));
  }
  protected error(strings: TemplateStringsArray, ...values: unknown[]): void {
    this.log("error", this.mergeStrings(strings, ...values));
  }
  protected debug(strings: TemplateStringsArray, ...values: unknown[]): void {
    this.log("debug", this.mergeStrings(strings, ...values));
  }

  protected mergeStrings(strings: TemplateStringsArray, ...values: unknown[]): string {
    return strings.reduce((previous, current, i) => (
      `${previous}${current}${values[i] !== undefined ? String(values[i]) : ""}`
    ), "");
  }
}
