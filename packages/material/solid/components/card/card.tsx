import { splitProps, type JSX, type ParentComponent } from "solid-js";
import { cardBackgroundStyle, cardOutlineStyle, cardStyle } from "./card.css";
import clsx from "clsx/lite";

export type CardVariant = "elevated" | "filled" | "outlined";
export type CardProps = {
  variant: CardVariant;
} & JSX.HTMLAttributes<HTMLElement>;

export const Card: ParentComponent<CardProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    ["variant", "class", "children"],
  );
  return (
    <div
      class={clsx(cardStyle, localProps.class)}
      {...otherProps as JSX.HTMLAttributes<HTMLDivElement>}>
      <div
        class={cardBackgroundStyle({
          variant: localProps.variant,
        })} />
      {localProps.children}
      <div
        class={cardOutlineStyle({
          variant: localProps.variant,
        })} />
    </div>
  )
}
