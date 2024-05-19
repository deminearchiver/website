import type { PagefindModule, PagefindOptions, PagefindSearchOptions, PagefindSearchResults } from "./types";

export * from "./types";

export interface Pagefind {
  init: (options?: PagefindOptions) => Promise<void>;
  preload: (term: string) => Promise<void>;
  search: (term: string) => Promise<PagefindSearchResults>;
  debouncedSearch: (term: string, options?: PagefindSearchOptions, timeout?: number) => Promise<PagefindSearchResults | null>;
}

export abstract class PagefindProvider {
  public static async fromPath(path: string): Promise<Pagefind> {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    url.pathname = path;

    const pagefind = await import(/* @vite-ignore */ url.toString()) as PagefindModule;
    return {
      init: async (options?: PagefindOptions) => {
        if(options) await pagefind.options(options);
        pagefind.init();
      },
      preload: async (term: string) => {
        return await pagefind.preload(term);
      },

      search: async (term: string) => {
        return await pagefind.search(term);
      },
      debouncedSearch: async (term: string, options?: PagefindSearchOptions, timeout: number = 300) => {
        return await pagefind.debouncedSearch(term, options, timeout);
      },
    };
  }
  public static mock(): Pagefind {
    console.log("MOCK");
    return {
      init: () => Promise.resolve(),
      preload: () => Promise.resolve(),
      search: () => Promise.resolve({
        results: [],
        filters: {},
        totalFilters: {},
        timings: {
          preload: 0,
          search: 0,
          total: 0,
        },
        unfilteredResultCount: 0,
      }),
      debouncedSearch: () => Promise.resolve(null),
    };
  }
}
