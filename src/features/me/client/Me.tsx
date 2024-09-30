import { useQuery } from "@tanstack/react-query";
import { Button, Flex } from "@yamada-ui/react";
import { hc } from "hono/client";
import type { MeAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";
import { fetcher } from "~/utils/fetcher";

export const client = hc<MeAPI>(clientUrl);

export const Me = () => {
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: fetcher(client.api.me.$get, { query: { name: "yamada" } }),
  });

  return (
    <Flex flexDirection="column">
      <div>{me?.name}</div>
      <Button
        onClick={() => {
          window.open("/auth/login", "_blank");
        }}
      >
        google login
      </Button>
    </Flex>
  );
};
