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

import { vanillaExtractPlugin as vanillaExtract} from "@vanilla-extract/vite-plugin";

import unpluginIcons from "unplugin-icons/vite";
import materialSymbols from "@material-symbols/unplugin-icons";

import { FontaineTransform as fontaine } from "fontaine";

export default defineConfig({
  site: "https://deminearchiver.pages.dev",
  markdown: {
    shikiConfig: {
      theme: "houston",
      // themes: {
      //   light: "github-light-default",
      //   dark: "github-dark-default",
      // }
    },
  },
  integrations: [
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
      themeCssSelector: (theme, context) =>
        `[data-code-theme="${theme.name}"]`,
      styleOverrides: {
        borderRadius: "12px",
        frames: {
          editorTabsMarginInlineStart: "16px",
          editorTabBorderRadius: "0",
        },
        codeFontFamily: `"Fira Code Variable", monospace`,
        codeFontSize: `var(--text-body-large-size)`,
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
      vanillaExtract(),
      unpluginIcons({
        compiler: "solid",
        customCollections: materialSymbols(),
      }),
      // fontaine.vite({
      //   fallbacks: ["Arial"],
      //   resolvePath: id => new URL(`./public${id}`, import.meta.url),
      // }),
    ],
    css: {
      transformer: "lightningcss",
    },
    build: {
      cssMinify: "lightningcss",
    },
  }
});
