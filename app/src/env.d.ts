/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="unplugin-icons/types/solid" />

/// <reference types="@material/symbols/types" />
declare module "@material/symbols/*" {
  import type { Component, ComponentProps } from "solid-js";

  const component: Component<ComponentProps<"svg">>;
  export default component;
}
