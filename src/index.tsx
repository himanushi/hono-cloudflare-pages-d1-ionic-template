import {
  Button,
  ColorModeScript,
  type ColorModeWithSystem,
  ThemeSchemeScript,
  UIProvider,
  defaultConfig,
} from "@yamada-ui/react";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import ReactDOMServer from "react-dom/server";

const app = new Hono();

app.get("*", (c) => {
  const colorMode = getCookie(c, "ui-color-mode");
  const themeScheme = getCookie(c, "ui-theme-scheme");

  return c.html(
    ReactDOMServer.renderToString(
      <html lang="ja">
        <head>
          <script type="module" src="/src/client.tsx" />
        </head>

        <body>
          <ColorModeScript
            type="cookie"
            nonce="testing"
            initialColorMode={
              (colorMode as ColorModeWithSystem) ??
              defaultConfig.initialColorMode
            }
          />
          <ThemeSchemeScript
            type="cookie"
            nonce="testing"
            initialThemeScheme={themeScheme ?? defaultConfig.initialThemeScheme}
          />
          <UIProvider>
            <Button>Click me!</Button>
          </UIProvider>
        </body>
      </html>,
    ),
  );
});

export default app;
