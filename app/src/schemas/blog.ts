import { defineCollection, getCollection, z, type SchemaContext } from "astro:content";
import { imageSchema } from "./utils";

import deminearchiverAvatar from "../assets/images/avatars/deminearchiver.png";

const authorSchema = (context: SchemaContext) =>
  z.object({
    id: z.string(),
    name: z.string(),
    avatar: imageSchema(context).optional(),
  });

type Author = z.infer<ReturnType<typeof authorSchema>>
const AUTHORS = {
  deminearchiver: {
    id: "deminearchiver",
    name: "deminearchiver"
  },
} satisfies Record<string, Author>;
type AuthorsKey = keyof typeof AUTHORS;
const authorsKeys = Object.keys(AUTHORS) as [AuthorsKey, ...AuthorsKey[]];

export const blogSchema = (context: SchemaContext) => {
  return z.object({
    hide: z.enum(["development", "production"]).optional(),
    title: z.string(),
    description: z.string().optional(),
    cover: imageSchema(context).optional(),
    authors: z.array(authorSchema(context)).min(1),
    createdAt: z.date(),
    editedAt: z.date().optional(),
  });
}

export const blogCollection = () =>
  defineCollection({
    type: "content",
    schema: blogSchema,
  });

export const getBlogCollection = async () => {
  let entries = await getCollection("blog");
  if(import.meta.env.PROD) {
    entries = entries.filter(entry => entry.data.hide !== "production");
  }
  if(import.meta.env.DEV) {
    entries = entries.filter(entry => entry.data.hide !== "development");
  }
  return entries;
}
