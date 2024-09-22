import { Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useFetch } from "~/hooks/useFetch";
import type { MeAPI } from "~/serverRoutes";

export const client = hc<MeAPI>(location.origin);

export const Me = () => {
  const { data: me } = useFetch({
    key: "users",
    api: client.api.me.$get,
    args: { query: { name: "yamada" } },
  });

  return (
    <Flex flexDirection="column">
      <div>{me?.name}</div>
      <Button>Me</Button>
    </Flex>
  );
};