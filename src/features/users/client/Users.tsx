import { Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useFetch } from "~/hooks/useFetch";
import { useLazyFetch } from "~/hooks/useLazyFetch";
import type { UsersAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";

const client = hc<UsersAPI>(clientUrl);

export const Users = () => {
  const limit = 10;
  const { mutate } = useSWRConfig();
  const { data: users } = useFetch({
    key: "getUsers",
    api: client.api.users.$get,
    args: { query: { limit: limit.toString(), offset: "0" } },
  });

  const [create] = useLazyFetch({
    key: "postUsers",
    api: client.api.users.$post,
    args: { json: { name: `test${Date()}` } },
  });

  return (
    <Flex flexDirection="column">
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <Button
        onClick={async () => {
          await create();
          await mutate("getUsers");
        }}
      >
        Users
      </Button>
    </Flex>
  );
};
