import { defineCollection, z, type SchemaContext } from "astro:content";
import { imageSchema } from "./utils";

export const blogCollection = () =>
  defineCollection({
    type: "content",
    schema: blogSchema,
  });

export const blogSchema = (context: SchemaContext) => {
  const { image } = context;
  return z.object({
    title: z.string(),
    author: z.string(),
    // image: imageSchema(context),
    createdAt: z.date(),
    editedAt: z.coerce.date().optional(),
  });
}
