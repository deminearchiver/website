const ID_REGEX = /^~@material\/symbols\//;
const SINGLE_EXTENSION_REGEX = /\.\w+$/i;
const MULTI_EXTENSIONS_REGEX = /(?:\.\w+)+$/i;

export const resolveIconPath = (id: string): string => {
  return id
          .replace(ID_REGEX, "")
          .replace(MULTI_EXTENSIONS_REGEX, "");
}

export type Icon = {
  variant: "rounded" | "sharp";
  name: string;
}

export const resolveIcon = (path: string): Icon => {
  const [name, variant] = path.split(":", 2);
  if(variant !== "rounded" && variant !== "sharp") {
    throw new Error(`Invalid variant: ${variant}`);
  }
  return {
    name, variant,
  };
}
