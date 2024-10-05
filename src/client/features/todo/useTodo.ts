import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { hc } from "hono/client";
import { useState } from "react";
import { clientUrl } from "~/client/utils/clientUrl";
import type { TodoAPI } from "~/server/routes";

const query = hc<TodoAPI>(clientUrl);
const limit = 5;

export const useTodo = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
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
    initialPageParam: { offset: 0, limit },
    getNextPageParam: (lastPage, _allPages, lastPageParam, _allPageParams) =>
      lastPage.length === 0
        ? undefined
        : { offset: lastPageParam.offset + limit, limit },
  });

  const addTodoMutation = useMutation({
    mutationFn: ({ title }: { title: string }) =>
      query.api.todo.$post({
        json: { title },
      }),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["todo"] });
      setTitle("");
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({
      id,
      completed,
      title,
    }: {
      id: number;
      completed: boolean;
      title: string;
    }) =>
      query.api.todo.$patch({
        json: {
          id,
          status: completed ? "completed" : "active",
          title: title,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  const todo = (data ?? { pages: [] }).pages.flat();

  return {
    todo,
    fetchNextPage,
    hasNextPage,
    addTodoMutation,
    updateTodoMutation,
    title,
    setTitle,
  };
};
