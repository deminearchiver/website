import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { THEME } from "../../styles/theme/theme.css";
import { splashTheme } from "@material/solid/components/splash";

const OPEN_DURATION = "600ms";
const CLOSE_DURATION = "300ms";


export const passthroughStyle = style({
  display: "contents",
});

const dialogEnter = keyframes({
  from: {
    width: 0,
    translate: "-144px",
  },
});
const dialogExit = keyframes({
  to: {
    width: 0,
    translate: "-144px",
  },
});
const backdropEnter = keyframes({
  from: {
    opacity: 0,
  },
});
const backdropExit = keyframes({
  to: {
    opacity: 0
  },
});


export const drawerDialogStyle = recipe({
  base: {
    position: "fixed",
    width: 360,
    top: 0,
    left: 0,
    bottom: 0,
    minHeight: "100%",
    margin: 0,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: THEME.color.surfaceContainerLow,
    border: "none",
    outline: "none",
    overflow: "hidden",
    "::backdrop": {
      backgroundColor: "black",
      opacity: 0.32,
      pointerEvents: "all",
      cursor: "pointer",
    },
  },
  variants: {
    animation: {
      enter: {
        animation: `${dialogEnter} ${OPEN_DURATION} ${THEME.easing.emphasizedDecelerate} forwards`,
        "::backdrop": {
          animation: `${backdropEnter} ${OPEN_DURATION} linear forwards`,
        },
      },
      exit: {
        animation: `${dialogExit} ${CLOSE_DURATION} ${THEME.easing.emphasizedAccelerate} forwards`,
        "::backdrop": {
          animation: `${backdropExit} ${CLOSE_DURATION} linear forwards`,
        },
      },
    },
  },
});


export const drawerContentStyle = recipe({
  base: {
    position: "absolute",
    inset: 0,
    padding: "12px",
  },

});

export const drawerListStyle = style({
  listStyle: "none",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
});
export const drawerDestinationStyle = recipe({
  base: {
    WebkitTapHighlightColor: "transparent",
    position: "relative",
    width: "100%",
    height: 56,
    borderRadius: 9999,
    textDecoration: "none",
    outline: "none",
  },
  variants: {
    selected: {
      false: {
        color: THEME.color.onSurfaceVariant,
        vars: {
          [splashTheme.hoverColor]: THEME.color.onSecondaryContainer,
          [splashTheme.pressedColor]: THEME.color.onSecondaryContainer,
        },
      },
      true: {
        color: THEME.color.onSecondaryContainer,
        "::after": {
          content: "",
          position: "absolute",
          inset: 0,
          backgroundColor: THEME.color.secondaryContainer,
          borderRadius: "inherit",
          zIndex: -1,
        },
        cursor: "none",
        pointerEvents: "none",
      },
    }
  },
  defaultVariants: {
    selected: false,
  },
});

const destinationEnter = keyframes({
  "0%, 33.3%": {
    opacity: 0,
  },
});
const destinationExit = keyframes({
  "50%, 100%": {
    opacity: 0
  },
});

export const drawerDestinationContentStyle = recipe({
  base: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "0 16px",
    gap: 12,

    fontFamily: THEME.text.label.large.family,
    fontSize: THEME.text.label.large.size,
    fontWeight: THEME.text.label.large.weight,
    lineHeight: THEME.text.label.large.lineHeight,
    letterSpacing: THEME.text.label.large.letterSpacing,
  },
  variants: {
    animation: {
      enter: {
        animation: `${destinationEnter} ${OPEN_DURATION} ${THEME.easing.emphasizedDecelerate} forwards`,
      },
      exit: {
        animation: `${destinationExit} ${CLOSE_DURATION} ${THEME.easing.emphasizedAccelerate} forwards`,
      },
    },
  },
});
