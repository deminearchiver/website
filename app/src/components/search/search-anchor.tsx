import { splitProps, type Component, type JSX } from "solid-js";
import { Splash } from "@material/solid/components/splash";
import { Focus } from "@material/solid/components/focus";
import { Tooltip } from "@material/solid/components/tooltip";
import { searchAnchorContentStyle, searchAnchorIconStyle, searchAnchorLabelStyle, searchAnchorStyle } from "./search-anchor.css";

import SearchIcon from "~icons/material-symbols-rounded/search:outlined";
import { mergeRefs } from "@solid-primitives/refs";
import clsx from "clsx";
import { createEventListener } from "@solid-primitives/event-listener";

export type SearchAnchorProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children">;
export const SearchAnchor: Component<SearchAnchorProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    ["ref", "class"]
  );

  let ref!: HTMLElement;

  return (
    <button
      ref={mergeRefs(localProps.ref, element => ref = element)}
      class={clsx(searchAnchorStyle, localProps.class)}>
        <Focus for={ref} />
        <Splash for={ref} />
        <div class={searchAnchorContentStyle}>
          <SearchIcon class={searchAnchorIconStyle} />
          <span class={searchAnchorLabelStyle}>Search</span>
        </div>
    </button>
  );
}
