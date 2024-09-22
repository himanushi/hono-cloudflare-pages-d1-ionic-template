import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.always.css";

import { IonApp, setupIonicReact } from "@ionic/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClientRoutes } from "./clientRoutes";

setupIonicReact({ mode: "ios" });

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <IonApp>
      <ClientRoutes />
    </IonApp>
  </StrictMode>,
);
