import { Show, children, createEffect, createMemo, createSignal, type Accessor, type Component, type ComponentProps } from "solid-js";

import AutoModeIcon from "~icons/material-symbols-rounded/auto-mode:filled";
import LightModeIcon from "~icons/material-symbols-rounded/light-mode:filled";
import DarkModeIcon from "~icons/material-symbols-rounded/dark-mode:filled";

import { makePersisted } from "@solid-primitives/storage";
import { createMediaQuery, createPrefersDark } from "@solid-primitives/media";

import { Switch as Match, Match as When } from "solid-js";

import { Switch } from "@material/solid/components/switch";
import { isServer, type Falsy, type FalsyValue } from "@solid-primitives/utils";
import { themeSelectControlStyle, themeSelectLabelStyle, themeSelectStyle, themeSelectSubtitleStyle } from "./theme-select.css";
import { Splash } from "@material/solid/components/splash";

import { createBreakpoint } from "@material/solid/utils";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme_auto";


const themeFromPrefersDark = (prefersDark: boolean, inverse: boolean = false) => {
  return inverse
    ? prefersDark ? "light" : "dark"
    : prefersDark ? "dark" : "light";
}


export interface ThemeSelectProps {
  type?: "small" | "medium" | "large";
}

export const ThemeSelect: Component<ThemeSelectProps> = (props) => {
  let ref!: HTMLElement;

  const [useAuto, setUseAuto] = makePersisted(
    createSignal(true),
    { name: STORAGE_KEY, },
  );

  const prefersDark = createPrefersDark(true);

  const theme = createMemo<Theme>(() => {
    return themeFromPrefersDark(prefersDark(), !useAuto())
  });

  const breakpoint = createBreakpoint("compact");

  createEffect(() => {
    document.documentElement.dataset.theme = theme();
  });

  const showLarge = createMemo(() => {
    return (props.type && props.type !== "small") || breakpoint.gt("compact");
  });
  const showWide = () =>
    (!props.type && breakpoint.gte("large")) || (props.type === "large");

  const Control: Component = () => (
    <Switch
      class={themeSelectControlStyle({
        contained: showLarge(),
      })}
      selected={useAuto()}
      onChanged={value => void setUseAuto(value)}
      title="Theme">
        <ThemeIcon theme={theme()} />
    </Switch>
  );

  const label = () => `${useAuto() ? "Auto" : "Manual"} (${theme()})`;



  return (
    <>
      <Show
        when={showLarge()}
        fallback={<Control />}>
          <label
            ref={ref as HTMLLabelElement}
            class={themeSelectStyle({
              wide: showWide(),
            })}
            title={label()}>
              <Splash for={ref} />
              <div class={themeSelectLabelStyle}>
                <p>Theme</p>
                <Show when={showWide()}>
                  <p class={themeSelectSubtitleStyle}>{label()}</p>
                </Show>
              </div>
              <Control />
          </label>
      </Show>
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
