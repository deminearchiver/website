import { createFilter, type Plugin } from "vite";

import { createRequire } from "module";
import { loadFont, type Variant } from "./font";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "pathe";

export type Alias = [string, ...string[]];
export type AliasOptions = {
  [P in Variant]: Alias[];
}

export type Options = {
  alias: AliasOptions;
}

const aliasToArray = (alias: string): [module: string, ...path: string[]] => {
  return alias.split(/\/+/) as [string, ...string[]];
}

const CSS = `
@font-face {
  font-family: 'Material Symbols Rounded Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 700;
  src: url(/material-symbols/rounded.woff2) format('woff2-variations');
}
`;
// ./files/material-symbols-rounded-latin-wght-normal.woff2

const require = createRequire(import.meta.url);
const materialSymbols = async (options?: Partial<Options>): Promise<Plugin[]> => {
  const virtualModuleId = "virtual:material-symbols/rounded/";

  const fontModuleId = "virtual:material-symbols/font/rounded.woff2";
  const resolvedFontModuleId = `${fontModuleId}`;

  const stylesModuleId = "virtual:material-symbols/styles/rounded.css";
  const resolvedStylesModuleId = `${stylesModuleId}`;

  const icons = new Map<string, string>();

  const font = await loadFont("rounded");


  return [
    {
      name: "material-symbols/icons",
      resolveId(id) {
        if(id.startsWith(virtualModuleId)) {
          const resolvedId = `${id}.tsx`;
          icons.set(resolvedId, resolvedId);
          return resolvedId;
        }
      },
      load(id) {
        if(icons.has(id)) {
          const code = `export default (props = {}) => {
            return (
              <span class="material-symbols-rounded">home</span>
            );
          }`;
          return {
            code,
          };
        }
      },
    },
    {
      name: "material-symbols/assets",
      configureServer: (server) => {
        server.middlewares.use(
          (req, res, next) => {
            if(req.url === "/material-symbols/rounded.woff2") {
              const run = font.layout("home");
              const subset = font.createSubset();
              run.glyphs.forEach(glyph => subset.includeGlyph(glyph));
              const bytes = subset.encode();
              res.end(bytes);
            } else next();
          }
        );
      },
      resolveId(id) {
        if(id === fontModuleId) {
          return resolvedFontModuleId;
        }
        if(id === stylesModuleId) {
          return resolvedStylesModuleId;
        }
      },
      load(id) {
        if(id === resolvedFontModuleId) {
          // const run = font.layout([...icons].join(""));
          const run = font.layout("home");
          console.log(run.glyphs);
          const subset = font.createSubset();
          run.glyphs.forEach(glyph => subset.includeGlyph(glyph));
          const bytes = subset.encode();
          const buffer =  Buffer.from(bytes);
          return `const src = \`${buffer.toString()}\`; export default src`;
        }
        if(id === resolvedStylesModuleId) return CSS;
      },
    },
  ];
}

export default materialSymbols;
