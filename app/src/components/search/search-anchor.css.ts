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
  height: 40,

  display: "grid",
  placeItems: "center",
  placeContent: "center",


  backgroundColor: THEME.color.secondaryContainer,
  borderRadius: 9999,

  color: THEME.color.onSecondaryContainer,

  cursor: "pointer",
  overflow: "hidden",



  gridTemplateColumns: "24px 0fr",
  paddingInline: 8,
  gap: 0,

  minWidth: 40,

  transitionProperty: "height, color, background-color, min-width, grid-template-columns, padding-inline, gap",
  transitionDuration: DURATION,
  transitionTimingFunction: EASING,

  vars: {
    [splashTheme.hoverColor]: THEME.color.onSecondaryContainer,
    [splashTheme.pressedColor]: THEME.color.onSecondaryContainer,
  },
  "@media": {
    "only screen and (min-width: 1200px)": {
      paddingInline: "16px 24px",
      gap: 8,
      gridTemplateColumns: "18px 1fr",
      minWidth: 100, // TODO: somehow make it auto or smth
    },
    // "only screen and (min-width: 1200px)": {
    //   gridTemplateColumns: "24px 1fr",
    //   height: 56,
    //   minWidth: 360,
    //   maxWidth: 720,
    //   paddingInline: 16,
    //   backgroundColor: THEME.color.surfaceContainerHigh,
    //   color: THEME.color.onSurfaceVariant,
    //   gap: 16,
    //   vars: {
    //     [splashTheme.hoverColor]: THEME.color.onSurfaceVariant,
    //     [splashTheme.pressedColor]: THEME.color.onSurfaceVariant,
    //   },
    // },
  },
});

export const searchAnchorIconStyle = style({

  width: 24,
  height: 24,
  gridColumn: 1,

  transitionProperty: "color, width, height",
  transitionDuration: DURATION,
  transitionTimingFunction: EASING,


  "@media": {
    "only screen and (min-width: 1200px)": {
      width: 18,
      height: 18,
    },
    // "only screen and (min-width: 1200px)": {
    //   width: 24,
    //   height: 24,
    //   color: THEME.color.onSurface,
    // },
  },
});
export const searchAnchorLabelStyle = style({
  width: 0,
  minWidth: 0,
  gridColumn: 2,

  display: "flex",
  alignItems: "center",

  transitionProperty: `
    width, opacity, translate,
    font-family, font-size, font-weight, line-height, letter-spacing
  `,
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
    // "only screen and (min-width: 1200px)": {
    //   fontFamily: THEME.text.body.large.family,
    //   fontSize: THEME.text.body.large.size,
    //   fontWeight: THEME.text.body.large.weight,
    //   lineHeight: THEME.text.body.large.lineHeight,
    //   letterSpacing: THEME.text.body.large.letterSpacing,
    // },
  },
});
