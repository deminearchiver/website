import { recipe } from "@vanilla-extract/recipes";
import { THEME } from "../../theme/contract.css";
import { splashTheme } from "../splash";
import { style } from "@vanilla-extract/css";

export const cardStyle = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  zIndex: 0,
  borderRadius: 12,
  vars: {
    [splashTheme.hoverColor]: THEME.color.onSurface,
    [splashTheme.pressedColor]: THEME.color.onSurface,
  },
});

const BASE = {
  position: "absolute",
  borderRadius: "inherit",
  inset: "0",
  pointerEvents: "none",
} as const;

export const cardBackgroundStyle = recipe({
  base: {
    ...BASE,
    zIndex: -1,
  },
  variants: {
    variant: {
      elevated: {
        backgroundColor: THEME.color.surfaceContainerLow,
      },
      filled: {
        backgroundColor: THEME.color.surfaceContainerHighest
      },
      outlined: {
        backgroundColor: THEME.color.surface,
      }
    }
  },
});
export const cardOutlineStyle = recipe({
  base: {
    ...BASE,
    zIndex: 1,
    border: "1px solid transparent",
  },
  variants: {
    variant: {
      elevated: {},
      filled: {},
      outlined: {
        borderColor: THEME.color.outlineVariant,
      }
    }
  },
});
