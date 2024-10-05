import { IonButton, IonInput, IonItem, IonLabel, IonList } from "@ionic/react";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import { useMe } from "~/client/hooks/useMe";
import { clientUrl } from "~/client/utils/clientUrl";
import type { MeAPI } from "~/server/routes";

export const client = hc<MeAPI>(clientUrl);

export const Me = () => {
  const { me, refetch } = useMe();
  const [name, setName] = useState("");

  useEffect(() => {
    if (me?.name) {
      setName(me.name);
    } else {
      refetch();
    }
  }, [me?.name, refetch]);

  return (
    <IonList>
      <IonItem>
        <IonLabel>{me ? "ログイン済" : "未ログイン"}</IonLabel>
      </IonItem>
      <IonItem>
        <IonButton
          onClick={() => {
            window.open("/auth/login", "_self");
          }}
        >
          Login
        </IonButton>
        <IonButton
          onClick={() => {
            window.open("/auth/logout", "_self");
          }}
        >
          logout
        </IonButton>
      </IonItem>
      <IonItem>
        <IonInput
          label="名前"
          placeholder="名前"
          value={me?.name}
          onIonChange={(e) => {
            setName(e.detail.value ?? "");
          }}
        />
      </IonItem>
      <IonItem>
        <IonButton
          onClick={async () => {
            await client.api.me.$patch({
              json: { name },
            });
            await refetch();
          }}
        >
          名前変更
        </IonButton>
      </IonItem>
    </IonList>
  );
};
