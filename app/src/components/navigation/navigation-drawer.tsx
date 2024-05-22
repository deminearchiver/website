import { createEventListener } from "@solid-primitives/event-listener";
import { mergeRefs, resolveFirst } from "@solid-primitives/refs";
import { For, createEffect, createMemo, createSignal, splitProps, type Component, type JSX, type ParentComponent } from "solid-js";

import { createPresence } from "@solid-primitives/presence";
import { drawerContentStyle, drawerItemContentStyle, drawerItemStyle, drawerDialogStyle, drawerListStyle, passthroughStyle, drawerHeaderStyle } from "./navigation-drawer.css";
import { Splash } from "@material/solid/components/splash";


import clsx from "clsx/lite";
import { Dynamic } from "solid-js/web";
import type { NavigationDestination, StaticNavigationDestination } from "./destinations";

import MenuOpenIcon from "~icons/material-symbols-rounded/menu-open:outlined";
import { IconButton } from "@material/solid/components/icon-button";

export type NavigationDrawerProps = {
  destinations: StaticNavigationDestination[];
  children: JSX.Element;
} & Omit<JSX.HTMLAttributes<HTMLElement>, "children">;
export const NavigationDrawer: Component<NavigationDrawerProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    ["children", "destinations", "class"]
  );

  const anchor = resolveFirst<HTMLElement>(
    () => localProps.children,
    (item): item is HTMLElement => item instanceof HTMLElement
  );

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
            {/* <li class={passthroughStyle}>
              <NavigationDrawerItem
                state={state()}
                onClick={() => closeDrawer()}>
                  <MenuOpenIcon width={24} height={24} />
                  Close
              </NavigationDrawerItem>
            </li> */}
            <For each={localProps.destinations}>{
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
          <Dynamic component={localProps.destination.icon} width={24} height={24} />
          <span>{localProps.destination.label}</span>
        </div>
    </a>
  );
}
