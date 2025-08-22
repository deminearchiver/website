import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { blogSchema } from "./schemas/blog";
import { showcaseSchema } from "./schemas/showcase";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/blog" }),
  schema: blogSchema,
});

const showcase = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/showcase" }),
  schema: showcaseSchema,
});

export const collections = { blog, showcase };
