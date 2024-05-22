import type { Component } from "solid-js";
import { Splash } from "@material/solid/components/splash";
import { Focus } from "@material/solid/components/focus";
import { searchAnchorContentStyle, searchAnchorIconStyle, searchAnchorLabelStyle, searchAnchorStyle } from "./search-anchor.css";

import SearchIcon from "~icons/material-symbols-rounded/search:outlined";

export const SearchAnchor: Component = () => {
  let ref!: HTMLElement;

  return (
    <button
      ref={ref as HTMLButtonElement}
      class={searchAnchorStyle}>
        <Focus for={ref} />
        <Splash for={ref} />
        <div class={searchAnchorContentStyle}>
          <SearchIcon class={searchAnchorIconStyle} />
          <span class={searchAnchorLabelStyle}>Search</span>
        </div>
    </button>
  );
}
