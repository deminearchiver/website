import { assignVars, createGlobalTheme, globalStyle } from "@vanilla-extract/css";
import { DARK_THEME, LIGHT_THEME, THEME } from ".";
import { test } from "./astro.css";

const createSelector = (theme: "light" | "dark"): string => {
  return `:root[data-theme="${theme}"], [data-theme="${theme}"] ::backdrop`;
}

createGlobalTheme(
  createSelector("light"),
  THEME, LIGHT_THEME,
);
createGlobalTheme(
  createSelector("dark"),
  THEME, DARK_THEME,
);

const NOT = `:not([data-theme="light"]):not([data-theme="dark"])`;

globalStyle(
  `:root${NOT}, ${NOT} ::backdrop`,
  {
    "@media": {
      "(prefers-color-scheme: light)": {
        vars: assignVars(THEME, LIGHT_THEME),
      },
      "(prefers-color-scheme: dark)": {
        vars: assignVars(THEME, DARK_THEME),
      },
    }
  }
);

globalStyle(
  `:root, ::backdrop`,
  {
    vars: test(THEME),
  }
);
