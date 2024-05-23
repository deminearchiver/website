import { recipe } from "@vanilla-extract/recipes";
import { THEME } from "../../styles/theme";
import { splashTheme } from "@material/solid/components/splash";

export const filtersContainerStyle = recipe({
  base: {
    position: "sticky",
    top: 72,
    width: "100%",

    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    padding: "8px 24px",
  }
});

export const filtersHeaderStyle = recipe({
  base: {
    position: "relative",
    height: 64,
    backgroundColor: THEME.color.secondaryContainer,
    borderRadius: 28,
    vars: {
      [splashTheme.hoverColor]: THEME.color.onSurfaceVariant,
      [splashTheme.pressedColor]: THEME.color.onSurfaceVariant,
    }
  },
});
