import type { ClientRequestOptions } from "hono";
import type { ClientResponse } from "hono/client";
import { useCallback } from "react";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

export const useLazyFetch = <ARGS, RESPONSE>({
  name = "api",
  api,
  args,
}: {
  name?: string;
  api: (
    args: ARGS,
    options?: ClientRequestOptions,
  ) => Promise<ClientResponse<RESPONSE>>;
  args: ARGS;
}) => {
  const swrRes = useSWR<RESPONSE>(name);

  const load = useCallback(async () => {
    swrRes.mutate(fetcher(api)(args as NonNullable<ARGS>));
  }, [swrRes.mutate, api, args]);

  return [load, swrRes];
};
