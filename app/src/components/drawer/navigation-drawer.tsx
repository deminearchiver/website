import { createEventListener } from "@solid-primitives/event-listener";
import { mergeRefs, resolveFirst } from "@solid-primitives/refs";
import { For, createComponent, createEffect, createMemo, createSignal, onMount, splitProps, type Component, type ComponentProps, type JSX, type ParentComponent } from "solid-js";

import { createPresence } from "@solid-primitives/presence";
import { drawerContentStyle, drawerDestinationContentStyle, drawerDestinationStyle, drawerDialogStyle, drawerListStyle, passthroughStyle } from "./navigation-drawer.css";
import { Splash } from "@material/solid/components/splash";

import clsx from "clsx/lite";
import { Dynamic } from "solid-js/web";

export interface NavigationDestination {
  href: string;
  icon?: Component<ComponentProps<"svg">>;
  label: string;
  selected?: boolean;
}
export type NavigationDrawerProps = {
  url: URL;
  destinations: NavigationDestination[];
  children: JSX.Element;
} & Omit<JSX.HTMLAttributes<HTMLElement>, "children">;
export const NavigationDrawer: Component<NavigationDrawerProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    ["children", "url", "destinations", "class"]
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

type NavigationDrawerDestinationProps =  {
  state: "enter" | "exit" | undefined;
  destination: NavigationDestination;
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
        drawerDestinationStyle({
          selected: localProps.destination.selected,
        }),
        localProps.class,
      )}
      href={localProps.destination.href}
      {...otherProps}>
        <Splash for={ref} />
        <div></div>
        <div class={drawerDestinationContentStyle({
          animation: localProps.state,
        })}>
          <Dynamic component={props.destination.icon} width={24} height={24} />
          <span>{props.destination.label}</span>
        </div>
    </a>
  );
}
