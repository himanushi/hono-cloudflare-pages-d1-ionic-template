import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { MeAPI } from "~/serverRoutes";
import { clientUrl } from "~/utils/clientUrl";
import { fetcher } from "~/utils/fetcher";

export const client = hc<MeAPI>(clientUrl);

export const useMe = () => {
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: fetcher(client.api.me.$get),
    refetchOnReconnect: true,
  });

  return { me };
};
