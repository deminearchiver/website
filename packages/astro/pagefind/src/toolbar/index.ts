import { defineToolbarApp } from "astro/toolbar";

import { render } from "solid-js/web";
import { AstroDevToolbar } from "astro/runtime/client/dev-toolbar/toolbar.js";
import { ClientPort } from "./port/client";
import { createSignal, type Component } from "solid-js";
import html from "solid-js/html";

type AppProps = {
  port: ClientPort;
}

const App: Component<AppProps> = ({ port }) => {
  const [text, setText] = createSignal("Run Pagefind");

  return html`
<astro-dev-toolbar-window>
  <input
    type="text" />
  <astro-dev-toolbar-button
    onClick=${() => port.index()}
    size="large"
    type="">
      ${text}
  </astro-dev-toolbar-button>
</astro-dev-toolbar-window>
`;
}


export default defineToolbarApp({
    init(canvas, app, server) {

      const port = new ClientPort(server);
      port.init();

      render(
        () => App({
          port
        }),
        canvas,
      );

      // const port = new ClientPort(server);
      // port.init();

      // const toolbar = document.createElement("astro-dev-toolbar-window");
      // const button = document.createElement("astro-dev-toolbar-button");
      // button.textContent = "Run Pagefind";
      // button.buttonStyle = "outline";
      // button.size = "large";

      // let indexing = false;

      // button.onclick = (event) => {
      //   if(indexing) {
      //     event?.preventDefault();
      //     return;
      //   }
      //   button.textContent = "Indexing...";
      //   port.index()
      //     .then(() => button.textContent = "Run Pagefind")
      //     .catch(error => button.textContent = `${error}`);
      // }


      // toolbar.appendChild(button);
      // canvas.appendChild(toolbar);
    },
});

