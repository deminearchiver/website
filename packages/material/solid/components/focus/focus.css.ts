import { keyframes } from "@vanilla-extract/css";
import { THEME } from "../../theme/contract.css";
import { recipe } from "@vanilla-extract/recipes";

const duration = "600ms";

const growAnimation = keyframes({
  from: {
    outlineWidth: 0,
  },
  to: {
    outlineWidth: 8,
  }
});
const shrinkAnimation = keyframes({
  from: {
    outlineWidth: 8,
  },
});

export const focusStyle = recipe({
  base: {
    animationName: `${growAnimation}, ${shrinkAnimation}`,
    animationDelay: `0s, calc(${duration} * 0.25)`,
    animationDuration: `calc(${duration} * 0.25), calc(${duration} * 0.75)`,
    animationTimingFunction: THEME.easing.emphasized,
    position: "absolute",
    display: "none",
    pointerEvents: "none",
    boxSizing: "border-box",
    borderRadius: "inherit",
    inset: -2,
    color: THEME.color.secondary,
    outline: `3px solid currentColor`,
    zIndex: 1,
    "@media": {
      "(prefers-reduced-motion)": {
        animation: "none",
      }
    }
  },
  variants: {
    visible: {
      true: {
        display: "flex",
      },
    },
  },
});
