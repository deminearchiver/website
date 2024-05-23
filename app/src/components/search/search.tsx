import type { Component } from "solid-js";
import { SearchView } from "./search-view";
import { SearchAnchor } from "./search-anchor";

export const Search: Component = () => {
  let ref!: HTMLButtonElement;
  return (
    <>
      <SearchAnchor ref={ref} />
      <SearchView for={ref} />
    </>
  );
}
