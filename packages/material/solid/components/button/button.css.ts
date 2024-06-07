import { recipe } from "@vanilla-extract/recipes";
import { THEME } from "../../theme/contract.css";
import { splashTheme } from "../splash";
import { style } from "@vanilla-extract/css";

export const buttonStyle = recipe({
  base: {
    position: "relative",
    height: 40,
    borderRadius: 9999,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    appearance: "none",
    background: "none",
    border: "none",
    outline: "none",

    textDecoration: "none",
    userSelect: "none",
    cursor: "pointer",

    fontFamily: THEME.text.label.large.family,
    fontSize: THEME.text.label.large.size,
    fontWeight: THEME.text.label.large.weight,
    lineHeight: THEME.text.label.large.lineHeight,
    letterSpacing: THEME.text.label.large.letterSpacing,
  },
  variants: {
    leading: {
      false: {
        paddingLeft: 24,
      },
      true: {
        paddingLeft: 16,
      }
    },
    trailing: {
      false: {
        paddingRight: 24,
      },
      true: {
        paddingRight: 16,
      }
    },
    variant: {
      elevated: {
        backgroundColor: THEME.color.surfaceContainerLow,
        color: THEME.color.primary,
        vars: {
          [splashTheme.hoverColor]: THEME.color.primary,
          [splashTheme.pressedColor]: THEME.color.primary,
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
        color: THEME.color.primary,
        // border: `1px solid ${THEME.color.outline}`,
        vars: {
          [splashTheme.hoverColor]: THEME.color.primary,
          [splashTheme.pressedColor]: THEME.color.primary,
        },
      },
      text: {
        color: THEME.color.primary,
        vars: {
          [splashTheme.hoverColor]: THEME.color.primary,
          [splashTheme.pressedColor]: THEME.color.primary,
        },
      },
    }
  }
});

export const buttonOutlineStyle = style({
  position: "absolute",
  inset: 0,
  border: `1px solid ${THEME.color.outline}`,
  borderRadius: "inherit",
  selectors: {
    [`${buttonStyle.classNames.base}:focus-visible > &`]: {
      borderColor: THEME.color.primary,
    },
  },
});
