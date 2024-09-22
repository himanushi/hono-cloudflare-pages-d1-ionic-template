import { Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useState } from "react";
import { useFetch } from "~/hooks/useFetch";
import type { UsersAPI } from "~/index";

export const client = hc<UsersAPI>(location.origin);

export const Users = () => {
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const { data: users, mutate } = useFetch({
    key: "users",
    api: client.users.$get,
    args: { query: { limit: limit.toString(), offset: "0" } },
  });

  return (
    <Flex flexDirection="column">
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <Button
        onClick={() => {
          setOffset((prev) => prev + limit);
        }}
      >
        Users
      </Button>
    </Flex>
  );
};
