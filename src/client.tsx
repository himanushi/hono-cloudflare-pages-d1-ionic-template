import { Preferences } from "@capacitor/preferences";
import {
  ColorModeScript,
  ThemeSchemeScript,
  UIProvider,
  defaultConfig,
} from "@yamada-ui/react";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import { preferencesProvider } from "~/utils/preferencesProvider";
import { clientRoutes } from "./clientRoutes";

const App = () => {
  const [value, setValue] = useState<string | null | undefined>();

  useEffect(() => {
    Preferences.get({ key: "app-cache" }).then(({ value }) => {
      setValue(value);
    });
  }, []);

  if (value === undefined) {
    return <></>;
  }

  return (
    <SWRConfig
      value={{
        provider: preferencesProvider(value),
        revalidateOnReconnect: false,
        revalidateOnFocus: false,
        focusThrottleInterval: 0,
        errorRetryCount: 0,
        dedupingInterval: 3000,
        shouldRetryOnError: false,
        keepPreviousData: true,
      }}
    >
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
  );
};

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
