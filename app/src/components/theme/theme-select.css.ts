import { style } from "@vanilla-extract/css";
import { THEME } from "../../styles/theme";
import { splashTheme } from "@material/solid/components/splash";
import { recipe } from "@vanilla-extract/recipes";

export const themeSelectStyle = recipe({
  base: {
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",


    position: "relative",
    width: "fit-content",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",

    fontFamily: THEME.text.body.large.family,
    fontSize: THEME.text.body.large.size,
    fontWeight: THEME.text.body.large.weight,
    lineHeight: THEME.text.body.large.lineHeight,
    letterSpacing: THEME.text.body.large.letterSpacing,

    vars: {
      [splashTheme.hoverColor]: THEME.color.onSurface,
      [splashTheme.pressedColor]: THEME.color.onSurface,
    }
  },
  variants: {
    wide: {
      false: {
        borderRadius: 9999,
        padding: "8px 16px",
        marginInline: 16,
      },
      true: {
        justifyContent: "space-between",
        minWidth: 220,
        height: "100%",
        borderRadius: 0,
        padding: "0px 24px",
      },
    },
  },
});

export const themeSelectControlStyle = recipe({
  variants: {
    contained: {
      false: {
        marginInlineEnd: 16,
      },
    }
  }
});

export const themeSelectLabelStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
});

export const themeSelectSubtitleStyle = style({
  fontFamily: THEME.text.body.medium.family,
  fontSize: THEME.text.body.medium.size,
  fontWeight: THEME.text.body.medium.weight,
  lineHeight: THEME.text.body.medium.lineHeight,
  letterSpacing: THEME.text.body.medium.letterSpacing,
  color: THEME.color.onSurfaceVariant,
});
