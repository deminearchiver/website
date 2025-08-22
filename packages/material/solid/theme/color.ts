import {
  DynamicColor,
  DynamicScheme,
  MaterialDynamicColors,
  Platform,
  SpecVersion,
  Variant,
  hexFromArgb,
  type Hct,
} from "@material/material-color-utilities";
export type ColorsRecord<O, T = DynamicColor> = {
  [P in keyof O as O[P] extends DynamicColor ? P : never]: T;
};
export type MaterialDynamicColorsRecord = {
  primaryPaletteKeyColor: string;
  secondaryPaletteKeyColor: string;
  tertiaryPaletteKeyColor: string;
  neutralPaletteKeyColor: string;
  neutralVariantPaletteKeyColor: string;
  errorPaletteKeyColor: string;
  background: string;
  onBackground: string;
  surface: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  shadow: string;
  scrim: string;
  surfaceTint: string;
  primary: string;
  primaryDim: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  inversePrimary: string;
  primaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixed: string;
  onPrimaryFixedVariant: string;
  secondary: string;
  secondaryDim: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  secondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixed: string;
  onSecondaryFixedVariant: string;
  tertiary: string;
  tertiaryDim: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  tertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixed: string;
  onTertiaryFixedVariant: string;
  error: string;
  errorDim: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
};

