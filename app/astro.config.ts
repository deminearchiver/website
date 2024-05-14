import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import solid from "@astrojs/solid-js";

import sitemap from "@astrojs/sitemap";
import metaTags from "astro-meta-tags";

import { vanillaExtractPlugin as vanillaExtract} from "@vanilla-extract/vite-plugin";

import unpluginIcons from "unplugin-icons/vite";
import materialSymbols from "@material-symbols/unplugin-icons";

export default defineConfig({
  site: "https://deminearchiver.pages.dev",
  integrations: [
    mdx(),
    solid(),
    sitemap(),
    metaTags(),
  ],
  vite: {
    plugins: [
      vanillaExtract(),
      unpluginIcons({
        compiler: "solid",
        customCollections: materialSymbols(),
      })
    ]
  }
});
