import { createBreakpoint } from "@material/solid/utils";
import { createEventListener } from "@solid-primitives/event-listener";
import { createPresence } from "@solid-primitives/presence";
import { resolveFirst } from "@solid-primitives/refs";
import { type JSX, splitProps, type Component, createEffect, createSignal, createMemo, Show, createResource, For, Switch, Match, type ParentComponent, type ComponentProps } from "solid-js";
import { searchDialogStyle, searchLabelStyle, searchItemStyle, searchResultsMessageStyle, searchViewBarStyle, searchViewInputStyle, searchViewResultsStyle, searchViewStyle, searchGroupStyle, searchGroupIndex, searchSubItemStyle } from "./search-view.css";
import { debounce, leadingAndTrailing } from "@solid-primitives/scheduled";
import { createInfiniteScroll } from "./pagination";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { PagefindProvider, type Pagefind, type PagefindSearchFragment, type PagefindSearchResult, type PagefindSubResult } from "@pagefind/astro";

import { IconButton } from "@material/solid/components/icon-button";
import { ListItem } from "@material/solid/components/list";

import ArrowBackIcon from "~icons/material-symbols-rounded/arrow-back:outlined";
import CloseIcon from "~icons/material-symbols-rounded/close:outlined";
import SearchIcon from "~icons/material-symbols-rounded/search:outlined";
import SearchOffIcon from "~icons/material-symbols-rounded/search-off:outlined";
import TextFieldsAltIcon from "~icons/material-symbols-rounded/text-fields-alt:outlined";
import DescriptionIcon from "~icons/material-symbols-rounded/description:outlined";
import InfoIcon from "~icons/material-symbols-rounded/info:outlined";
import TagIcon from "~icons/material-symbols-rounded/tag:outlined";

import sanitize from "sanitize-html";

import { Dynamic, isServer } from "solid-js/web";
import type { Icon } from "../primitives/icon";
import { access, type MaybeAccessor } from "@solid-primitives/utils";

export type SearchViewProps = {
  for: MaybeAccessor<string | HTMLElement>;
  // children: JSX.Element;
}

const GROUP_LABELS: Record<string, string> = {
  blog: "Blog",
  info: "Information",
}

const getGroupIdByUrl = (url: string): string | undefined => {
  if(url.startsWith("/blog")) return "blog";
  if(url.startsWith("/about")) return "info";
}

const groupResults = (data: PagefindSearchFragment[]): SearchResultGroup[] => {
  // const results = data.map(fragment => searchResultFromFragment(fragment));
  const groups: SearchResultGroup[] = [];
  for(const result of data) {
    const id = getGroupIdByUrl(result.url);
    const group = groups.find(group => group.id === id);

    if(group) group.results.push(result);
    else groups.push({
      id,
      results: [result],
    });
  }
  return groups;
}

type SearchResultGroup = {
  id?: string;
  results: PagefindSearchFragment[];
};

