import { Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useFetch } from "~/hooks/useFetch";
import { useLazyFetch } from "~/hooks/useLazyFetch";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";
import { fetcher } from "~/utils/fetcher";

const client = hc<UsersAPI>(clientUrl);

export const Users = () => {
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const { mutate: refetch } = useSWRConfig();
  const { data: users, mutate } = useFetch({
    key: "getUsers",
    api: client.api.users.$get,
    args: { query: { limit: limit.toString(), offset: offset.toString() } },
  });

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
          await refetch("getUsers");
        }}
      >
        Users
      </Button>
      <Button
        onClick={async () => {
          setOffset((prev) => prev + limit);
          await refetch("getUsers");
        }}
      >
        Next
      </Button>
    </Flex>
  );
};
