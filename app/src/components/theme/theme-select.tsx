import { Show, children, createEffect, createMemo, createSignal, type Accessor, type Component, type ComponentProps } from "solid-js";

import AutoModeIcon from "~icons/material-symbols-rounded/auto-mode:filled";
import LightModeIcon from "~icons/material-symbols-rounded/light-mode:filled";
import DarkModeIcon from "~icons/material-symbols-rounded/dark-mode:filled";

import { makePersisted } from "@solid-primitives/storage";
import { createMediaQuery, createPrefersDark } from "@solid-primitives/media";

import { Switch as Match, Match as When } from "solid-js";

import { Switch } from "@material/solid/components/switch";
import { isServer, type Falsy, type FalsyValue } from "@solid-primitives/utils";
import { themeSelectLabelStyle, themeSelectSplashStyle, themeSelectStyle, themeSelectSubtitleStyle } from "./theme-select.css";
import { Splash } from "@material/solid/components/splash";

import { createBreakpoint } from "@material/solid/utils";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme_auto";

export interface ThemeSelectProps {
  type?: "small" | "medium" | "large";
}

export const ThemeSelect: Component<ThemeSelectProps> = (props) => {
  let ref!: HTMLElement;

  const [useAuto, setUseAuto] = makePersisted(
    createSignal(true),
    { name: STORAGE_KEY },
  );

  const prefersDark = createPrefersDark(true);

  const theme = createMemo<Theme>(() => {
    return !useAuto()
    ? prefersDark() ? "light" : "dark"
    : prefersDark() ? "dark" : "light";
  });

  createEffect(() => {
    document.documentElement.dataset.theme = theme();
  });

  const label = createMemo(
    () => `${useAuto() ? "Auto" : "Inverse"} (${theme()})`
  );
  return (
    <>
      <label
        ref={ref as HTMLLabelElement}
        class={themeSelectStyle}>
          <Splash class={themeSelectSplashStyle} for={ref} />
          <div class={themeSelectLabelStyle}>
            <p>Theme</p>
            <p class={themeSelectSubtitleStyle}>{label()}</p>
          </div>
          <Switch
            selected={useAuto()}
            onChanged={setUseAuto}
            title="Theme">
              <ThemeIcon theme={theme()} />
          </Switch>
      </label>
    </>
  );
}

interface ThemeIconProps {
  theme: Theme | FalsyValue;
}
const ThemeIcon: Component<ThemeIconProps> = (props) => {
  return (
    <Match fallback={<AutoModeIcon width={16} height={16} />}>
      <When when={props.theme === "light"}>
        <LightModeIcon width={16} height={16} />
      </When>
      <When when={props.theme === "dark"}>
        <DarkModeIcon width={16} height={16} />
      </When>
    </Match>
  );
}
