import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { MeAPI } from "~/server/routes";
import { clientUrl } from "../utils/clientUrl";
import { fetcher } from "../utils/fetcher";

export const client = hc<MeAPI>(clientUrl);

export const useMe = () => {
  const { data: me, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: fetcher(client.api.me.$get),
  });

  return { me, refetch };
};
