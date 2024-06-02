import { style } from "@vanilla-extract/css";
import { THEME } from "../../theme/contract.css";
import { recipe } from "@vanilla-extract/recipes";

export const plainTooltipStyle = style({
  border: "none",
  margin: 0,
  pointerEvents: "none",

  position: "absolute",
  top: 0,
  left: 0,
  width: "max-content",
  minHeight: 24,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: 8,

  backgroundColor: THEME.color.inverseSurface,
  borderRadius: 4,

  fontFamily: THEME.text.body.small.family,
  fontSize: THEME.text.body.small.size,
  fontWeight: THEME.text.body.small.weight,
  lineHeight: THEME.text.body.small.lineHeight,
  letterSpacing: THEME.text.body.small.letterSpacing,
  color: THEME.color.inverseOnSurface,

  transition: `opacity ${THEME.duration.short2} linear`,
});
