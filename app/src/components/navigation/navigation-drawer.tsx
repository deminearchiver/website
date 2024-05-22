import { createEventListener } from "@solid-primitives/event-listener";
import { mergeRefs, resolveFirst } from "@solid-primitives/refs";
import { For, createEffect, createMemo, createSignal, splitProps, untrack, type Component, type ComponentProps, type JSX, type ParentComponent } from "solid-js";

import { createPresence } from "@solid-primitives/presence";
import { drawerContentStyle, drawerItemContentStyle, drawerItemStyle, drawerDialogStyle, drawerListStyle, passthroughStyle, drawerHeaderStyle } from "./navigation-drawer.css";
import { Splash } from "@material/solid/components/splash";


import clsx from "clsx/lite";
import { Dynamic } from "solid-js/web";
import { dynamicToStatic, getDestinations, type DynamicNavigationDestination, type NavigationDestination, type StaticNavigationDestination } from "./destinations";

import { IconButton } from "@material/solid/components/icon-button";
import MenuOpenIcon from "~icons/material-symbols-rounded/menu-open:outlined";
import HomeOutlinedIcon from "~icons/material-symbols-rounded/home:outlined";
import HomeFilledIcon from "~icons/material-symbols-rounded/home:filled";

const GLOBAL_DESTINATIONS: DynamicNavigationDestination[] = [
  {
    icon: {
      unselected: HomeOutlinedIcon,
      selected: HomeFilledIcon,
    },
    label: "Home",
    href: "/",
    selected: url => url.pathname === "/",
  },
  ...getDestinations(),
];

export type NavigationDrawerProps = {
  url: URL;
  children: JSX.Element;
} & Omit<JSX.HTMLAttributes<HTMLElement>, "children">;
export const NavigationDrawer: Component<NavigationDrawerProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    ["children", "url", "class"]
  );

  const anchor = resolveFirst<HTMLElement>(
    () => localProps.children,
    (item): item is HTMLElement => item instanceof HTMLElement
  );

  const destinations = createMemo(() => {
    return dynamicToStatic(localProps.url, GLOBAL_DESTINATIONS);
  });

  let dialogRef!: HTMLDialogElement;

  const [open, setOpen] = createSignal(false);
  const openDrawer = (event?: MouseEvent) => {
    setOpen(true);
    event?.stopPropagation();
  }
  const closeDrawer = () => {
    setOpen(false);
  }

  createEventListener(
    () => anchor()!,
    "click",
    openDrawer,
  );

  const {
    isMounted,
    isEntering,
    isExiting
  } = createPresence(open, {
    enterDuration: 600,
    exitDuration: 300,
  });

  createEffect<boolean>((mounted) => {
    document.body.toggleAttribute("data-dialog-open", open());
    if(isMounted() === mounted) return isMounted();
    if(isMounted()) {
      dialogRef.showModal();
    }
    else {
      dialogRef.close();
    }
    return isMounted();
  }, isMounted());

  const state = createMemo(() => isEntering() ? "enter" : isExiting() ? "exit" : undefined);

  return (
    <div
      class={clsx(passthroughStyle, localProps.class)}
      {...otherProps as JSX.HTMLAttributes<HTMLDivElement>}>
      {anchor()}
      <dialog
        ref={dialogRef}
        class={drawerDialogStyle({
          animation: state()
        })}
        onClick={event => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (rect.left > event.clientX ||
              rect.right < event.clientX ||
              rect.top > event.clientY ||
              rect.bottom < event.clientY
          ) closeDrawer();
        }}
        onCancel={event => {
          event.preventDefault();
          closeDrawer();
        }}>
        <aside class={drawerContentStyle({
        })}>
          <ul class={drawerListStyle}>
            <li class={passthroughStyle}>
              <div class={drawerHeaderStyle}>
                <IconButton onClick={closeDrawer} title="Close">
                  <MenuOpenIcon width={24} height={24} />
                </IconButton>
              </div>
            </li>
            <For each={destinations()}>{
              destination => (
                <li class={passthroughStyle}>
                  <NavigationDrawerDestination
                    state={state()}
                    destination={destination}
                    onClick={closeDrawer} />
                </li>
              )
            }</For>
          </ul>
        </aside>
      </dialog>
    </div>
  );
}

type NavigationDrawerItemProps = {
  state: "enter" | "exit" | undefined;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;
const NavigationDrawerItem: ParentComponent<NavigationDrawerItemProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    [
      "ref",
      "class",
      "state",
      "children",
    ]
  );

  let ref!: HTMLElement;

  return (
    <button
      ref={mergeRefs(localProps.ref, element => ref = element)}
      class={clsx(
        drawerItemStyle(),
        localProps.class,
      )}
      {...otherProps}>
        <Splash for={ref} />
        <div class={drawerItemContentStyle({
          animation: localProps.state,
        })}>
        {localProps.children}
      </div>
    </button>
  );
}

type NavigationDrawerDestinationProps =  {
  state: "enter" | "exit" | undefined;
  destination: StaticNavigationDestination;
} & Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

const NavigationDrawerDestination: Component<NavigationDrawerDestinationProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    [
      "ref",
      "class",
      "state",
      "destination",
    ]
  );

  let ref!: HTMLElement;

  const icon = createMemo(() => {
    return localProps.destination.selected
      ? localProps.destination.icon.selected
      : localProps.destination.icon.unselected;
  })

  return (
    <a
      ref={mergeRefs(localProps.ref, element => ref = element)}
      class={clsx(
        drawerItemStyle({
          selected: localProps.destination.selected,
        }),
        localProps.class,
      )}
      href={localProps.destination.href}
      {...otherProps}>
        <Splash for={ref} />
        <div class={drawerItemContentStyle({
          animation: localProps.state,
        })}>
          <Dynamic component={icon()} width={24} height={24} />
          <span>{localProps.destination.label}</span>
        </div>
    </a>
  );
}

const Logo: Component<Omit<ComponentProps<"svg">, "xmlns" | "viewBox" | "children">> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 480"
      fill="currentColor"
      {...props}>
      <path d="M480,203.51v155.6c0,66.77-54.12,120.89-120.89,120.89h-222.84C61.01,480,0,418.99,0,343.73v-98.93c0-33.14,26.86-60,60-60h1.13c32.51,0,58.87,26.36,58.87,58.87v29.19c0,48.13,39.02,87.14,87.14,87.14h66.93c47.46,0,85.93-38.47,85.93-85.93v-54.04c0-55.24-44.78-100.03-100.03-100.03H120c-66.27,0-120-53.73-120-120h0s276.49,0,276.49,0c112.4,0,203.51,91.11,203.51,203.51Z" />
    </svg>
  );
};
