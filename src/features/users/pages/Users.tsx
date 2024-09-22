import { Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useFetch } from "~/hooks/useFetch";
import type { UsersAPI } from "~/index";

export const client = hc<UsersAPI>(location.origin);

export const Users = () => {
  const { data: users } = useFetch({
    api: client.users.$get,
    args: { query: { limit: "10", offset: "0" } },
  });

  return (
    <Flex flexDirection="column">
      {users?.users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <Button>Users</Button>
    </Flex>
  );
};
