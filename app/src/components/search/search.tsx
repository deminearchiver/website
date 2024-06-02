import type { Component } from "solid-js";
import { SearchView } from "./search-view";
import { SearchAnchor } from "./search-anchor";
import { Tooltip } from "@material/solid/components/tooltip";

export const Search: Component = () => {
  let ref!: HTMLButtonElement;
  return (
    <>
      <SearchAnchor ref={ref} />
      <SearchView for={ref} />
      <Tooltip.Plain for={ref}>
        Press to open search
      </Tooltip.Plain>
    </>
  );
}
