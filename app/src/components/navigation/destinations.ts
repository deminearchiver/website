import type { Icon } from "../icon";

import InfoOutlinedIcon from "~icons/material-symbols-rounded/info:outlined";
import InfoFilledIcon from "~icons/material-symbols-rounded/info:filled";
import FeedOutlinedIcon from "~icons/material-symbols-rounded/feed:outlined";
import FeedFilledIcon from "~icons/material-symbols-rounded/feed:filled";

export type NavigationDestination = {
  icon: {
    unselected: Icon;
    selected: Icon;
  };
  label: string;
  href: string;
};

export interface DynamicNavigationDestination extends NavigationDestination  {
  selected: (url: URL) => boolean;
};

export interface StaticNavigationDestination extends NavigationDestination {
  selected: boolean;
}

const startsWith = (value: string) => (url: URL) => url.pathname.startsWith(value);

export const getDestinations = (): DynamicNavigationDestination[] => [
  {
    icon: {
      unselected: FeedOutlinedIcon,
      selected: FeedFilledIcon,
    },
    label: "Blog",
    href: "/blog",
    selected: startsWith("/blog")
  },
  {
    icon: {
      unselected: InfoOutlinedIcon,
      selected: InfoFilledIcon,
    },
    label: "About",
    href: "/about",
    selected: startsWith("/about"),
  },
];

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
