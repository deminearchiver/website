import { splashTheme } from "@material/solid/components/splash";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { THEME } from "../../styles/theme";

const DURATION = "600ms";
const EASING = THEME.easing.emphasized;

export const searchAnchorStyle = style({
  WebkitTapHighlightColor: "transparent",

  appearance: "none",
  border: "none",
  outline: "none",
  position: "relative",

  borderRadius: 9999,
  cursor: "pointer",
  backgroundColor: THEME.color.secondaryContainer,
  minWidth: 40,
  height: 40,
  vars: {
    [splashTheme.hoverColor]: THEME.color.onSecondaryContainer,
    [splashTheme.pressedColor]: THEME.color.onSecondaryContainer,
  },
});

export const searchAnchorContentStyle = style({

  display: "grid",
  placeItems: "center",
  placeContent: "center",



  color: THEME.color.onSecondaryContainer,

  height: "inherit",
  minWidth: "inherit",
  borderRadius: "inherit",

  gridTemplateColumns: "24px 0fr",
  gap: 0,
  overflow: "hidden",

  paddingInline: 8,

  transitionProperty: "grid-template-columns, gap, padding-inline",
  transitionDuration: DURATION,
  transitionTimingFunction: EASING,
  "@media": {
    "only screen and (min-width: 1200px)": {
      gap: 8,
      gridTemplateColumns: "18px 1fr",
      paddingInline: "16px 24px",
    },
  },
});

export const searchAnchorIconStyle = style({

  width: 24,
  height: 24,
  gridColumn: 1,

  transitionProperty: "width, height",
  transitionDuration: DURATION,
  transitionTimingFunction: EASING,


  "@media": {
    "only screen and (min-width: 1200px)": {
      width: 18,
      height: 18,
    },
  },
});
export const searchAnchorLabelStyle = style({
  width: 0,
  minWidth: 0,
  gridColumn: 2,

  display: "flex",
  alignItems: "center",

  transitionProperty: "width, opacity, translate",
  transitionDuration: DURATION,
  transitionTimingFunction: EASING,

  fontFamily: THEME.text.label.large.family,
  fontSize: THEME.text.label.large.size,
  fontWeight: THEME.text.label.large.weight,
  lineHeight: THEME.text.label.large.lineHeight,
  letterSpacing: THEME.text.label.large.letterSpacing,

  translate: 8,
  opacity: 0,

  "@media": {
    "only screen and (min-width: 1200px)": {
      width: "100%",
      translate: 0,
      opacity: 1,
    },
  },
});
