import { defineCollection, z } from "astro:content";
import { i18nCollection, i18nSchema } from "../schemas/i18n";
import { blogCollection } from "../schemas/blog";


export const collections = {
  blog: blogCollection(),
  // i18n: i18nCollection(),
};
