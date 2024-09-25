import { Box, Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import useSWRInfinite from "swr/infinite";
import { useLazyFetch } from "~/hooks/useLazyFetch";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";
import { fetcher } from "~/utils/fetcher";

const client = hc<UsersAPI>(clientUrl);

export const Users = () => {
  const limit = 10;
  const { data, setSize } = useSWRInfinite(
    (pageIndex, _previousPageData) => [client.api.users.$get, pageIndex],
    async (props) => {
      console.log(props);
      const api = props[0];
      const pageIndex = props[1];
      return await fetcher(api)({
        query: {
          limit: limit.toString(),
          offset: (pageIndex * limit).toString(),
        },
      })();
    },
  );

  const users = (data ?? []).flat();

  const [create] = useLazyFetch({
    key: "postUsers",
    api: client.api.users.$post,
    args: { json: { name: "test" } },
  });

  return (
    <Flex flexDirection="column">
      {users?.map((user) => (
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
      <Button
        onClick={() => {
          setSize((prev) => prev + 1);
        }}
      >
        Next
      </Button>
    </Flex>
  );
};
