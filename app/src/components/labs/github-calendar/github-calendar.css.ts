import { style } from "@vanilla-extract/css";
import { THEME } from "../../../styles/theme";
import { recipe } from "@vanilla-extract/recipes";

export const wrapperStyle = style({
  marginInline: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 24,
});

// export const formStyle = style({
//   width: 300,
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "stretch",
//   gap: 16,
// });

// export const textFieldStyle = style({
//   position: "relative",
//   height: 56,
//   paddingInline: 16,

//   backgroundColor: THEME.color.surfaceContainerHighest,
//   borderRadius: 4,

//   border: `1px solid ${THEME.color.outline}`,
//   outline: "none",

//   fontFamily: THEME.text.body.large.family,
//   fontSize: THEME.text.body.large.size,
//   fontWeight: THEME.text.body.large.weight,
//   lineHeight: THEME.text.body.large.lineHeight,
//   letterSpacing: THEME.text.body.large.letterSpacing,
//   color: THEME.color.onSurface,


//   "::placeholder": {
//     color: THEME.color.onSurfaceVariant,
//   },
//   ":hover": {
//     backgroundColor: `color-mix(in srgb, ${THEME.color.surfaceContainerHighest}, ${THEME.color.onSurface} 8%)`,
//   },
//   ":focus-visible": {
//     borderColor: THEME.color.primary,
//     outline: `1px solid ${THEME.color.primary}`
//   },
// });
export const formStyle = style({
  width: 360,
  display: "grid",
  gridTemplateColumns: "auto auto",
  // flexDirection: "column",
  // alignItems: "stretch",
  placeItems: "stretch",
  placeContent: "center",
  gap: 16,
});

export const textFieldStyle = style({
  position: "relative",
  height: 56,
  paddingInline: 16,

  backgroundColor: THEME.color.surfaceContainerHighest,
  borderRadius: 4,

  border: `1px solid ${THEME.color.outline}`,
  outline: "none",

  fontFamily: THEME.text.body.large.family,
  fontSize: THEME.text.body.large.size,
  fontWeight: THEME.text.body.large.weight,
  lineHeight: THEME.text.body.large.lineHeight,
  letterSpacing: THEME.text.body.large.letterSpacing,
  color: THEME.color.onSurface,


  "::placeholder": {
    color: THEME.color.onSurfaceVariant,
  },
  ":hover": {
    backgroundColor: `color-mix(in srgb, ${THEME.color.surfaceContainerHighest}, ${THEME.color.onSurface} 8%)`,
  },
  ":focus-visible": {
    borderColor: THEME.color.primary,
    outline: `1px solid ${THEME.color.primary}`
  },
});

export const datePickerStyle = style({
  alignSelf: "center",
  height: 40,
  border: "none",
  outline: "none",
  backgroundColor: THEME.color.secondaryContainer,
  borderRadius: 9999,
  paddingInline: 16,

  fontFamily: THEME.text.label.large.family,
  fontSize: THEME.text.label.large.size,
  fontWeight: THEME.text.label.large.weight,
  lineHeight: THEME.text.label.large.lineHeight,
  letterSpacing: THEME.text.label.large.letterSpacing,
  color: THEME.color.onSecondaryContainer,

  cursor: "pointer",

  ":hover": {
    backgroundColor: `color-mix(in srgb, ${THEME.color.secondaryContainer}, ${THEME.color.onSecondaryContainer} 8%)`,
  },
});

export const calendarStyle = style({
  border: `1px solid ${THEME.color.outlineVariant}`,
  padding: 16,
  borderRadius: 12,
});
export const weeksStyle = style({
  listStyle: "none",
  display: "grid",
  gridTemplateRows: "repeat(7, auto)",
  placeItems: "center",
  placeContent: "center",
  gap: 4,
});

export const dayStyle = recipe({
  base: {
    width: 12,
    height: 12,
    borderRadius: 4,
    border: `1px solid color-mix(in srgb, transparent, ${THEME.color.success} 10%)`
  },
  variants: {
    level: {
      NONE: {
        backgroundColor: THEME.color.surfaceContainerLow,
        border: "none",
      },
      FIRST_QUARTILE: {
        // backgroundColor: "#0e4429",
        backgroundColor: `color-mix(in srgb, ${THEME.color.successContainer}, ${THEME.color.success} 0%)`,
      },
      SECOND_QUARTILE: {
        // backgroundColor: "#006d32",
        backgroundColor: `color-mix(in srgb, ${THEME.color.successContainer}, ${THEME.color.success} 25%)`,
      },
      THIRD_QUARTILE: {
        // backgroundColor: "#26a641",
        backgroundColor: `color-mix(in srgb, ${THEME.color.successContainer}, ${THEME.color.success} 50%)`,
      },
      FOURTH_QUARTILE: {
        // backgroundColor: "#39d353",
        backgroundColor: `color-mix(in srgb, ${THEME.color.successContainer}, ${THEME.color.success} 75%)`,
      },
    },
  },
});
