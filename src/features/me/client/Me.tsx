import { IonButton, IonItem, IonLabel } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import { useMe } from "~/hooks/useMe";
import type { MeAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";
import { fetcher } from "~/utils/fetcher";

export const client = hc<MeAPI>(clientUrl);

export const Me = () => {
  const { me } = useMe();

  return (
    <IonItem>
      <IonLabel>{me?.name}</IonLabel>
      <IonButton
        onClick={() => {
          window.open("/auth/login", "_self");
        }}
      >
        google login
      </IonButton>
    </IonItem>
  );
};
