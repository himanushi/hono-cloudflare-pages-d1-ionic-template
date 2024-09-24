import { Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useFetch } from "~/hooks/useFetch";
import { useInfiniteFetch } from "~/hooks/useInfiniteFetch";
import { useLazyFetch } from "~/hooks/useLazyFetch";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";

const client = hc<UsersAPI>(clientUrl);

export const Users = () => {
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const { data, setSize } = useInfiniteFetch({
    getKey: (pageIndex, previousPageData) => {
      console.log(pageIndex, previousPageData);
      if (previousPageData && !previousPageData.length) return null;
      return [
        "getUsers",
        {
          query: {
            limit: limit.toString(),
            offset: (pageIndex * limit).toString(),
          },
        },
      ];
    },
    api: client.api.users.$get,
    args: { query: { limit: limit.toString(), offset: offset.toString() } },
  });

  const users = (data ?? [[]]).flat();

  const [create] = useLazyFetch({
    key: "postUsers",
    api: client.api.users.$post,
    args: { json: { name: "test" } },
  });

  return (
    <Flex flexDirection="column">
      {users?.map((user) => (
        <div key={user.id}>
          {user.name}
          {user.id}
        </div>
      ))}
      <Button
        onClick={async () => {
          await create();
        }}
      >
        Users
      </Button>
      <Button
        onClick={async () => {
          setSize((prev) => prev + 1);
        }}
      >
        Next
      </Button>
    </Flex>
  );
};