export const SearchView: Component<SearchViewProps> = (props) => {
  // const [localProps, otherProps] = splitProps(
  //   props,
  //   ["children"]
  // );

  // const anchor = resolveFirst(
  //   () => localProps.children,
  //   (item): item is HTMLElement => item instanceof HTMLElement,
  // );
  const anchor = createMemo(() => {
    const value = access(props.for);
    return typeof value === "string"
      ? document.getElementById(value)!
      : value;
  });
  // const breakpoint = createBreakpoint("expanded");

  let dialogRef!: HTMLDialogElement;
  let viewRef!: HTMLElement;
  let inputRef!: HTMLInputElement;

  const [open, setOpen] = createSignal(false);

  const openView = (event?: MouseEvent) => {
    event?.preventDefault();
    setOpen(true);
  }

  const closeView = (event?: Event) => {
    event?.preventDefault();
    setOpen(false);
  }

  createEventListener(
    anchor(),
    "click",
    openView
  );

  // const enterDuration = createMemo(() =>
  //   breakpoint() === "compact" ? 0 : 500
  // );
  // const exitDuration = createMemo(() =>
  //   breakpoint() === "compact" ? 0 : 200
  // );


  const {
    isEntering,
    isExiting,
    isMounted,
  } = createPresence(open, {
    enterDuration: 600,
    exitDuration: 200,
  });

  const state = createMemo(() => {
    // if(breakpoint() === "compact") return;
    if(isEntering()) return "entering"
    if(isExiting()) return "exiting";
  });

  createEffect<boolean>(
    (prevMounted) => {
      document.body.toggleAttribute("data-dialog-open", open());
      if(isMounted() === prevMounted) return isMounted();
      if(isMounted()) {
        dialogRef.showModal();
      }
      else {
        dialogRef.close();
      }
      return isMounted();
    },
    isMounted(),
  );

  const [pagefind] = createResource(async () => {
    const pagefind = await PagefindProvider.fromPath("/pagefind/pagefind.js");
    await pagefind.init({
      highlightParam: "highlight",
      excerptLength: 10,
    });
    return pagefind;
  });

  const [term, setTerm] = createSignal("");
  // const [results, setResults] = createSignal<PagefindSearchResult[]>([]);
  const [groups, setGroups] = createSignal<SearchResultGroup[]>([]);

  // const [
  //   pages,
  //   infiniteScrollLoader,
  //   { refetch, end, setPages }
  // ] = createInfiniteScroll<PagefindSearchFragment>(
  //   async (page) => {
  //     // const result: PagefindSearchFragment =
  //     //   {
  //     //     url: "/",
  //     //     content: `Result ${page}`,
  //     //     excerpt: "Test",
  //     //     sub_results: [
  //     //     ],
  //     //     anchors: [],
  //     //     filters: {},
  //     //     word_count: 10,
  //     //     meta: { title: "Title" },
  //     //     locations: [],
  //     //     weighted_locations: [],
  //     //   }
  //     // return new Promise(resolve => resolve(Array(20).fill(result)));

  //     const RESULTS_PER_PAGE = 5;
  //     const from = page * RESULTS_PER_PAGE;
  //     const to = from + RESULTS_PER_PAGE;
  //     return (await Promise.all(
  //       results().slice(from, to).map(result => result.data()),
  //     )).sort(
  //       (a, b) => a.url.startsWith("/blog") ? b.url.startsWith("/blog") ? 0 : -1 : 1
  //     );
  //   },
  // );

  const search = leadingAndTrailing(
    debounce,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async (pagefind: Pagefind, term: string) => {
      const search = await pagefind.search(term);
      // setResults(search.results);
      // setPages([]);
      // await refetch();
      const results = await Promise.all(
        search.results.map(result => result.data()),
      );
      setGroups(groupResults(results));
    },
    300,
  );
  createEffect(() => {
    if(pagefind.state !== "ready") return;
    void pagefind().preload(term());
    search(pagefind(), term());
  });

  return (
    <div>
      {anchor()}
      <dialog
        ref={dialogRef}
        class={searchDialogStyle({
          state: state(),
        })}
        onClick={event => {
          const rect = viewRef.getBoundingClientRect();
          if (rect.left > event.clientX ||
              rect.right < event.clientX ||
              rect.top > event.clientY ||
              rect.bottom < event.clientY
          ) closeView();
        }}
        onCancel={closeView}>
          <search
            ref={viewRef}
            class={searchViewStyle({
              state: state(),
            })}>
              <div class={searchViewBarStyle}>
                <IconButton onClick={() => closeView()}>
                  <ArrowBackIcon width={24} height={24} />
                </IconButton>
                <input
                  autofocus
                  ref={inputRef}
                  class={searchViewInputStyle}
                  onInput={event => setTerm(event.currentTarget.value)}
                  type="text"
                  placeholder="Search"
                  value={term()}>
                </input>
                <Show when={term().length > 0}>
                  <IconButton
                    onClick={() => {
                      setTerm("");
                      inputRef.focus();
                    }}>
                      <CloseIcon width={24} height={24} />
                  </IconButton>
                </Show>
              </div>
              <ul class={searchViewResultsStyle}>
                <For each={groups()}>{
                  (group, index) => (
                    <SearchGroup index={index()}>
                      <SearchLabel>{group.id ? GROUP_LABELS[group.id] : "Other"}</SearchLabel>
                      <For each={group.results}>{
                        (result, index) => (
                          <SearchItem group={group.id} result={result} />
                        )
                      }</For>
                    </SearchGroup>
                  )
                }</For>
              </ul>
              {/* <Switch fallback={
                  <div class={searchResultsMessageStyle}>
                    <SearchOffIcon width={48} height={48} />
                    <span>Nothing found!</span>
                  </div>
                }>
                  <Match when={term().length === 0 && pages().length === 0}>
                    <div class={searchResultsMessageStyle}>
                      <TextFieldsAltIcon width={48} height={48} />
                      <span>Enter a search term!</span>
                    </div>
                  </Match>
                  <Match when={pages().length > 0}>
                    <ul class={searchViewResultsStyle}>
                      <For each={pages()}>{
                        (result, index) => (
                          // <SearchResultSub
                          //   index={index()}
                          //   result={page}
                          //   close={closeView} />
                          <>
                            <SearchLabel>
                              Test
                            </SearchLabel>
                            <SearchItem
                              result={result}
                              close={closeView} />
                          </>
                          // <For each={result.sub_results}>{
                          //   (subResult, index) => (

                          //   )
                          // }</For>
                        )
                      }</For>
                      <Show when={!end()}>
                        <span use:infiniteScrollLoader>
                          Loading
                        </span>
                      </Show>
                    </ul>
                  </Match>
            </Switch> */}
          </search>
      </dialog>
    </div>
  )
}



