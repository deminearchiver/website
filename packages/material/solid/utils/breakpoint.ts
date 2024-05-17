import { createMediaQuery } from "@solid-primitives/media";
import { createMemo, type Accessor } from "solid-js";
import { isServer } from "solid-js/web";

export type Breakpoint = "compact" | "medium" | "expanded" | "large" | "extraLarge";
export type BreakpointReturn = {
  lt: (value: Breakpoint) => boolean;
  lte: (value: Breakpoint) => boolean;
  gt: (value: Breakpoint) => boolean;
  gte: (value: Breakpoint) => boolean;
  between: (a: Breakpoint, b: Breakpoint) => boolean;
} & Accessor<Breakpoint>;
export const createBreakpoint = (serverFallback: Breakpoint = "expanded"): BreakpointReturn => {
  const BREAKPOINTS_TABLE: Record<Breakpoint, number> = {
    compact: 0,
    medium: 1,
    expanded: 2,
    large: 3,
    extraLarge: 4,
  };
  if(isServer) {
    const breakpoint = (() => serverFallback) as BreakpointReturn;
    breakpoint.lt = (value) =>
      BREAKPOINTS_TABLE[serverFallback] < BREAKPOINTS_TABLE[value];
    breakpoint.lte = (value) =>
      BREAKPOINTS_TABLE[serverFallback] <= BREAKPOINTS_TABLE[value];
    breakpoint.gt = (value) =>
      BREAKPOINTS_TABLE[serverFallback] > BREAKPOINTS_TABLE[value];
    breakpoint.gte = (value) =>
      BREAKPOINTS_TABLE[serverFallback] >= BREAKPOINTS_TABLE[value];
    breakpoint.between = (a, b) => {
      return (breakpoint.gt(a) && breakpoint.lt(b))
      || (breakpoint.gt(b) && breakpoint.lt(a));
    }
    return breakpoint;
  };

  const minWidth = (value: number) => `only screen and (min-width: ${value}px)`;

  const isMedium = createMediaQuery(minWidth(600));
  const isExpanded = createMediaQuery(minWidth(840));
  const isLarge = createMediaQuery(minWidth(1200));
  const isExtraLarge = createMediaQuery(minWidth(1600));

  const breakpoint = createMemo<Breakpoint>(() => {
    if(isExtraLarge()) return "extraLarge";
    if(isLarge()) return "large";
    if(isExpanded()) return "expanded";
    if(isMedium()) return "medium";
    return "compact";
  }) as BreakpointReturn;

  breakpoint.lt = (value) =>
    BREAKPOINTS_TABLE[breakpoint()] < BREAKPOINTS_TABLE[value];
  breakpoint.lte = (value) =>
    BREAKPOINTS_TABLE[breakpoint()] <= BREAKPOINTS_TABLE[value];
  breakpoint.gt = (value) =>
    BREAKPOINTS_TABLE[breakpoint()] > BREAKPOINTS_TABLE[value];
  breakpoint.gte = (value) =>
    BREAKPOINTS_TABLE[breakpoint()] >= BREAKPOINTS_TABLE[value];
  breakpoint.between = (a, b) => {
    return (breakpoint.gt(a) && breakpoint.lt(b))
    || (breakpoint.gt(b) && breakpoint.lt(a));
  }
  return breakpoint;
}
