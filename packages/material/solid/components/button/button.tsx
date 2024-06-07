import { type JSX, createMemo, createSignal, splitProps, type ParentComponent, type Signal, Show } from "solid-js";
import { Splash } from "../splash";
import { buttonOutlineStyle, buttonStyle } from "./button.css";
import clsx from "clsx/lite";
import { Dynamic } from "solid-js/web";
import { Focus } from "../focus";

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

  const className = createMemo(() => {
    return clsx(
      buttonStyle({
        leading: !!localProps.leading,
        trailing: !!localProps.trailing,
        variant: localProps.variant,
      }),
      localProps.class,
    );
  })

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
      <Focus for={ref} />
      <Splash for={ref} />
      {localProps.leading}
      {localProps.children}
      {localProps.trailing}
      <Show when={localProps.variant === "outlined"}>
        <div class={buttonOutlineStyle} />
      </Show>
    </Dynamic>
  );
}
