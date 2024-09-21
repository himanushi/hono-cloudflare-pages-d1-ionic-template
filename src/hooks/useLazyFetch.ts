import type { ClientRequestOptions } from "hono";
import type { ClientResponse } from "hono/client";
import { useCallback } from "react";
import useSWR, { type SWRResponse } from "swr";
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
}): [() => void, SWRResponse<RESPONSE, any>] => {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<RESPONSE>(name);

  const load = useCallback(async () => {
    mutate(fetcher(api)(args as NonNullable<ARGS>));
  }, [mutate, api, args]);

  return [load, { data, error, isLoading, isValidating, mutate }];
};
