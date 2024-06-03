import { style } from "@vanilla-extract/css";
import { THEME } from "../../theme/contract.css";
import { recipe } from "@vanilla-extract/recipes";

export const tooltipStyle = recipe({
  base: {
    border: "none",
    margin: 0,

    position: "absolute",
    top: 0,
    left: 0,
    width: "max-content",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    transition: `opacity 100ms linear`,
  },
  variants: {
    variant: {
      plain: {
        pointerEvents: "none",
        minHeight: 24,
        paddingInline: 8,

        backgroundColor: THEME.color.inverseSurface,
        borderRadius: 4,

        fontFamily: THEME.text.body.small.family,
        fontSize: THEME.text.body.small.size,
        fontWeight: THEME.text.body.small.weight,
        lineHeight: THEME.text.body.small.lineHeight,
        letterSpacing: THEME.text.body.small.letterSpacing,
        color: THEME.color.inverseOnSurface,
      },
      rich: {
        paddingInline: 16,
        paddingBlock: "12px 8px",
        backgroundColor: THEME.color.surfaceContainer,
        borderRadius: 12,

        fontFamily: THEME.text.body.medium.family,
        fontSize: THEME.text.body.medium.size,
        fontWeight: THEME.text.body.medium.weight,
        lineHeight: THEME.text.body.medium.lineHeight,
        letterSpacing: THEME.text.body.medium.letterSpacing,
        color: THEME.color.onSurfaceVariant,
      },
    },
  },

});
