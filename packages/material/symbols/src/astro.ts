import type { AstroIntegration } from "astro";
import unplugin from ".";
import type { Options } from "./types";

export default (options?: Options): AstroIntegration => ({
  name: "@material/symbols",
  hooks: {
    "astro:config:setup": ({ config }) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      config.vite.plugins ||= [];
      config.vite.plugins.push(
        // @ts-expect-error
        unplugin.vite(options)
      );
    },
  },
})
