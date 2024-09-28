import { Box, Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useInfiniteFetch } from "~/hooks/useInfiniteFetch";
import { useLazyFetch } from "~/hooks/useLazyFetch";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";

const client = hc<UsersAPI>(clientUrl);
const limit = 100;

export const Users = () => {
  const {
    items: users,
    hasNext,
    setSize,
    ...response
  } = useInfiniteFetch({
    getKey: (pageIndex) =>
      `/api/users?limit=${limit}&offset=${pageIndex * limit}`,
    fetcher: async (key: string) => {
      const url = new URL(key, clientUrl);
      const limit = url.searchParams.get("limit");
      const offset = url.searchParams.get("offset");
      if (limit !== null && offset !== null) {
        const response = await client.api.users.$get({
          query: { limit, offset },
        });
        return await response.json();
      }
      return [];
    },
  });

  const [create] = useLazyFetch({
    key: "postUsers",
    api: client.api.users.$post,
    args: { json: { name: "test" } },
  });

  return (
    <Flex flexDirection="column">
      <Button
        onClick={() => {
          console.log(response);
        }}
      >
        ログイン
      </Button>
      {users.map((user) => (
        <Box key={user.id}>
          {user.name}
          {user.id}
        </Box>
      ))}
      <Button
        onClick={async () => {
          await create();
        }}
      >
        Users
      </Button>
      {hasNext && (
        <Button
          onClick={() => {
            setSize((prev) => prev + 1);
          }}
        >
          Next
        </Button>
      )}
      <Button
        onClick={() => {
          setSize((prev) => prev + 1);
        }}
      >
        Reset
      </Button>
    </Flex>
  );
};
