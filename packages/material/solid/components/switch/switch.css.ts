import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { splashTheme } from "../splash";
import { THEME } from "../../theme/contract.css";

export const switchStyle = style({
  WebkitTapHighlightColor: "transparent",
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  width: 52,
  height: 32,
  borderRadius: 9999,
  cursor: "pointer",
});

export const switchUnselectedStyle = style({
  vars: {
    [splashTheme.hoverColor]: THEME.color.onSurface,
    [splashTheme.pressedColor]: THEME.color.onSurface,
  },
});
export const switchSelectedStyle = style({
  vars: {
    [splashTheme.hoverColor]: THEME.color.primary,
    [splashTheme.pressedColor]: THEME.color.primary,
  },
});
export const switchDisabledStyle = style({});

export const switchInputStyle = style({
  appearance: "none",
  position: "absolute",
  width: "100%",
  height: 48,
  zIndex: 1,
  cursor: "inherit",
  outline: "none",
});

export const switchTrackStyle = recipe({
  base: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "::before": {
      content: "",
      display: "flex",
      position: "absolute",
      borderRadius: "inherit",
      width: "100%",
      height: "100%",
      backgroundColor: THEME.color.surfaceContainerHighest,
      transitionProperty: "opacity, background-color",
      transitionTimingFunction: "linear",
      transitionDuration: "67ms",
    },
  },
  variants: {
    selected: {
      false: {
        "::before": {
          backgroundColor: THEME.color.surfaceContainerHighest,
          border: `2px solid ${THEME.color.outline}`,
        },
      },
      true: {
        "::before": {
          backgroundColor: THEME.color.primary,
        },
      },
    }
  }
});



export const switchHandleContainerStyle = recipe({
  base: {
    position: "relative",
    display: "flex",
    placeItems: "center",
    placeContent: "center",
    transition: `margin 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
    borderRadius: "inherit",
  },
  variants: {
    selected: {
      false: {
        marginInlineEnd: 52 - 32,
      },
      true: {
        marginInlineStart: 52 - 32,
      },
    },
  },
})

export const switchHandleStyle = recipe({
  base: {
    borderRadius: "inherit",
    transformOrigin: "center center",
    transitionProperty: "width, height",
    transitionDuration: "250ms",
    transitionTimingFunction: THEME.easing.standard,
    zIndex: 0,

    "::before": {
      content: "",
      position: "absolute",
      display: "flex",
      inset: 0,
      borderRadius: "inherit",
      transition: "background-color 67ms linear 0s",
    },
    selectors: {
      [`${switchStyle}:active &`]: {
        width: 28,
        height: 28,
        transitionDuration: "100ms",
        transitionTimingFunction: "linear",
      },
    },
  },
  variants: {
    selected: {
      false: {
        width: 16,
        height: 16,
        "::before": {
          backgroundColor: THEME.color.outline,
        },
        selectors: {
          [`${switchStyle}:hover &::before`]: {
            "backgroundColor": THEME.color.outline,
          },
        },
      },
      true: {
        width: 24,
        height: 24,
        "::before": {
          backgroundColor: THEME.color.onPrimary,
        },
        selectors: {
          [`${switchStyle}:hover &::before`]: {
            "backgroundColor": THEME.color.onPrimary,
          },
        },
      },
    },
    icon: {
      false: {},
      true: {
        width: 24,
        height: 24,
      },
    },
  },
});

export const switchIconsStyle = recipe({
  base: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    placeContent: "center",
  },
  variants: {
    selected: {
      false: {
        color: THEME.color.surfaceContainerHighest,
      },
      true: {
        color: THEME.color.primary,
      },
    }
  }
});
