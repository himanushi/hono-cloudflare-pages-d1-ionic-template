import { IonButton, IonItem, IonLabel, IonList } from "@ionic/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";

const query = hc<UsersAPI>(clientUrl);
const limit = 10;

export const Users = () => {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam }) =>
      query.api.users
        .$get({
          query: {
            limit: limit.toString(),
            offset: pageParam.offset.toString(),
          },
        })
        .then((res) => res.json()),
    initialPageParam: { offset: 0, limit: 10 },
    getNextPageParam: (lastPage, _allPages, lastPageParam, _allPageParams) =>
      lastPage.length === 0
        ? undefined
        : { offset: lastPageParam.offset + limit, limit },
  });

  const users = (data ?? { pages: [] }).pages.flat();

  return (
    <IonList>
      <IonItem>
        <IonLabel>
          本当にすばらしい旅だった。多くの愛すべき人々と出会ったが、彼らと再び会うことはないだろう。一生は短く、誰もがリダウトの安全と繁栄のために尽力しなければならない。それでも、訪れたすべての都市でたくさん旅をした。多くの人々がいたが、時間が足りなかった。
        </IonLabel>
      </IonItem>
      {users.map((user) => (
        <IonItem key={user.id}>
          {user.id}
          {user.name}
        </IonItem>
      ))}
      <IonItem>
        <IonButton
          onClick={() => {
            fetchNextPage();
          }}
        >
          Next
        </IonButton>
      </IonItem>
    </IonList>
  );
};
