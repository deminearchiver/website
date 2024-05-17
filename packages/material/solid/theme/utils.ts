import { createGlobalThemeContract } from "@vanilla-extract/css";

export type CSSVarFunction = `var(--${string})` | `var(--${string}, ${string | number})`;
export type Contract = {
  [key: string]: CSSVarFunction | null | Contract;
};
export type Primitive = string | boolean | number | null | undefined;
export type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Primitive ? LeafType : Obj[Prop] extends Record<string | number, any> ? MapLeafNodes<Obj[Prop], LeafType> : never;
};
export type NullableTokens = {
  [key: string]: string | NullableTokens | null;
};
export type Tokens = {
  [key: string]: string | Tokens;
};

export type ThemeVars<ThemeContract extends NullableTokens> = MapLeafNodes<ThemeContract, CSSVarFunction>;




const CAMEL_CASE_REGEX = /[A-Z]+(?![a-z])|[A-Z]/g;
// const CAMEL_CASE_REGEX = /\p{Uppercase}+(?!\p{Lowercase})|\p{Uppercase}/gu;
const toKebabCase = (text: string) => {
  return text.replace(
    CAMEL_CASE_REGEX,
    (match, offset) => `${offset ? "-" : ""}${match}`,
  ).toLowerCase();
}

type Theme = {
  [key: string]: string | Theme;
}
type Variable = [name: string, value: string];

const processor = (
  [name, value]: [string, string | Theme],
  ...prefixes: string[]
): Variable[] => {
  if(typeof value === "string") {
    name = `--${prefixes.join("-")}-${toKebabCase(name)}`;
    return [[name, value]];
  } else {
    return Object.entries(value)
      .flatMap(
        (entry) => processor(
          entry,
          ...prefixes,
          toKebabCase(name)
        )
      );
  }
}
export const scopedToGlobal = (theme: Theme): string => {
  return Object.entries(theme)
    .flatMap((entry) => processor(entry, "theme"))
    .map(([name, value]) => `${name}: ${value};`)
    .join("");
}
