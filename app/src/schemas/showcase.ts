import { defineCollection, getCollection, z, type SchemaContext } from "astro:content";
import { imageSchema } from "./utils";

export const showcaseCollection = () =>
  defineCollection({
    type: "content",
    schema: showcaseSchema,
  });

export const showcaseSchema = (context: SchemaContext) => {
  return z.object({
    hide: z.enum(["development", "production"]).optional(),
    title: z.string(),
    description: z.string().optional(),
    cover: imageSchema(context).optional(),
  });
}

export const getShowcaseCollection = async () => {
  let entries = await getCollection("showcase");
  if(import.meta.env.PROD) {
    entries = entries.filter(entry => entry.data.hide !== "production");
  }
  if(import.meta.env.DEV) {
    entries = entries.filter(entry => entry.data.hide !== "development");
  }
  return entries;
}
