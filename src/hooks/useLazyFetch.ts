import { useCallback } from "react";
import type { SWRConfiguration, SWRResponse } from "swr";
import type { ApiFunction } from "../types/ApiFunction";
import { fetcher } from "../utils/fetcher";
import { useFetch } from "./useFetch";

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
  const response = useFetch<ARGS, RESPONSE>({
    key,
    api: null,
    args,
    ...options,
  });

  const trigger = useCallback(async () => {
    response.mutate(await fetcher(api)(args as NonNullable<ARGS>)());
  }, [response.mutate, api, args]);

  return [trigger, response];
};
