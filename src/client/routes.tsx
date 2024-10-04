import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { HomeLayout } from "~/client/pages/home/HomeLayout";

export const clientRoutes = (
  <IonReactRouter>
    <IonRouterOutlet>
      <Route path="/home" component={HomeLayout} exact={true} />
      <Route exact path="/" render={() => <Redirect to="/home" />} />
    </IonRouterOutlet>
  </IonReactRouter>
);
