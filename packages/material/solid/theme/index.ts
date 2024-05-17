import { DynamicColor, DynamicScheme, Hct, MaterialDynamicColors, SchemeTonalSpot } from "@material/material-color-utilities";
import { schemeToColors, type ColorsRecord, type MaterialDynamicColorsRecord } from "./color";
import { createThemeContract } from "@vanilla-extract/css";
import { THEME } from "./contract.css";
import { emphasizedAccurate } from "./emphasized";
import { DEFAULT_DURATION, DEFAULT_EASING } from "./default/motion";
import { DEFAULT_TYPOGRAPHY } from "./default/typography";



export interface CreateMaterialThemeOptions<CustomColors extends Record<string, string> = {}> {
  color: {
    seed: Hct;
    custom?: CustomColors;
  }
}

type MaterialThemeContract = {
}

/**
 * @example
 * ```ts
 * // theme.ts
 * export const THEME = createMaterialTheme(...);
 *
 * // theme.css.ts
 * import { THEME } from "./theme";
 *
 * export const theme = Theme.contract();
 * ```
 */
type MaterialThemeFactory = {
  contract: () => MaterialThemeContract;
  light: () => MaterialThemeContract;
  dark: () => MaterialThemeContract;
}

/**
 * Creates a new {@link MaterialThemeFactory}.
 * @example
 * ```ts
 * // theme.ts
 * import { createGlobalTheme, globalStyle } from "@vanilla-extract/css";
 * import { createMaterialTheme, Hct } from "@material/solid/theme";
 *
 * const source = Hct.fromInt(0xFFFF0000);
 * const THEME = createMaterialTheme(source);
 *
 * export const theme = THEME.contract();
 *
 * export const LIGHT_THEME = THEME.light();
 * export const DARK_THEME = THEME.dark();
 *
 * createGlobalTheme(
 *   `:root[data-theme="light"], [data-theme="light"] ::backdrop`,
 *   LIGHT_THEME,
 * );
 * createGlobalTheme(
 *   `:root[data-theme="dark"], [data-theme="dark"] ::backdrop`,
 *   DARK_THEME,
 * );
 *
 * globalStyle(
 *   `
*    :root:not([data-theme="light"]):not([data-theme="dark"]),
*    :not([data-theme="light"]):not([data-theme="dark"]) ::backdrop
 *   `,
 *   {
 *     "@media": {
 *       "(prefers-color-scheme: light)": {
 *         vars: LIGHT_THEME,
 *       },
 *       "(prefers-color-scheme: dark)": {
 *         vars: DARK_THEME,
 *       },
 *     },
 *   },
 * );
 * ```
 */
export const createMaterialTheme = <CustomColors extends Record<string, string> = {}>(options: CreateMaterialThemeOptions<CustomColors>) => {
  const lightScheme = new SchemeTonalSpot(options.color.seed, false, 0);
  const darkScheme = new SchemeTonalSpot(options.color.seed, true, 0);

  const factory = (scheme: DynamicScheme) => {
    return () => {
      const defaultColors = schemeToColors(scheme);
      return {
        color: defaultColors,
        easing: DEFAULT_EASING,
        duration: DEFAULT_DURATION,
        text: DEFAULT_TYPOGRAPHY,
      };
    };
  }

  return {
    contract: (options: ContractOptions = { global: false }) => {
      if(options.global) {
        const prefix = options.prefix ?? "";
      }
      return {
        color: {
          ...THEME.color,
        },
        easing: {
          ...THEME.easing,
        },
        duration: {
          ...THEME.duration,
        },
        text: THEME.text,
      };
    },
    light: factory(lightScheme),
    dark: factory(darkScheme),
  };
}

type ContractOptions =
  | { global: false; }
  | {
    global: true;
    prefix?: string;
  }
