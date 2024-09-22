import {
  ColorModeScript,
  ThemeSchemeScript,
  UIProvider,
  defaultConfig,
} from "@yamada-ui/react";
import { createRoot } from "react-dom/client";
import { Users } from "~/features/users/client/Users";

const domNode = document.getElementById("root");
if (domNode) {
  const root = createRoot(domNode);

  root.render(
    <>
      <ColorModeScript
        type="cookie"
        initialColorMode={defaultConfig.initialColorMode}
      />
      <ThemeSchemeScript
        type="cookie"
        initialThemeScheme={defaultConfig.initialThemeScheme}
      />
      <UIProvider>
        <Users />
      </UIProvider>
    </>,
  );
} else {
  console.error("Root element not found");
}
