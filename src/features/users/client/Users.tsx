import { Box, Button, Flex } from "@yamada-ui/react";
import {
  type ClientRequestOptions,
  type ClientResponse,
  hc,
} from "hono/client";
import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { useLazyFetch } from "~/hooks/useLazyFetch";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";
import { fetcher } from "~/utils/fetcher";

const client = hc<UsersAPI>(clientUrl);

const limit = 10;

export const Users = () => {
  const getKey = useCallback(
    (pageIndex: number) => `/api/users?limit=10&offset=${pageIndex * limit}`,
    [],
  );

  const infiniteFetcher = useCallback(async (key: string) => {
    const url = new URL(key, clientUrl);
    const limit = url.searchParams.get("limit") || "10";
    const offset = url.searchParams.get("offset") || "0";

    const response = await client.api.users.$get({
      query: { limit, offset },
    });

    return await response.json();
  }, []);

  const { data, setSize } = useSWRInfinite(getKey, infiniteFetcher);

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
