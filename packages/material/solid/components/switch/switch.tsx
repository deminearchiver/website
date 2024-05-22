import { type Component, type JSX, createSignal, splitProps, createMemo, type ParentComponent, children } from "solid-js";
import { switchDisabledStyle, switchHandleContainerStyle, switchHandleStyle, switchIconsStyle, switchInputStyle, switchSelectedStyle, switchStyle, switchTrackStyle, switchUnselectedStyle } from "./switch.css";
import { Splash } from "../splash";
import { resolveFirst } from "@solid-primitives/refs";
import clsx from "clsx/lite";
import { Focus } from "../focus";

interface SwitchProps extends JSX.HTMLAttributes<HTMLElement> {
  selected: boolean;
  onChanged: (value: boolean) => void;
  required?: boolean;
  disabled?: boolean;
}

export const Switch: ParentComponent<SwitchProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    [
      "selected",
      "onChanged",
      "required",
      "disabled",
      "children",
      "class",
      "classList",
    ]
  );
  const resolved = resolveFirst(() => localProps.children);

  let inputRef!: HTMLInputElement;

  // const state = () => selected() ? "selected" : "unselected";
  const state = createMemo(() => props.selected ? "selected" : "unselected");

  return (
    <div
      class={clsx(switchStyle, localProps.class)}
      classList={{
        [switchSelectedStyle]: props.selected,
        [switchUnselectedStyle]: !props.selected,
        [switchDisabledStyle]: props.disabled,
        ...localProps.classList,
      }}
      {...otherProps as JSX.HTMLAttributes<HTMLDivElement>}>
      <input
        ref={inputRef}
        class={switchInputStyle}
        disabled={props.disabled}
        required={props.required}
        checked={props.selected}
        role="switch"
        onChange={event => props.onChanged(event.currentTarget.checked)}
        onInput={event => props.onChanged(event.currentTarget.checked)}
        type="checkbox"
        aria-hidden="true" />
      <div class={switchTrackStyle({
        state: state(),
      })}>
        <div
          class={
            switchHandleContainerStyle({
              state: state(),
            })
          }>
            <div
              style={{
                position: "absolute",
                width: "40px",
                height: "40px",
                "border-radius": "4px",
              }}>
                <Focus
                  for={inputRef} />
            </div>
            <div
              style={{
                position: "absolute",
                width: "40px",
                height: "40px",
                "border-radius": "inherit",
              }}>
                <Splash
                  for={inputRef} />
            </div>
            <div
              class={switchHandleStyle({
                selected: props.selected,
                icon: !!resolved(),
              })}>
                <div class={switchIconsStyle({ state: state() })}>
                  {resolved()}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
