import { globalStyle, createGlobalTheme, assignVars } from "@vanilla-extract/css";
import { createMaterialTheme } from "@material/solid/theme";
import { Hct } from "@material/material-color-utilities";
import { test } from "./astro.css";

const { contract, dark, light } = createMaterialTheme({
  color: {
    seed: Hct.fromInt(0xFF7D73FE),
  }
});

export const THEME = contract();
export const LIGHT_THEME = light();
export const DARK_THEME = dark();

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
)
