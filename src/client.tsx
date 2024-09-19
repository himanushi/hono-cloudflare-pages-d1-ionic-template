import {
  ColorModeScript,
  ThemeSchemeScript,
  UIProvider,
  defaultConfig,
} from "@yamada-ui/react";
import { createRoot } from "react-dom/client";
import App from "./app";

const domNode = document.getElementById("root");
if (domNode) {
  const root = createRoot(domNode);

  root.render(
    <>
      <ColorModeScript
        type="cookie"
        nonce="testing"
        initialColorMode={defaultConfig.initialColorMode}
      />
      <ThemeSchemeScript
        type="cookie"
        nonce="testing"
        initialThemeScheme={defaultConfig.initialThemeScheme}
      />
      <UIProvider>
        <App />
      </UIProvider>
    </>,
  );
} else {
  console.error("Root element not found");
}
