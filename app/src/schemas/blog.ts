import { defineCollection, getCollection, z, type SchemaContext } from "astro:content";
import { imageSchema } from "./utils";

type Author = {
  name: string;
  avatar?: {
    src: Promise<{ default: ImageMetadata; }>;
    alt?: string;
  };
};
const AUTHORS = {
  deminearchiver: {
    name: "deminearchiver",
    avatar: {
      src: import("../assets/images/avatars/deminearchiver.png"),
      alt: "deminearchiver",
    },
  },
} satisfies Record<string, Author>;
type AuthorsKey = keyof typeof AUTHORS;
const authorsKeys = Object.keys(AUTHORS) as [AuthorsKey, ...AuthorsKey[]];

const TAGS = {
  solidJs: "SolidJS",
  vanillaExtract: "Vanilla Extract",
  materialDesign: "Material Design",
}
type TagsKey = keyof typeof TAGS;
const tagsKeys = Object.keys(TAGS) as [TagsKey, ...TagsKey[]];


export const blogSchema = (context: SchemaContext) => {
  return z.object({
    hide: z.enum(["development", "production"]).optional(),
    title: z.string(),
    description: z.string().optional(),
    cover: imageSchema(context).optional(),
    authors: z.array(z.enum(authorsKeys))
      .transform(async (ids, { addIssue }) => {
        ids = [...new Set(ids)];
        if(ids.length === 0) addIssue({
          type: "array",
          code: "too_small",
          minimum: 1,
          inclusive: true,
          fatal: true,
        });
        return Promise.all(ids.map(async id => {
          const { name, avatar } = AUTHORS[id] as Author;
          return {
            id,
            name: name,
            avatar: avatar && {
              src: (await avatar.src).default,
              alt: avatar.alt ?? name,
            },
          };
        }));
      }),
    tags: z.array(z.enum(tagsKeys))
      .default([])
      .transform((ids, { addIssue }) => {
        return [...new Set(ids)].map(
          id => ({ id, name: TAGS[id] }),
        );
      }),
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
