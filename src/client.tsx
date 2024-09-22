import {
  ColorModeScript,
  ThemeSchemeScript,
  UIProvider,
  defaultConfig,
} from "@yamada-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import { Users } from "~/features/users/client/Users";
import { preferencesProvider } from "~/utils/preferencesProvider";

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
        <Users />
      </UIProvider>
    </SWRConfig>
  </StrictMode>,
);
