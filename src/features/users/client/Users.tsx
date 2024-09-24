import { Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useState } from "react";
import { useFetch } from "~/hooks/useFetch";
import { useLazyFetch } from "~/hooks/useLazyFetch";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";

const client = hc<UsersAPI>(clientUrl);

export const Users = () => {
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const { data: users, mutate } = useFetch({
    key: "users",
    api: client.api.users.$get,
    args: { query: { limit: limit.toString(), offset: "0" } },
  });

  const [create] = useLazyFetch({
    api: client.api.users.$post,
    args: { json: { name: "test" } },
  });

  return (
    <Flex flexDirection="column">
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <Button
        onClick={() => {
          create();
        }}
      >
        Users
      </Button>
    </Flex>
  );
};
