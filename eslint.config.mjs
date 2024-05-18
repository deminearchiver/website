// @ts-check

import eslint from "@eslint/js";
import typescript from "typescript-eslint";
import astro from "eslint-plugin-astro";
// import solid from "eslint-plugin-solid/configs/typescript";

export default typescript.config(
  eslint.configs.recommended,
  ...typescript.configs.recommendedTypeChecked,
  ...astro.configs["flat/recommended"],
  // ...astro.configs["flat/recommended"],
  {
    languageOptions: {
      parserOptions: {
          project: [
            "./tsconfig.eslint.json",
            "./app/tsconfig.json",
            "./packages/*/tsconfig.json",
            "./packages/astro/*/tsconfig.json",
            "./packages/material/*/tsconfig.json",
          ],
          tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
