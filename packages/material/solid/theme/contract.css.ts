import { createThemeContract } from "@vanilla-extract/css";
import { schemeToColors } from "./color";
import { DEFAULT_TYPOGRAPHY } from "./default/typography";

export const THEME = createThemeContract({
  color: schemeToColors(),
  easing: {
    emphasized: "",
    emphasizedAccelerate: "",
    emphasizedDecelerate: "",
    standard: "",
    standardAccelerate: "",
    standardDecelerate: "",
  },
  duration: {
    short1: "",
    short2: "",
    short3: "",
    short4: "",
    medium1: "",
    medium2: "",
    medium3: "",
    medium4: "",
    long1: "",
    long2: "",
    long3: "",
    long4: "",
    extraLong1: "",
    extraLong2: "",
    extraLong3: "",
    extraLong4: "",
  },
  text: DEFAULT_TYPOGRAPHY,
});
