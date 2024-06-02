export type Compiler = {
  extension?: string;
  generator: (name: string) => string;
};

export const COMPILERS = {
  solid: {
    extension: "tsx",
    generator(name) {
      return `export default (props) => <span class="material-symbols" {...props}>${name}</span>;`;
    },
  },
} satisfies Record<string, Compiler>;
