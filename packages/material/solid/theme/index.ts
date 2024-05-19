import { DynamicColor, DynamicScheme, Hct, MaterialDynamicColors, SchemeTonalSpot } from "@material/material-color-utilities";
import { schemeToColors, type ColorsRecord, type MaterialDynamicColorsRecord } from "./color";
import { createThemeContract } from "@vanilla-extract/css";
import { THEME } from "./contract.css";
import { emphasizedAccurate } from "./emphasized";
import { DEFAULT_DURATION, DEFAULT_EASING } from "./default/motion";
import { DEFAULT_TYPOGRAPHY } from "./default/typography";
import { capitalize } from "@deminearchiver/utils";
import type { CSSVarFunction, MapLeafNodes } from "./utils";

type Prefix<T extends string, S extends string> = `${S}${T}`;
type Suffix<T extends string, S extends string> = `${T}${S}`;

type On<T extends string> = `on${Capitalize<T>}`;
type Container<T extends string> = `${T}Container`;
type OnContainer<T extends string> = `on${Capitalize<T>}Container`;

type ColorRoles<Roles extends string[], T> =
& {
  [P in Roles[number] as `${P}PaletteKeyColor`]: T;
}
& {
  [P in Roles[number]]: T;
}
& {
  [P in Roles[number] as On<P & string>]: T;
}
& {
  [P in Roles[number] as Container<P & string>]: T;
}
& {
  [P in Roles[number] as OnContainer<P & string>]: T;
}

export interface CreateMaterialThemeOptions<CustomColors extends string[]> {
  color: {
    seed: Hct;
    custom?: CustomColors;
  }
}


export const createMaterialTheme = <const CustomColors extends string[]>(options: CreateMaterialThemeOptions<CustomColors>) => {
  const lightScheme = new SchemeTonalSpot(options.color.seed, false, 0);
  const darkScheme = new SchemeTonalSpot(options.color.seed, true, 0);

  const factory = (scheme: DynamicScheme) => {
    return (customColors?: ColorRoles<CustomColors, string>) => {
      const defaultColors = schemeToColors(scheme);
      const data = {
        color: {
          ...defaultColors,
          ...customColors as ColorRoles<CustomColors, string>,
        },
        easing: DEFAULT_EASING,
        duration: DEFAULT_DURATION,
        text: DEFAULT_TYPOGRAPHY,
      } as const;
      return data;
    };
  }

  const customContract = Object.fromEntries(
    (options.color.custom ?? [])
      .flatMap(key => [
        `${key}PaletteKeyColor`,
        key,
        `on${capitalize(key)}`,
        `${key}Container`,
        `on${capitalize(key)}Container`,
      ])
      .map(key => [key, ""]),
  ) as ColorRoles<CustomColors, CSSVarFunction>;

  return {
    contract: (options: ContractOptions = { global: false }) => {
      if(options.global) {
        const prefix = options.prefix ?? "";
      }
      return {
        color: {
          ...THEME.color,
          ...createThemeContract(customContract),
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
