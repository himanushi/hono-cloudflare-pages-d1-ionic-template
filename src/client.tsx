import {
  ColorModeScript,
  ThemeSchemeScript,
  UIProvider,
  defaultConfig,
} from "@yamada-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import { preferencesProvider } from "~/utils/preferencesProvider";
import { clientRoutes } from "./clientRoutes";

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <SWRConfig value={{ provider: preferencesProvider }}>
      <ColorModeScript
        type="cookie"
        initialColorMode={defaultConfig.initialColorMode}
      />
      <ThemeSchemeScript
        type="cookie"
        initialThemeScheme={defaultConfig.initialThemeScheme}
      />
      <UIProvider>
        <RouterProvider router={clientRoutes} />
      </UIProvider>
    </SWRConfig>
  </StrictMode>,
);
