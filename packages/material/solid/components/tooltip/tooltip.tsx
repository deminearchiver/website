import { createEventListener, createEventListenerMap } from "@solid-primitives/event-listener";
import { access, type MaybeAccessor } from "@solid-primitives/utils";
import { createEffect, createSignal, on, onCleanup, splitProps, type Component, type FlowComponent, type JSX } from "solid-js";
import { autoUpdate, computePosition, size, shift, flip, offset, autoPlacement, } from "@floating-ui/dom";
import { mergeRefs } from "@solid-primitives/refs";
import { createPresence } from "@solid-primitives/presence";
import clsx from "clsx/lite";

import { tooltipStyle } from "./tooltip.css";

const wait = (timeout: number) => new Promise<void>(resolve => setTimeout(resolve, timeout));

type FloatingState = {
  x: number;
  y: number;
}
type TooltipState = "inactive" | "delay" | "active";

export type TooltipProps = {
  for: MaybeAccessor<HTMLElement>;
} & Omit<JSX.HTMLAttributes<HTMLElement>, "style" | "role" | "popover">;

const SUPPORTS_POPOVER = Object.prototype.hasOwnProperty.call(HTMLElement.prototype, "povover");

export const tooltipFactory = <T extends "plain" | "rich">(variant: T) => {
  const component: Component<TooltipProps> = (props) => {
    const [localProps, otherProps] = splitProps(
      props,
      ["ref", "for", "class", "children"],
    );

    let ref!: HTMLElement;

    const [floatingState, setFloatingState] = createSignal<FloatingState>({ x: 0, y: 0 });

    const [visible, setVisible] = createSignal(false);
    const { isMounted, isVisible } = createPresence(
      visible, { transitionDuration: 100 },
    );
    const [hovered, setHovered] = createSignal(false);

    createEffect(() => {
      const anchor = access(localProps.for);
      const cleanup = autoUpdate(
        anchor, ref,
        () => {
          void computePosition(
            anchor, ref,
            {
              placement: "top",
              middleware: [
                flip(),
                shift(),
                offset(8),
              ],
            },
          ).then(
            ({ x, y }) => setFloatingState({ x, y })
          );
        },
      );
      onCleanup(cleanup);
    });
    createEffect(
      on(isMounted, (mounted) => {
        if(mounted) ref.showPopover();
        else ref.hidePopover();
      }),
    );

    createEventListenerMap(
      props.for,
      {
        pointerenter: async () => {
          setHovered(true);
          await wait(500);
          if(hovered()) setVisible(true);
        },
        pointerleave: async () => {
          setHovered(false);
          await wait(1500);
          if(!hovered()) setVisible(false);
        },
      }
    );


    return (
      <div
        ref={mergeRefs(localProps.ref, element => ref = element)}
        class={clsx(tooltipStyle({ variant }), localProps.class)}
        {...otherProps}
        role="tooltip"
        style={{
          display: isMounted() ? undefined : "none",
          left: `${floatingState().x}px`,
          top: `${floatingState().y}px`,
          opacity: isVisible() ? 1 : 0,
        }}
        popover="manual">
          {localProps.children}
      </div>
    );
  }
  return component;
}
