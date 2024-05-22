import { type Component, createSignal } from "solid-js";
import { focusStyle } from "./focus.css";
import { createEventListenerMap } from "@solid-primitives/event-listener";
import { type MaybeAccessor, access } from "@solid-primitives/utils";

export interface FocusProps {
  for: MaybeAccessor<HTMLElement>;
  visible?: boolean;
}

export const Focus: Component<FocusProps> = (props) => {
  const [visible, setVisible] = createSignal(false);

  createEventListenerMap(
    props.for,
    {
      focusin: () => {
        setVisible(access(props.for).matches(":focus-visible"));
      },
      focusout: () => void setVisible(false),
      pointerdown: () => void setVisible(false),
    }
  );

  return (
    <div
      class={
        focusStyle({ visible: props.visible ?? visible() })
      } />
  )
}
