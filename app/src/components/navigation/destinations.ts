import type { Icon } from "../icon";

import InfoIcon from "~icons/material-symbols-rounded/info:outlined";
import FeedIcon from "~icons/material-symbols-rounded/feed:outlined";

export type NavigationDestination = {
  icon: Icon;
  label: string;
  href: string;
  test: (url: URL) => boolean;
};

const startsWith = (value: string) => (url: URL) => url.pathname.startsWith(value);

export const NAVIGATION_DESTINATIONS = [
  {
    icon: FeedIcon,
    label: "Blog",
    href: "/blog",
    test: startsWith("/blog")
  },
  {
    icon: InfoIcon,
    label: "About",
    href: "/about",
    test: startsWith("/about"),
  },
] satisfies NavigationDestination[];
