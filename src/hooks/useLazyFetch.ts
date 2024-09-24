import { useCallback } from "react";
import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import type { ApiFunction } from "../types/ApiFunction";
import { fetcher } from "../utils/fetcher";

export const useLazyFetch = <ARGS, RESPONSE>({
  key = "api",
  api,
  args,
  ...options
}: {
  key?: string;
  api: ApiFunction<ARGS, RESPONSE>;
  args: ARGS;
} & SWRConfiguration): [() => Promise<void>, SWRResponse<RESPONSE, any>] => {
  const response = useSWR<RESPONSE>(key, null, options);

  const trigger = useCallback(async () => {
    response.mutate(await fetcher(api)(args as NonNullable<ARGS>)());
  }, [response.mutate, api, args]);

  return [trigger, response];
};
