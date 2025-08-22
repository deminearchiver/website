import { defineConfig } from "astro/config";

import expressiveCode from "astro-expressive-code";
import { addClassName } from "astro-expressive-code/hast";
import { pluginLineNumbers as expressiveCodeLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections as expressiveCodeCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";

import mdx from "@astrojs/mdx";

import solid from "@astrojs/solid-js";

import sitemap from "@astrojs/sitemap";
import metaTags from "astro-meta-tags";

import pagefind from "@pagefind/astro/integration";

import { vanillaExtractPlugin as vanillaExtract } from "@vanilla-extract/vite-plugin";

import unpluginIcons from "unplugin-icons/vite";
// import { FileSystemIconLoader } from "unplugin-icons/loaders";
import materialSymbols from "@material-symbols/unplugin-icons";
import materialSymbolsIntegration from "@material/symbols/astro";

// import { FontaineTransform as fontaine } from "fontaine";

// import { imageService as unpicImageService } from "@unpic/astro/service";

import turboConsole from "unplugin-turbo-console/astro";

export default defineConfig({
  site: "https://deminearchiver.pages.dev",
  // image: {
  //   service: unpicImageService({
  //     fallbackService: "sharp",
  //     placeholder: "blurhash",
  //     layout: "fullWidth",
  //   }),
  // },
  integrations: [
    turboConsole({}),
    materialSymbolsIntegration(),
    expressiveCode({
      plugins: [
        expressiveCodeLineNumbers(),
        expressiveCodeCollapsibleSections(),
        {
          name: "mdx",
          hooks: {
            postprocessRenderedBlock: ({ renderData }) => {
              addClassName(renderData.blockAst, "not-content");
            },
          },
        }
      ],
      themes: ["github-dark-default", "github-light-default"],
      themeCssSelector: (theme) =>
        `[data-code-theme="${theme.name}"]`,
      styleOverrides: {
        codeFontFamily: `"Fira Code Variable"`,
        codeFontSize: `var(--text-body-medium-size)`,
        uiFontFamily: "var(--text-body-medium-family)",
        uiFontSize: "var(--text-body-medium-size)"
      },
      defaultProps: {
        showLineNumbers: false,
        overridesByLang: {
          "js,ts,jsx,tsx,astro,html,css": {
            showLineNumbers: true,
          },
        },
      },
    }),
    mdx(),
    solid(),
    sitemap(),
    metaTags(),
    pagefind(),
  ],
  vite: {
    plugins: [
      // materialSymbolsVite(),
      // @ts-expect-error Astro supports Vite 6 only
      unpluginIcons({
        compiler: "solid",
        customCollections: {
          ...materialSymbols(),
          // TODO: add custom icons
        },
      }),
      // @ts-expect-error Astro supports Vite 6 only
      vanillaExtract(),
    ],
    css: {
      transformer: "lightningcss",
    },
    build: {
      cssMinify: "lightningcss",
    },
  }
});
