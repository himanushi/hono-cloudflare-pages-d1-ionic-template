import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Me } from "~/features/me/client/Me";
import { Users } from "~/features/users/client/Users";

export const HomeLayout = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Home</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonItem>
        <IonLabel>アプリ名</IonLabel>
      </IonItem>
      <Me />
      <Users />
    </IonContent>
  </IonPage>
);
