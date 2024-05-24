import { defineCollection, z, type SchemaContext } from "astro:content";
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
  const { image } = context;
  return z.object({
    hide: z.enum(["development", "production"]).optional(),
    title: z.string(),
    description: z.string().optional(),
    cover: z.object({
      image: imageSchema(context),
    }).optional(),
    authors: z.array(authorSchema(context)).min(1),
    // author:
    //   z.enum(authorsKeys)
    //     .transform(author => AUTHORS[author])
    //     .pipe(authorSchema(context)),
    createdAt: z.date(),
    editedAt: z.date().optional(),
  });
}

export const blogCollection = () =>
  defineCollection({
    type: "content",
    schema: blogSchema,
  });
