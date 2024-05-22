import type { Component } from "solid-js";
import { SearchView } from "./search-view";
import { SearchAnchor } from "./search-anchor";

export const Search: Component = () => {
  return (
    <SearchView>
      <SearchAnchor />
    </SearchView>
  )
}
