import { type ComplexStyleRule, fallbackVar, style } from "@vanilla-extract/css";
import { splashTheme } from "./theme.css";

const sharedStyles: ComplexStyleRule = {
  borderRadius: "inherit",
  inset: 0,
  position: "absolute",
  overflow: "hidden",
};

const sharedPseudoStyles: ComplexStyleRule = {
  content: "",
  opacity: 0,
  position: "absolute",
};


export const splashStyle = style({
  ...sharedStyles,

  display: "flex",
  margin: "auto",
  pointerEvents: "none",

  "@media": {
    "(forced-colors: active)": {
      display: "none",
    },
  },
});


export const surfaceStyle = style({
  ...sharedStyles,
  WebkitTapHighlightColor: "transparent",
  "::before": {
    ...sharedPseudoStyles,
    backgroundColor: splashTheme.hoverColor,
    inset: 0,
    transition: "opacity 15ms linear, background-color 15ms linear"
  },
  "::after": {
    ...sharedPseudoStyles,
    background: `radial-gradient(
      closest-side,
      ${splashTheme.pressedColor} max(calc(100% - 70px), 65%),
      transparent 100%
    )`,
    // background: css.radialGradient(
    //   { size: "closest-side" },
    //   [`${theme.color.onSurface}`, "max(calc(100% - 70px), 65%)"],
    //   ["transparent", "100%"]
    // ),
    transformOrigin: "center center",
    transition: "opacity 375ms linear",
  },
});

export const surfaceHoveredStyle = style({
  "::before": {
    backgroundColor: splashTheme.hoverColor,
    opacity: fallbackVar(splashTheme.hoverOpacity, "0.08"),
  },
});
export const surfacePressedStyle = style({
  "::after": {
    opacity: fallbackVar(splashTheme.pressedOpacity, "0.1"),
    transitionDuration: "105ms",
  },
});
