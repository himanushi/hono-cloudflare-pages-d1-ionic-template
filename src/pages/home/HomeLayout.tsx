import {
  IonContent,
  IonHeader,
  IonItemDivider,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Me } from "~/features/me/client/Me";
import { Todo } from "~/features/todo/client/Todo";

export const HomeLayout = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Hono Todo</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonItemDivider>User Setting</IonItemDivider>
      <Me />
      <IonItemDivider>Todo</IonItemDivider>
      <Todo />
    </IonContent>
  </IonPage>
);
