import { createUnplugin, type UnpluginFactory } from "unplugin";
import type { Options } from "./types";
import { resolveIcon, resolveIconPath, type Icon } from "./core/loader";
import { createRequire } from "module";
import { readFile } from "fs/promises";



const ID_REGEX = /^~@material\/+symbols\/+/;
const isIconPath = (id: string): boolean => {
  return ID_REGEX.test(id);
}

const removeExtension = (id: string): string => {
  return id.replace(/(?:\.\w+)+$/i, "");
}


export const unpluginFactory: UnpluginFactory<Options | undefined, true> = options => {
  const ID = "~@material/symbols/";

  const icons = new Set<Icon>();

  const require = createRequire(import.meta.url);
  return [
    {
      name: "@material/symbols/icons",
      enforce: "pre",
      resolveId(id, importer) {
        if(!isIconPath(id)) return;
        console.log("RESOLVEID: icon");
        id = removeExtension(id);
        return `${id}.tsx`;
      },
      loadInclude(id) {
        return isIconPath(id);
      },
      load(id) {
        const path = resolveIconPath(id);
        const icon = resolveIcon(path);
        return `export default (props) => <span {...props} class="material-symbols-${icon.variant}">${icon.name}</span>;`;
      },
    },
    {
      name: "@material/symbols/font",
      enforce: "pre",
      resolveId(id) {
        if(id !== "~material/symbols/font.woff2") return;
        console.log("RESOLVEID: font");
        return { id, external: true };
      },
      loadInclude(id) {
        return id === "~material/symbols/font.woff2";
      },
      async load(id) {
        const path = require.resolve("@fontsource-variable/material-symbols-rounded/files/material-symbols-rounded-latin-full-normal.woff2");
        const buffer = await readFile(path, "binary");
        return buffer;
      },
    }
  ];
}

const unplugin = createUnplugin(unpluginFactory);
export default unplugin;
