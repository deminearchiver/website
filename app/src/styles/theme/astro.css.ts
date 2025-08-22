type Theme = {
  [key: string]: string | Theme;
}
type Variable = [name: string, value: string];

const CAMEL_CASE_REGEX = /[A-Z]+(?![a-z])|[A-Z]/g;
const toKebabCase = (text: string) => {
  return text.replace(
    CAMEL_CASE_REGEX,
    (match, offset) => `${offset ? "-" : ""}${match}`,
  ).toLowerCase();
}
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
  theme = structuredClone(theme);
  return Object.entries(theme)
    .flatMap((entry) => processor(entry, "theme"))
    .map(([name, value]) => `${name}: ${value};`)
    .join("");
}

type CSSVarFunction = `var(--${string})` | `var(--${string}, ${string | number})`;
type Contract = {
    [key: string]: CSSVarFunction | Contract;
};

export const test = (contract: Contract): Record<string, string> => {
  const vars: Record<string, string> = {};
  const recursive = (record: Contract, ...prefixes: string[]) => {
    for(const key in record) {
      const value = record[key];
      if(value === null || typeof value === "string") {
        const name = `--${prefixes.join("-")}-${toKebabCase(key)}`;
        vars[name] = value;
      } else {
        recursive(value, ...prefixes, key);
      }
    }
  }
  recursive(contract);
  return vars;
}
