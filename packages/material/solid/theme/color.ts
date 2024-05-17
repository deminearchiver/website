import { DynamicColor, DynamicScheme, MaterialDynamicColors, SchemeTonalSpot, hexFromArgb, type Hct } from "@material/material-color-utilities";
export type ColorsRecord<O, T = DynamicColor> = {
  [P in keyof O as O[P] extends DynamicColor ? P : never]: T;
}
export type MaterialDynamicColorsRecord =
  & ColorsRecord<typeof MaterialDynamicColors, string>
  & {
    highestSurface: string;
  };

export const schemeToColors = (scheme?: DynamicScheme): MaterialDynamicColorsRecord => {
  const colors = {} as MaterialDynamicColorsRecord;
  for(const key in MaterialDynamicColors) {
    const value = MaterialDynamicColors[key as keyof typeof MaterialDynamicColors];
    if(value instanceof DynamicColor) {
      colors[key as keyof MaterialDynamicColorsRecord] = scheme ? hexFromArgb(value.getArgb(scheme)) : "";
    }
  }
  colors["highestSurface"] = scheme ? hexFromArgb(MaterialDynamicColors.highestSurface(scheme).getArgb(scheme)) : "";
  return colors;
}


export const createMaterialColorScheme = (sourceColor: Hct, isDark: boolean): MaterialDynamicColorsRecord => {
  const scheme = new SchemeTonalSpot(sourceColor, isDark, 0);
  const colors = schemeToColors(scheme);
  return colors;
}
