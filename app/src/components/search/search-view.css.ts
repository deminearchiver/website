import { recipe } from "@vanilla-extract/recipes";
import { THEME } from "../../styles/theme/contract.css";
import { createVar, keyframes, style } from "@vanilla-extract/css";
import { listItemTheme } from "@material/solid/components/list";

const OPEN_DURATION = "600ms";
const CLOSE_DURATION = "200ms";

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


export const searchDialogStyle = recipe({
  base: {
    width: "100dvw",
    height: "100dvh",
    maxWidth: "100%",
    maxHeight: "100%",
    margin: 0,
    placeItems: "center",
    placeContent: "center",
    background: "none",
    border: "none",
    outline: "none",
    overflow: "visible",
    selectors: {
      "&[open]": {
        display: "grid",
      }
    },
    "::backdrop": {
      backgroundColor: THEME.color.scrim,
      opacity: 0.32,
      pointerEvents: "all",
      cursor: "pointer",
    },
  },
  variants: {
    state: {
      entering: {
        "::backdrop": {
          animation: `${backdropEnter} ${OPEN_DURATION} linear forwards`,
        },
      },
      exiting: {
        "::backdrop": {
          animation: `${backdropExit} ${CLOSE_DURATION} linear forwards`,
        },
      },
    },
  },
});

const DOCKED_BORDER_RADIUS = "calc(min(100dvw, 720px) / 4)";

const viewDockedEnter = keyframes({
  from: {
    scale: "0.5 0",
    translate: "0 -50%",
    // opacity: 0,
    borderRadius: 112,
  },
});
const viewDockedExit = keyframes({
  to: {
    translate: "0 -32.5%",
    scale: "0.5 0.35",
    opacity: 0,
    borderRadius: 112,
  },
});

const FULLSCREEN_BORDER_RADIUS = "0 0 50dvw 50dvw";

const viewFullscreenEnter = keyframes({
  from: {
    height: 72,
    opacity: 0,
    borderRadius: FULLSCREEN_BORDER_RADIUS,
  },
});
const viewFullscreenExit = keyframes({
  to: {
    height: "35%",
    opacity: 0,
    borderRadius: FULLSCREEN_BORDER_RADIUS,
  },
});

export const searchViewStyle = recipe({
  base: {
    minWidth: 360,
    maxWidth: "calc(100dvw - 56px * 2)",
    width: "min(100dvw, 720px)", // includes margin
    minHeight: 240,
    maxHeight: "calc(100dvh / 3 * 2)",
    backgroundColor: THEME.color.surfaceContainerHigh,
    borderRadius: 28,
    overflowX: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",

    "@media": {
      "screen and (max-width: 599px)": {
        position: "absolute",
        minWidth: "100%",
        maxWidth: "100%",
        width: "100%",
        height: "100%",
        // minHeight: "100%",
        maxHeight: "100%",
        inset: 0,
        borderRadius: 0,
      }
    },
  },
  variants: {
    state: {
      entering: {
        animation: `${viewDockedEnter} ${OPEN_DURATION} ${THEME.easing.emphasizedDecelerate} forwards`,
        "@media": {
          "screen and (max-width: 599px)": {
            animation: `${viewFullscreenEnter} ${OPEN_DURATION} ${THEME.easing.emphasizedDecelerate} forwards`,
          },
        },
      },
      exiting: {
        animation: `${viewDockedExit} ${CLOSE_DURATION} ${THEME.easing.emphasizedAccelerate} forwards`,
        "@media": {
          "screen and (max-width: 599px)": {
            animation: `${viewFullscreenExit} ${CLOSE_DURATION} ${THEME.easing.emphasizedAccelerate} forwards`,
          },
        },

      },
    }
  }
});

export const searchViewBarStyle = style({
  position: "sticky",
  top: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: 8, // see below
  padding: "0px 8px", // 24 + 8 + 8 = 40 (left / right padding of the icon is 8px) => 16 (bar) = 8 (bar) + 8 (icon) => bar padding must be 8px
  // color: THEME.color.onSurface,
  backgroundColor: THEME.color.surfaceContainerHigh,
  width: "100%",
  minHeight: 56,
  height: 56,
  // borderRadius: 9999,
  fontFamily: THEME.text.body.large.family,
  fontSize: THEME.text.body.large.size,
  fontWeight: THEME.text.body.large.weight,
  lineHeight: THEME.text.body.large.lineHeight,
  letterSpacing: THEME.text.body.large.letterSpacing,
  zIndex: 1,
  "@media": {
    "screen and (max-width: 599px)": {
      minHeight: 72,
      height: 72,
    },
  }
});

export const searchViewBarLeadingStyle = style({
  color: THEME.color.onSurface,
});


export const searchViewInputStyle = style({
  appearance: "none",
  background: "none",
  border: "none",
  height: "100%",
  flexGrow: 1,
  color: THEME.color.onSurface,
  outline: "none",
  "::placeholder": {
    color: THEME.color.onSurfaceVariant,
  },
});


export const searchViewResultsStyle = style({
  flexGrow: 1,
});

const appearAnimation = keyframes({
  to: {
    opacity: 1,
    translate: 0,
  },
});

export const searchResultIndex = createVar();
export const searchResultStyle = style({
  opacity: 0,
  translate: "0 32px",
  animationName: appearAnimation,
  animationDuration: "600ms",
  animationTimingFunction: THEME.easing.emphasizedDecelerate,
  animationDelay: `calc(100ms * ${searchResultIndex})`,
  animationFillMode: "forwards",
});
export const searchSubResultStyle = style({
  vars: {
    [listItemTheme.padding]: "8px 32px",
  },
});

export const searchResultsMessageStyle = style({
  flexGrow: 0.8,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  color: THEME.color.onSurfaceVariant,
  fontFamily: THEME.text.body.large.family,
  fontSize: THEME.text.body.large.size,
  fontWeight: THEME.text.body.large.weight,
  lineHeight: THEME.text.body.large.lineHeight,
  letterSpacing: THEME.text.body.large.letterSpacing,
  padding: "0 24px 24px 24px",
});
