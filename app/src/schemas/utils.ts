import { z, type SchemaContext } from "astro:content";

import { getImage } from "astro:assets";

const imageObjectSchema = ({ image }: SchemaContext) =>
  z.object({
    src: image(),
    alt: z.string().default(""),
  })

export const imageSchema = (context: SchemaContext) => {
  const { image } = context;
  return imageObjectSchema(context);
  // return z.union([
  //     image()
  //       .transform(
  //         src => ({ src, alt: "", }),
  //       )
  //       .pipe(imageObjectSchema(context)),
  //     imageObjectSchema(context),
  //   ]);
}
