declare global {
  declare module "solid-js" {
    namespace JSX {
      type _Attributes = {
        [P in keyof HTMLElementTagNameMap as P extends `astro-dev-toolbar-${string}` ? P : never]: HTMLAttributes<HTMLElementTagNameMap[P]>;
      }
      interface IntrinsicElements extends _Attributes {}
    }
  }
}
