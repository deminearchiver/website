import { type JSX, splitProps, type ParentComponent, createMemo, createSignal, type Signal } from "solid-js";
import { iconButtonStyle } from "./icon-button.css";
import { Splash } from "../splash";
import clsx from "clsx/lite";
import { mergeRefs } from "@solid-primitives/refs";
import { Dynamic } from "solid-js/web";

type IconButtonVariant =
  | "regular"
  | "filled"
  | "tonal"
  | "outlined";

export type IconButtonProps = {
  variant?: IconButtonVariant;
} & (
  | JSX.ButtonHTMLAttributes<HTMLButtonElement>
  | JSX.AnchorHTMLAttributes<HTMLAnchorElement>
);

export const IconButton: ParentComponent<IconButtonProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    [
      "ref",
      "class",
      "variant",
      "children",
    ],
  );

  const [ref, setRef] = createSignal() as Signal<HTMLElement>;


  const tag = createMemo(() => {
    return "href" in otherProps ? "a" : "button";
  });

  return (
    <Dynamic
      component={tag()}
      ref={mergeRefs(localProps.ref as HTMLElement, setRef)}
      class={
        clsx(
          iconButtonStyle({
            variant: localProps.variant,
          }),
          localProps.class
        )
      }
      {...otherProps}>
      <Splash
        for={ref}
        disabled={"disabled" in props && props.disabled} />
      {localProps.children}
    </Dynamic>
  );
}
