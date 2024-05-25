import { defineCollection, z } from "astro:content";
import { i18nCollection, i18nSchema } from "../schemas/i18n";
import { blogCollection } from "../schemas/blog";
import { showcaseCollection } from "../schemas/showcase";


export const collections = {
  blog: blogCollection(),
  showcase: showcaseCollection(),
  // i18n: i18nCollection(),
};
