import { tooltipFactory } from "./tooltip";
export const Tooltip = {
  Plain: tooltipFactory("plain"),
  Rich: tooltipFactory("rich"),
};

export type { TooltipProps as PlainTooltipProps } from "./tooltip";
