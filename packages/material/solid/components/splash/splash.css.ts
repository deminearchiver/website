import { fallbackVar, style } from "@vanilla-extract/css";
import { splashTheme } from "./theme.css";
import { recipe } from "@vanilla-extract/recipes";

const sharedStyles = style({
  borderRadius: "inherit",
  inset: 0,
  position: "absolute",
  overflow: "hidden",
});

// const sharedPseudoStyles = {
//   content: "",
//   opacity: 0,
//   position: "absolute",
// } as const;

export const splashStyle = style([
  sharedStyles,
  {
    display: "flex",
    margin: "auto",
    pointerEvents: "none",

    "@media": {
      "(forced-colors: active)": {
        display: "none",
      },
    },
  },
]);

// export const surfaceStyle = recipe([
//   sharedStyles,
//   {
//     WebkitTapHighlightColor: "transparent",
//     "::before": {
//       content: "",
//       opacity: 0,
//       position: "absolute",

//       backgroundColor: splashTheme.hoverColor,
//       inset: 0,
//       transition: "opacity 15ms linear, background-color 15ms linear"
//     },
//     "::after": {
//       content: "",
//       opacity: 0,
//       position: "absolute",

//       background: `radial-gradient(
//         closest-side,
//         ${splashTheme.pressedColor} max(calc(100% - 70px), 65%),
//         transparent 100%
//       )`,
//       transformOrigin: "center center",
//       transition: "opacity 375ms linear",
//     },
//   }
// ]);

export const surfaceStyle = recipe({
  base: {
    borderRadius: "inherit",
    inset: 0,
    position: "absolute",
    overflow: "hidden",
    WebkitTapHighlightColor: "transparent",

    "::before": {
      content: "",
      opacity: 0,
      position: "absolute",

      backgroundColor: splashTheme.hoverColor,
      inset: 0,
      transition: "opacity 15ms linear, background-color 15ms linear",
    },
    "::after": {
      content: "",
      opacity: 0,
      position: "absolute",

      background: `radial-gradient(
            closest-side,
            ${splashTheme.pressedColor} max(calc(100% - 70px), 65%),
            transparent 100%
          )`,
      transformOrigin: "center center",
      transition: "opacity 375ms linear",
    },
  },
  variants: {
    hovered: {
      true: {
        "::before": {
          backgroundColor: splashTheme.hoverColor,
          opacity: fallbackVar(splashTheme.hoverOpacity, "0.08"),
        },
      },
    },
    pressed: {
      true: {
        "::after": {
          opacity: fallbackVar(splashTheme.pressedOpacity, "0.1"),
          transitionDuration: "105ms",
        },
      },
    }
  },
});
