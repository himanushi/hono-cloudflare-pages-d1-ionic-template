import { IonButton, IonItem, IonLabel } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { MeAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";
import { fetcher } from "~/utils/fetcher";

export const client = hc<MeAPI>(clientUrl);

export const Me = () => {
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: fetcher(client.api.me.$get, { query: { name: "yamada" } }),
  });

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
