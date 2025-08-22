import { defineCollection, getCollection, z, type SchemaContext } from "astro:content";
import { imageSchema } from "./utils";
import type { Component, ComponentProps } from "solid-js";

import JavaScriptIcon from "~icons/simple-icons/javascript";
import TypeScriptIcon from "~icons/simple-icons/typescript";
import AstroIcon from "~icons/simple-icons/astro";
import SolidIcon from "~icons/simple-icons/solid";
import CIcon from "~icons/simple-icons/c";
import CPlusPlusIcon from "~icons/simple-icons/cplusplus";
import CSharpIcon from "~icons/simple-icons/csharp";
import DartIcon from "~icons/simple-icons/dart";
import FlutterIcon from "~icons/simple-icons/flutter";
import WebAssemblyIcon from "~icons/simple-icons/webassembly";
import VisualStudioIcon from "~icons/simple-icons/visualstudio";
import VisualStudioCodeIcon from "~icons/simple-icons/visualstudiocode";
import RustIcon from "~icons/simple-icons/rust";
import PythonIcon from "~icons/simple-icons/python";
import GoIcon from "~icons/simple-icons/go";
import QwikIcon from "~icons/simple-icons/qwik";
import NextJsIcon from "~icons/simple-icons/nextdotjs";
import ReactIcon from "~icons/simple-icons/react";
import ElectronIcon from "~icons/simple-icons/electron";
import TauriIcon from "~icons/simple-icons/tauri";
import { glob } from "astro/loaders";

type Author = {
  name: string;
  avatar?: {
    src: string;
    alt?: string;
  };
};
const AUTHORS = {
  deminearchiver: {
    name: "deminearchiver",
    avatar: {
      src: "deminearchiver.png",
      alt: "deminearchiver",
    },
  },
} satisfies Record<string, Author>;
type AuthorsKey = keyof typeof AUTHORS;
const authorsKeys = Object.keys(AUTHORS) as [AuthorsKey, ...AuthorsKey[]];

export type Tag = {
  icon?: Component<ComponentProps<"svg">>;
  label: string;
};

// Includes some tags I will probably never use
export const TAGS = {
  // Design systems
  fluentDesign: "Fluent Design",
  materialDesign: "Material Design",

  // IDEs
  visualStudio: {
    icon: VisualStudioIcon,
    label: "Visual Studio",
  },
  vscode: {
    icon: VisualStudioCodeIcon,
    label: "Visual Studio Code",
  },

  // Languages
  javascript: {
    icon: JavaScriptIcon,
    label: "JavaScript",
  },
  typescript: {
    icon: TypeScriptIcon,
    label: "TypeScript",
  },
  c: {
    icon: CIcon,
    label: "C",
  },
  cplusplus: {
    icon: CPlusPlusIcon,
    label: "C++",
  },
  csharp: {
    icon: CSharpIcon,
    label: "C#",
  },
  dart: {
    icon: DartIcon,
    label: "Dart",
  },
  rust: {
    icon: RustIcon,
    label: "Rust",
  },
  python: {
    icon: PythonIcon,
    label: "Python",
  },
  go: {
    icon: GoIcon,
    label: "Go"
  },
  wasm: {
    icon: WebAssemblyIcon,
    label: "WebAssembly",
  },

  // Frameworks
  flutter: {
    icon: FlutterIcon,
    label: "Flutter",
  },
  astro: {
    icon: AstroIcon,
    label: "Astro",
  },
  solidJs: {
    icon: SolidIcon,
    label: "SolidJS",
  },
  solidStart: "Solid Start",
  qwik: {
    icon: QwikIcon,
    label: "Qwik",
  },
  nextjs: {
    icon: NextJsIcon,
    label: "Next.js",
  },
  react: {
    icon: ReactIcon,
    label: "React",
  },
  vue: "Vue",
  svelte: "Svelte",
  electron: {
    icon: ElectronIcon,
    label: "Electron",
  },
  tauri: {
    icon: TauriIcon,
    label: "Tauri",
  },

  // Libraries
  vanillaExtract: "Vanilla Extract",
} satisfies Record<string, string | Tag>;
type TagsKey = keyof typeof TAGS;
const tagsKeys = Object.keys(TAGS) as [TagsKey, ...TagsKey[]];


export const blogSchema = (context: SchemaContext) => {
  return z.object({
    wip: z.boolean().default(false),
    hide: z.enum(["development", "production"]).optional(),
    title: z.string(),
    description: z.string().optional(),
    cover: imageSchema(context).optional(),
    authors: z.array(z.enum(authorsKeys))
      .transform((ids, { addIssue }) => {
        ids = [...new Set(ids)];
        if(ids.length === 0) addIssue({
          type: "array",
          code: "too_small",
          minimum: 1,
          inclusive: true,
          fatal: true,
        });
        return ids.map(id => {
          const { name, avatar } = AUTHORS[id] as Author;
          return {
            id,
            name: name,
            avatar,
          };
        });
      }),
    tags: z.array(z.enum(tagsKeys))
      .default([])
      .transform(ids => [...new Set(ids)]),
    createdAt: z.date(),
    editedAt: z.date().optional(),
  });
}

export const getBlogCollection = async () => {
  let entries = (await getCollection("blog"));
  if(import.meta.env.PROD) {
    entries = entries.filter(entry => !entry.data.wip && entry.data.hide !== "production");
  }
  if(import.meta.env.DEV) {
    entries = entries.filter(entry => entry.data.hide !== "development");
  }
  return entries;
}
