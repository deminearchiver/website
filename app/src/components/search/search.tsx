import { createBreakpoint } from "@material/solid/utils";
import { createEventListener } from "@solid-primitives/event-listener";
import { createPresence } from "@solid-primitives/presence";
import { resolveFirst } from "@solid-primitives/refs";
import { type JSX, splitProps, type Component, createEffect, createSignal, createMemo, Show, createResource, For, Switch, Match } from "solid-js";
import { searchDialogStyle, searchResultIndex, searchResultStyle, searchResultsMessageStyle, searchSubResultStyle, searchViewBarStyle, searchViewInputStyle, searchViewResultsStyle, searchViewStyle } from "./search.css";
import { debounce, leadingAndTrailing } from "@solid-primitives/scheduled";
import { createInfiniteScroll } from "./pagination";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { PagefindProvider, type Pagefind, type PagefindSearchFragment, type PagefindSearchResult } from "@pagefind/astro";

import { IconButton } from "@material/solid/components/icon-button";
import { ListItem } from "@material/solid/components/list";

import ArrowBackIcon from "~icons/material-symbols-rounded/arrow-back:outlined";
import CloseIcon from "~icons/material-symbols-rounded/close:outlined";
import SearchIcon from "~icons/material-symbols-rounded/search:outlined";
import SearchOffIcon from "~icons/material-symbols-rounded/search-off:outlined";
import TextFieldsAltIcon from "~icons/material-symbols-rounded/text-fields-alt:outlined";
import DescriptionIcon from "~icons/material-symbols-rounded/description:outlined";

import { isServer } from "solid-js/web";

export type SearchProps = {
  children: JSX.Element;
}

export const Search: Component<SearchProps> = (props) => {
  const [localProps, otherProps] = splitProps(
    props,
    ["children"]
  );

  const anchor = resolveFirst(
    () => localProps.children,
    (item): item is HTMLElement => item instanceof HTMLElement,
  );
  const breakpoint = createBreakpoint("expanded");

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
    () => anchor()!,
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
      highlightParam: "highlight"
    });
    return pagefind;
  });

  const [term, setTerm] = createSignal("");
  const [results, setResults] = createSignal<PagefindSearchResult[]>([]);

  const [
    pages,
    infiniteScrollLoader,
    { refetch, end, setPages }
  ] = createInfiniteScroll<PagefindSearchFragment>(
    async (page) => {
      // const result: PagefindSearchFragment =
      //   {
      //     url: "/",
      //     content: `Result ${page}`,
      //     excerpt: "Test",
      //     sub_results: [
      //     ],
      //     anchors: [],
      //     filters: {},
      //     word_count: 10,
      //     meta: { title: "Title" },
      //     locations: [],
      //     weighted_locations: [],
      //   }
      // return new Promise(resolve => resolve(Array(20).fill(result)));

      const RESULTS_PER_PAGE = 5;
      const from = page * RESULTS_PER_PAGE;
      const to = from + RESULTS_PER_PAGE;
      return await Promise.all(
        results().slice(from, to).map(result => result.data()),
      );
    },
  );

  const search = leadingAndTrailing(
    debounce,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async (pagefind: Pagefind, term: string) => {
      const search = await pagefind.search(term);
      setResults(search.results);
      setPages([]);
      await refetch();
    },
    300,
  );
  createEffect(async () => {
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
              <Switch fallback={
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
                    (page, index) => (
                      <SearchResult index={index()} result={page} />
                    )
                  }</For>
                  <Show when={!end()}>
                    <span use:infiniteScrollLoader>
                      Loading
                    </span>
                  </Show>
                </ul>
              </Match>
            </Switch>
          </search>
      </dialog>
    </div>
  )
}

type SearchResultProps = {
  index: number;
  result: PagefindSearchFragment;
}

const SearchResult: Component<SearchResultProps> = (props) => {
  return (
    <div
    class={searchResultStyle}
    style={
      assignInlineVars({
        [searchResultIndex]: `${props.index}`,
      })
    }>
      <ListItem
        type="link"
        leading={<DescriptionIcon width={24} height={24} />}
        title={props.result.meta.title}
        href={props.result.url} />
      <For each={props.result.sub_results}>{
        (subResult) => (
          <ListItem
            class={searchSubResultStyle}
            type="link"
            leading={<SearchIcon width={24} height={24} />}
            title={subResult.title}
            subtitle={<span innerHTML={subResult.excerpt} />}
            href={subResult.url} />
        )
      }</For>
    </div>
  );
}