export const schemeToColors = (
  scheme?: DynamicScheme
): MaterialDynamicColorsRecord => {
  return scheme
    ? {
        primaryPaletteKeyColor: hexFromArgb(scheme.primaryPaletteKeyColor),
        secondaryPaletteKeyColor: hexFromArgb(scheme.secondaryPaletteKeyColor),
        tertiaryPaletteKeyColor: hexFromArgb(scheme.tertiaryPaletteKeyColor),
        neutralPaletteKeyColor: hexFromArgb(scheme.neutralPaletteKeyColor),
        neutralVariantPaletteKeyColor: hexFromArgb(
          scheme.neutralVariantPaletteKeyColor
        ),
        errorPaletteKeyColor: hexFromArgb(scheme.errorPaletteKeyColor),
        background: hexFromArgb(scheme.background),
        onBackground: hexFromArgb(scheme.onBackground),
        surface: hexFromArgb(scheme.surface),
        surfaceDim: hexFromArgb(scheme.surfaceDim),
        surfaceBright: hexFromArgb(scheme.surfaceBright),
        surfaceContainerLowest: hexFromArgb(scheme.surfaceContainerLowest),
        surfaceContainerLow: hexFromArgb(scheme.surfaceContainerLow),
        surfaceContainer: hexFromArgb(scheme.surfaceContainer),
        surfaceContainerHigh: hexFromArgb(scheme.surfaceContainerHigh),
        surfaceContainerHighest: hexFromArgb(scheme.surfaceContainerHighest),
        onSurface: hexFromArgb(scheme.onSurface),
        surfaceVariant: hexFromArgb(scheme.surfaceVariant),
        onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
        outline: hexFromArgb(scheme.outline),
        outlineVariant: hexFromArgb(scheme.outlineVariant),
        inverseSurface: hexFromArgb(scheme.inverseSurface),
        inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
        shadow: hexFromArgb(scheme.shadow),
        scrim: hexFromArgb(scheme.scrim),
        surfaceTint: hexFromArgb(scheme.surfaceTint),
        primary: hexFromArgb(scheme.primary),
        primaryDim: hexFromArgb(scheme.primaryDim),
        onPrimary: hexFromArgb(scheme.onPrimary),
        primaryContainer: hexFromArgb(scheme.primaryContainer),
        onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
        inversePrimary: hexFromArgb(scheme.inversePrimary),
        primaryFixed: hexFromArgb(scheme.primaryFixed),
        primaryFixedDim: hexFromArgb(scheme.primaryFixedDim),
        onPrimaryFixed: hexFromArgb(scheme.onPrimaryFixed),
        onPrimaryFixedVariant: hexFromArgb(scheme.onPrimaryFixedVariant),
        secondary: hexFromArgb(scheme.secondary),
        secondaryDim: hexFromArgb(scheme.secondaryDim),
        onSecondary: hexFromArgb(scheme.onSecondary),
        secondaryContainer: hexFromArgb(scheme.secondaryContainer),
        onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
        secondaryFixed: hexFromArgb(scheme.secondaryFixed),
        secondaryFixedDim: hexFromArgb(scheme.secondaryFixedDim),
        onSecondaryFixed: hexFromArgb(scheme.onSecondaryFixed),
        onSecondaryFixedVariant: hexFromArgb(scheme.onSecondaryFixedVariant),
        tertiary: hexFromArgb(scheme.tertiary),
        tertiaryDim: hexFromArgb(scheme.tertiaryDim),
        onTertiary: hexFromArgb(scheme.onTertiary),
        tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
        onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
        tertiaryFixed: hexFromArgb(scheme.tertiaryFixed),
        tertiaryFixedDim: hexFromArgb(scheme.tertiaryFixedDim),
        onTertiaryFixed: hexFromArgb(scheme.onTertiaryFixed),
        onTertiaryFixedVariant: hexFromArgb(scheme.onTertiaryFixedVariant),
        error: hexFromArgb(scheme.error),
        errorDim: hexFromArgb(scheme.errorDim),
        onError: hexFromArgb(scheme.onError),
        errorContainer: hexFromArgb(scheme.errorContainer),
        onErrorContainer: hexFromArgb(scheme.onErrorContainer),
      }
    : {
        primaryPaletteKeyColor: "",
        secondaryPaletteKeyColor: "",
        tertiaryPaletteKeyColor: "",
        neutralPaletteKeyColor: "",
        neutralVariantPaletteKeyColor: "",
        errorPaletteKeyColor: "",
        background: "",
        onBackground: "",
        surface: "",
        surfaceDim: "",
        surfaceBright: "",
        surfaceContainerLowest: "",
        surfaceContainerLow: "",
        surfaceContainer: "",
        surfaceContainerHigh: "",
        surfaceContainerHighest: "",
        onSurface: "",
        surfaceVariant: "",
        onSurfaceVariant: "",
        outline: "",
        outlineVariant: "",
        inverseSurface: "",
        inverseOnSurface: "",
        shadow: "",
        scrim: "",
        surfaceTint: "",
        primary: "",
        primaryDim: "",
        onPrimary: "",
        primaryContainer: "",
        onPrimaryContainer: "",
        inversePrimary: "",
        primaryFixed: "",
        primaryFixedDim: "",
        onPrimaryFixed: "",
        onPrimaryFixedVariant: "",
        secondary: "",
        secondaryDim: "",
        onSecondary: "",
        secondaryContainer: "",
        onSecondaryContainer: "",
        secondaryFixed: "",
        secondaryFixedDim: "",
        onSecondaryFixed: "",
        onSecondaryFixedVariant: "",
        tertiary: "",
        tertiaryDim: "",
        onTertiary: "",
        tertiaryContainer: "",
        onTertiaryContainer: "",
        tertiaryFixed: "",
        tertiaryFixedDim: "",
        onTertiaryFixed: "",
        onTertiaryFixedVariant: "",
        error: "",
        errorDim: "",
        onError: "",
        errorContainer: "",
        onErrorContainer: "",
      };
};

export const createMaterialColorScheme = (
  sourceColor: Hct,
  isDark: boolean
): MaterialDynamicColorsRecord => {
  const scheme = DynamicScheme.from({
    sourceColorHct: sourceColor,
    isDark,
    contrastLevel: 0,
    variant: Variant.TONAL_SPOT,
    platform: Platform.PHONE,
    specVersion: SpecVersion.SPEC_2025,
  });
  const colors = schemeToColors(scheme);
  return colors;
};
