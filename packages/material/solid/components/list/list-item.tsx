import { createMemo, createSignal, onMount, splitProps, type Component, type JSX, type ParentComponent, type Signal } from "solid-js";
import { listItemContentStyle, listItemStyle, listItemSubtitleStyle, listItemTitleStyle } from "./list-item.css";
import { Splash } from "../splash";
import { Dynamic } from "solid-js/web";
import type { HTMLAttributes } from "astro/types";
import { mergeRefs } from "@solid-primitives/refs";
import clsx from "clsx/lite";
import { Focus } from "../focus";

export type ListItemType = "text" | "button" | "link";
type BaseListItemProps = {
  type?: ListItemType;
  leading?: JSX.Element;
  title: JSX.Element;
  subtitle?: JSX.Element;
  trailing?: JSX.Element;
}
export type ListItemProps = {
  href?: string;
  target?: string;
} & BaseListItemProps & Omit<JSX.HTMLAttributes<HTMLElement>, "children">;

export const ListItem: Component<ListItemProps> = (props) => {
  // let ref!: HTMLElement;
  const [ref, setRef] = createSignal() as Signal<HTMLElement>;

  const [localProps, otherProps] = splitProps(
    props, [
      "ref",
      "class",
      "type",
      "leading",
      "title",
      "subtitle",
      "trailing",
    ],
  );
  const type = createMemo((): ListItemType => localProps.type ?? "href" in otherProps ? "link" : "text");
  const tag = createMemo(() => {
    switch(type()) {
      case "text": return "li";
      case "button": return "button";
      case "link": return "a";
    }
  });
  return (
    <Dynamic
      component={tag()}
      ref={mergeRefs(localProps.ref, setRef)}
      class={clsx(listItemStyle, localProps.class)}
      {...otherProps}>
        <Focus for={ref} />
        <Splash for={ref} disabled={type() === "text"} />
        {localProps.leading}
        <div class={listItemContentStyle}>
          <div class={listItemTitleStyle}>
            {props.title}
          </div>
          <div class={listItemSubtitleStyle}>
            {props.subtitle}
          </div>
        </div>
    </Dynamic>
  )
  // switch(tag()) {
  //   case "li": return (
  //     <li
  //       // ref={ref as HTMLLIElement}
  //       ref={setRef}
  //       class={listItemStyle}>
  //         {children}
  //     </li>
  //   );
  //   case "button": return (
  //     <button
  //       // ref={ref as HTMLButtonElement}
  //       ref={setRef}
  //       class={listItemStyle}>
  //         {children}
  //     </button>
  //   );
  //   case "a": return (
  //     <a
  //       // ref={ref as HTMLAnchorElement}
  //       ref={setRef}
  //       class={listItemStyle}>
  //         {children}
  //     </a>
  //   );
  // }
}
