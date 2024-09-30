import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Box, Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";

const client = hc<UsersAPI>(clientUrl);
const limit = 10;

export const Users = () => {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: async ({ pageParam }) => {
      const res = await client.api.users.$get({
        query: { limit: limit.toString(), offset: pageParam.offset.toString() },
      });

      return await res.json();
    },
    initialPageParam: { offset: 0, limit },
    getNextPageParam: (lastPage, _allPages, lastPageParam, _allPageParams) =>
      lastPage.length === 0
        ? undefined
        : { offset: lastPageParam.offset + limit, limit },
  });

  useMutation({
    mutationKey: ["createUser"],
    mutationFn: async () => {
      const res = await client.api.users.$post({
        json: { name: "test" },
      });

      return await res.json();
    },
  });

  const users = (data ?? { pages: [] }).pages.flat();

  return (
    <Flex flexDirection="column">
      {users.map((user) => (
        <Box key={user.id}>
          {user.name}
          {user.id}
        </Box>
      ))}
      {/* <Button
        onClick={async () => {
          await create();
        }}
      >
        Users
      </Button> */}
      <Button
        onClick={() => {
          fetchNextPage();
        }}
      >
        Next
      </Button>
      <Button
      // onClick={() => {
      //   refetch();
      // }}
      >
        Reset
      </Button>
    </Flex>
  );
};
