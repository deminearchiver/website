import { open, type Font } from "fontkit";
import { createRequire } from "module";

export type Variant = "rounded" | "sharp";

const require = createRequire(import.meta.url);

export const loadFont = async (variant: Variant) => {
  const moduleId = `@fontsource-variable/material-symbols-${variant}`;
  const fileName = `material-symbols-${variant}-latin-wght-normal.woff2`;

  const fontPath = require.resolve(`${moduleId}/files/${fileName}`);

  const font = await open(fontPath) as Font;
  return font;
}
