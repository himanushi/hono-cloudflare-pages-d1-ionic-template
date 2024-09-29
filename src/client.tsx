import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ColorModeScript,
  ThemeSchemeScript,
  UIProvider,
  defaultConfig,
} from "@yamada-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { clientRoutes } from "./clientRoutes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
