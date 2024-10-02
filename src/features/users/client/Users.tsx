import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Button, Flex } from "@yamada-ui/react";
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

  const client = useQueryClient();

  return (
    <Flex flexDirection="column">
      {users.map((user) => (
        <Box key={user.id}>
          {user.id}
          {user.name}
        </Box>
      ))}
      <Button
        onClick={async () => {
          await query.api.users.$post({
            json: { name: "test" },
          });
          client.resetQueries({
            queryKey: ["users"],
          });
        }}
      >
        Users
      </Button>
      <Button
        onClick={() => {
          fetchNextPage();
        }}
      >
        Next
      </Button>
    </Flex>
  );
};
