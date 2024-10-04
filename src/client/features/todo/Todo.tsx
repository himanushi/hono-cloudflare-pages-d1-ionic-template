import { IonButton, IonItem, IonList } from "@ionic/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import { clientUrl } from "~/client/utils/clientUrl";
import type { TodoAPI } from "~/server/routes";

const query = hc<TodoAPI>(clientUrl);
const limit = 10;

export const Todo = () => {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["todo"],
    queryFn: ({ pageParam }) =>
      query.api.todo
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

  const todo = (data ?? { pages: [] }).pages.flat();

  return (
    <IonList>
      {todo.map((td) => (
        <IonItem key={td.id}>
          {td.id}
          {td.title}
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
