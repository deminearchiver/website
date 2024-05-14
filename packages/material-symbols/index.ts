import { z } from "zod";

const axesSchema = () => z.object({
  variant: z.enum(["filled", "outlined"]),
  weight: z.enum(["100", "200", "300", "400", "500", "600", "700"])
    .nullish()
    .transform(value => value ?? "400"),
  grade: z.enum(["-25", "0", "200"])
    .nullish()
    .transform(value => value ?? "0"),
  opticalSize: z.enum(["20", "24", "40", "48"])
    .nullish()
    .transform(value => value ?? "24"),
})
  .transform((axes) => {
    const weight = axes.weight === "400" ? "" : `wght${axes.weight}`;
    const grade = axes.grade === "0" ? "" : `grad${axes.grade.replace("-", "N")}`;
    const fill = axes.variant === "filled" ? "fill1" : "";

    return (weight === "" && grade === "" && fill === "")
      ? `default/${axes.opticalSize}px`
      : `${weight}${grade}${fill}/${axes.opticalSize}px`;
  });

const loader = (variant: "rounded" | "outlined" | "sharp") => {
  const baseUrl = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbols${variant}`;
  return async (icon: string): Promise<string | undefined> => {
    const values = icon.split(":", 2) as [string, string | undefined];
    const name = values[0].replaceAll("-", "_");
    const params = new URLSearchParams(values[1]);

    const isFilled = params.has("filled");
    const isOutlined = params.has("outlined");
    if(isFilled ? isOutlined : !isOutlined) return;

    const axes = axesSchema().parse({
      variant: isFilled ? "filled" : "outlined",
      weight: params.get("weight"),
      grade: params.get("grade"),
      opticalSize: params.get("opticalSize"),
    });

    const url = `${baseUrl}/${name}/${axes}.svg`;
    const svg = await fetch(url).then(response => response.text());
    return svg
      .replace(/^<svg /, `<svg fill="currentColor" `);
  };
}

const NAME = "material-symbols";

export default function materialSymbols() {
  const collections = {
    [`${NAME}-rounded`]: loader("rounded"),
    [`${NAME}-sharp`]: loader("sharp"),
  };
  return collections;
}
