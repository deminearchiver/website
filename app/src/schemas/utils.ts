import { z, type SchemaContext } from "astro:content";

const imageObjectSchema = ({ image }: SchemaContext) =>
  z.object({
    src: image(),
    alt: z.string().optional(),
  })

export const imageSchema = (context: SchemaContext) => {
  const { image } = context;
  return z.union([
      image()
        .transform<z.infer<ReturnType<typeof imageObjectSchema>>>(
          src => ({ src, alt: "" }),
        ),
      imageObjectSchema(context),
    ])
      .pipe(imageObjectSchema(context));
}
