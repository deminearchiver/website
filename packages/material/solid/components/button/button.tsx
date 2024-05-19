import { type JSX, createMemo, createSignal, splitProps, type ParentComponent, type Signal } from "solid-js";
import { Splash } from "../splash";
import { buttonStyle } from "./button.css";
import clsx from "clsx/lite";
import { mergeRefs } from "@solid-primitives/refs";
import { Dynamic } from "solid-js/web";

type ButtonVariant = "elevated" | "filled" | "tonal" | "outlined" | "text";
export type ButtonProps = {
  variant: ButtonVariant;
  leading?: JSX.Element;
  trailing?: JSX.Element;
} & (
  | JSX.ButtonHTMLAttributes<HTMLButtonElement>
  | JSX.AnchorHTMLAttributes<HTMLAnchorElement>
);

export const Button: ParentComponent<ButtonProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    [
      "ref",
      "class",
      "variant",
      "leading",
      "trailing",
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
      ref={setRef}
      class={clsx(
        buttonStyle({
          leading: !!localProps.leading,
          trailing: !!localProps.trailing,
          variant: localProps.variant,
        }),
        localProps.class
      )}
      {...otherProps}>
      <Splash
        for={ref} />
      {localProps.leading}
      {localProps.children}
      {localProps.trailing}
    </Dynamic>
  );
}