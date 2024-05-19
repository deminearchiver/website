import { fallbackVar, style } from "@vanilla-extract/css";
import { splashTheme } from "../splash";
import { THEME } from "../../theme/contract.css";
import { recipe } from "@vanilla-extract/recipes";

export const iconButtonStyle = recipe({
  base: {
    WebkitTapHighlightColor: "transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    border: "none",
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 8,
    outline: "none",
    backgroundColor: "transparent",
    color: "transparent",
    cursor: "pointer",
    ":disabled": {
      cursor: "none",
      pointerEvents: "none",
    },
    "::before": {
      content: "",
      position: "absolute",
      width: "max(48px, 100%)",
      height: "max(48px, 100%)",
    },
  },
  variants: {
    variant: {
      regular: {
        color: THEME.color.onSurfaceVariant,
        vars: {
          [splashTheme.hoverColor]: THEME.color.onSurfaceVariant,
          [splashTheme.pressedColor]: THEME.color.onSurfaceVariant,
        },
      },
      filled: {
        backgroundColor: THEME.color.primary,
        color: THEME.color.onPrimary,
        vars: {
          [splashTheme.hoverColor]: THEME.color.onPrimary,
          [splashTheme.pressedColor]: THEME.color.onPrimary,
        },
      },
      tonal: {
        backgroundColor: THEME.color.secondaryContainer,
        color: THEME.color.onSecondaryContainer,
        vars: {
          [splashTheme.hoverColor]: THEME.color.onSecondaryContainer,
          [splashTheme.pressedColor]: THEME.color.onSecondaryContainer,
        },
      },
      outlined: {
        backgroundColor: THEME.color.surface,
        color: THEME.color.onSurfaceVariant,
        "::after": {
          content: "",
          position: "absolute",
          inset: 0,
          border: `1px solid ${THEME.color.outline}`,
          borderRadius: "inherit",
        },
        vars: {
          [splashTheme.hoverColor]: THEME.color.onSurfaceVariant,
          [splashTheme.pressedColor]: THEME.color.onSurfaceVariant,
        },
      },
    },
  },
  defaultVariants: {
    variant: "regular",
  },
});

