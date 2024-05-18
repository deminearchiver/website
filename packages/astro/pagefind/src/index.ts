import type { PagefindModule, PagefindOptions, PagefindSearchOptions, PagefindSearchResults } from "./types";

export * from "./types";

export class Pagefind {
  public initialized = false;

  private constructor(
    private readonly pagefind: PagefindModule,
  ) {}

  public static async load(path: string = "/pagefind/pagefind.js"): Promise<Pagefind> {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    url.pathname = path;

    const pagefind = await import(/* @vite-ignore */ url.toString()) as PagefindModule;
    return new Pagefind(pagefind);
  }

  public async init(options?: PagefindOptions) {
    if(options) await this.pagefind.options(options);
    this.pagefind.init();
    this.initialized = true;
  }

  public async preload(term: string) {
    return await this.pagefind.preload(term);
  }

  public async search(term: string): Promise<PagefindSearchResults> {
    return await this.pagefind.search(term);
  }
  public async debouncedSearch(term: string, options?: PagefindSearchOptions, timeout: number = 300): Promise<PagefindSearchResults | null> {
    return await this.pagefind.debouncedSearch(term, options, timeout);
  }
}
