import type { Icon } from "../icon";

import InfoIcon from "~icons/material-symbols-rounded/info:outlined";
import FeedIcon from "~icons/material-symbols-rounded/feed:outlined";

export type NavigationDestination = {
  icon: Icon;
  label: string;
  href: string;
};

export interface DynamicNavigationDestination extends NavigationDestination  {
  selected: (url: URL) => boolean;
};

export interface StaticNavigationDestination extends NavigationDestination {
  selected?: boolean;
}

const startsWith = (value: string) => (url: URL) => url.pathname.startsWith(value);

export const NAVIGATION_DESTINATIONS = [
  {
    icon: FeedIcon,
    label: "Blog",
    href: "/blog",
    selected: startsWith("/blog")
  },
  {
    icon: InfoIcon,
    label: "About",
    href: "/about",
    selected: startsWith("/about"),
  },
] satisfies DynamicNavigationDestination[];

export const dynamicToStatic = (
  url: URL,
  destinations: DynamicNavigationDestination[]
): StaticNavigationDestination[] =>
    destinations.map(
      destination => ({
        ...destination,
        selected: destination.selected(url),
      })
    );
