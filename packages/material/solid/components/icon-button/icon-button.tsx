import { type JSX, splitProps, type ParentComponent } from "solid-js";
import { iconButtonStyle } from "./icon-button.css";
import { Splash } from "../splash";
import clsx from "clsx/lite";
import { mergeRefs } from "@solid-primitives/refs";

type IconButtonVariant =
  | "regular"
  | "filled"
  | "tonal"
  | "outlined";

export type IconButtonProps = {
  variant?: IconButtonVariant;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

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

  let ref!: HTMLElement;
  return (
    <button
      {...otherProps}
      ref={mergeRefs(localProps.ref, element => ref = element)}
      class={
        clsx(
          iconButtonStyle({
            variant: localProps.variant,
          }),
          localProps.class
        )
      }>
      <Splash
        for={ref}
        disabled={props.disabled} />
      {localProps.children}
    </button>
  );
}