const SearchLabel: ParentComponent = (props) => {
  return (
    <span class={searchLabelStyle}>{props.children}</span>
  )
}

type SearchGroupProps = {
  index?: number;
}
const SearchGroup: ParentComponent<SearchGroupProps> = (props) => {
  return (
    <div
      class={searchGroupStyle}
      style={assignInlineVars({
        [searchGroupIndex]: props.index ? `${props.index}` : undefined,
      })}>
        {props.children}
    </div>
  );
}

type SearchItemProps = {
  group?: string;
  result: PagefindSearchFragment;
  close?: () => void;
}

const GROUP_ICONS: Record<string, Icon> = {
  blog: DescriptionIcon,
  info: InfoIcon,
  other: SearchIcon,
};
const getGroupIcon = (group: string = "other") => {
  return GROUP_ICONS[group];
}

type SearchItemIconProps = {
  group?: string;
} & Omit<ComponentProps<"svg">, "children">;
const SearchItemIcon: Component<SearchItemIconProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    ["group"],
  );
  return (
    <Dynamic
      component={getGroupIcon(localProps.group)}
      width={24}
      height={24}
      style={{ "min-width": "24px", "min-height": "24px" }}
      {...otherProps} />
  )
}

const SearchItem: Component<SearchItemProps> = (props) => {
  return (
    <>
      <ListItem
        class={searchItemStyle}
        onClick={props.close}
        type="link"
        leading={<SearchItemIcon group={props.group} />}
        title={props.result.meta.title}
        href={props.result.url} />
      <For each={props.result.sub_results}>{
        (subResult) => (
          <SearchSubItem
            subResult={subResult}
            group={props.group} />
        )
      }</For>
    </>
  );
}
type SearchSubItemProps = {
  group?: string;
  subResult: PagefindSubResult;
  close?: () => void;
}
const SearchSubItem: Component<SearchSubItemProps> = (props) => {
  return (
    <ListItem
      class={searchSubItemStyle}
      href={props.subResult.url}
      // leading={<SearchItemIcon group={props.group} />}
      leading={<TagIcon width={24} height={24} style={{"min-width": "24px", "min-height": "24px"}} />}
      title={props.subResult.title}
      subtitle={
        <span innerHTML={props.subResult.excerpt} />
      } />
  );
}










// type SearchResultSubProps = {
//   index: number;
//   result: PagefindSearchFragment;
//   close: () => void;
// }

// const SearchResultSub: Component<SearchResultSubProps> = (props) => {
//   return (
//     <div
//     class={searchResultStyle}
//     style={
//       assignInlineVars({
//         [searchResultIndex]: `${props.index}`,
//       })
//     }>
//       <ListItem
//         onClick={() => props.close()}
//         type="link"
//         leading={<DescriptionIcon width={24} height={24} />}
//         title={props.result.meta.title}
//         href={props.result.url} />
//       <For each={props.result.sub_results}>{
//         (subResult) => (
//           <ListItem
//             onClick={() => props.close()}
//             class={searchSubResultStyle}
//             type="link"
//             leading={<SearchIcon width={24} height={24} />}
//             title={subResult.title}
//             subtitle={<span innerHTML={subResult.excerpt} />}
//             href={subResult.url} />
//         )
//       }</For>
//     </div>
//   );
// }
