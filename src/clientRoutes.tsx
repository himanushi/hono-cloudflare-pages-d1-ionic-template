import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";
import { Home } from "~/features/home/client/Home";

export const ClientRoutes = () => (
  <IonReactRouter>
    <IonRouterOutlet>
      <Route path="/" exact component={Home} />
    </IonRouterOutlet>
  </IonReactRouter>
);
