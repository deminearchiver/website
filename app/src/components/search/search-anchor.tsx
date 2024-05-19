import { Splash } from "@material/solid/components/splash";
import type { Component } from "solid-js";
import { searchAnchorIconStyle, searchAnchorLabelStyle, searchAnchorStyle } from "./search-anchor.css";

import SearchIcon from "~icons/material-symbols-rounded/search:outlined";

export const SearchAnchor: Component = (props) => {
  let ref!: HTMLButtonElement;

  return (
    <button ref={ref} class={searchAnchorStyle}>
      <Splash for={ref} />
      <SearchIcon class={searchAnchorIconStyle} />
      <span class={searchAnchorLabelStyle}>Search</span>
    </button>
  );
}
