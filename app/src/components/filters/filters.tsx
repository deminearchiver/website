import type { Component } from "solid-js";
import { filtersContainerStyle, filtersHeaderStyle } from "./filters.css";
import { Button } from "@material/solid/components/button";
import { Card } from "@material/solid/components/card";

import { useWindowScrollPosition } from "@solid-primitives/scroll";

import TuneIcon from "~icons/material-symbols-rounded/tune:outlined";
import { Splash } from "@material/solid/components/splash";

export const Filters: Component = () => {
  let headerRef!: HTMLElement;

  const scroll = useWindowScrollPosition();

  return (
    <div
      class={filtersContainerStyle()}>
      <div
        ref={headerRef as HTMLDivElement}
        class={filtersHeaderStyle()}>
        <Splash for={headerRef} />
        {/* <Button
          variant="outlined"
          leading={<TuneIcon width={18} height={18} />}>
            Filters
        </Button> */}
      </div>
    </div>
  )
}
