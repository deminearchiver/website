import { globalStyle, createGlobalTheme, assignVars } from "@vanilla-extract/css";
import { createMaterialTheme } from "@material/solid/theme";
import { Hct } from "@material/material-color-utilities";
import { test } from "./astro.css";

const { contract, dark, light } = createMaterialTheme({
  color: {
    seed: Hct.fromInt(0xFF7D73FE),
    custom: [
      "success",
      "warning",
    ]
  }
});

export const THEME = contract();

/* Color seeds I used in Material Theme Builder */
const SUCCESS_SEED = "#008425";
const WARNING_SEED = "#D9B229";

export const LIGHT_THEME = light({
  successPaletteKeyColor: SUCCESS_SEED,
  success: "#3b693a",
  onSuccess: "#ffffff",
  successContainer: "#bcf0b4",
  onSuccessContainer: "#002204",

  warningPaletteKeyColor: WARNING_SEED,
  warning: "#725c0c",
  onWarning: "#ffffff",
  warningContainer: "#ffe086",
  onWarningContainer: "#231b00",
});
export const DARK_THEME = dark({
  successPaletteKeyColor: SUCCESS_SEED,
  success: "#a1d39a",
  onSuccess: "#09390f",
  successContainer: "#235024",
  onSuccessContainer: "#bcf0b4",

  warningPaletteKeyColor: WARNING_SEED,
  warning: "#e1c46d",
  onWarning: "#3c2f00",
  warningContainer: "#574500",
  onWarningContainer: "#ffe086",
});
