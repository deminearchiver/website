import { defineCollection, z } from "astro:content";

const I18N = [
  "hello.world",
] as const;

export const i18nSchema = () =>
  z.record(z.enum(I18N), z.string().optional());
export const i18nCollection = () =>
  defineCollection({
    type: "data",
    schema: i18nSchema,
  });
