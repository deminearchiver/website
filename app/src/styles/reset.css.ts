import { globalStyle } from "@vanilla-extract/css";
import { THEME } from "./theme";

globalStyle(
  `:root[data-theme="light"]`,
  {
    colorScheme: "light",
  },
);
globalStyle(
  `:root[data-theme="dark"]`,
  {
    colorScheme: "dark",
  },
);

globalStyle(
  `:root:not([data-theme="light"]):not([data-theme="dark"])`,
  {
    colorScheme: "light dark",
  }
);

globalStyle(
  `:root`,
  {
    fontFamily: THEME.text.body.medium.family,
    fontSize: THEME.text.body.medium.size,
    lineHeight: THEME.text.body.medium.lineHeight,
    fontWeight: THEME.text.body.medium.weight,
    letterSpacing: THEME.text.body.medium.letterSpacing,
    "@media": {
      "not (prefers-reduced-motion)": {
        scrollBehavior: "smooth",
      },
    }
  }
);

globalStyle(
  `body`,
  {
    backgroundColor: THEME.color.surface,
    color: THEME.color.onSurface,
    overflowX: "clip",
    minHeight: "100dvh",
  }
);
globalStyle(
  `body[data-dialog-open]`,
  {
    overflow: "hidden",
  }
);



globalStyle(
  `*, *::before, *::after`,
  {
    boxSizing: "border-box",
  }
);

globalStyle(
  `*`,
  {
    margin: 0,
    padding: 0,
  }
)

globalStyle(
  `h1, h2, h3, h4, h5, h6`,
  {
    textWrap: "balance",
  }
);

globalStyle(
  `img`,
  {
    maxWidth: "100%",
    display: "block",
  }
);
