import { UIProvider } from "@yamada-ui/react";
import { createRoot } from "react-dom/client";
import App from "./app";

const domNode = document.getElementById("root");
if (domNode) {
  const root = createRoot(domNode);
  root.render(
    <UIProvider>
      <App />
    </UIProvider>,
  );
} else {
  console.error("Root element not found");
}
