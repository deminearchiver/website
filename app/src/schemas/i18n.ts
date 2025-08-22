import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const I18N = [
  "hello.world",
] as const;

export const i18nSchema = () =>
  z.record(z.enum(I18N), z.string().optional());
export const i18nCollection = () =>
  defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/data/i18n" }),
    schema: i18nSchema,
  });
