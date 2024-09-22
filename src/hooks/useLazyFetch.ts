import { useCallback } from "react";
import useSWR, { type SWRResponse } from "swr";
import type { ApiFunction } from "../types/ApiFunction";
import { fetcher } from "../utils/fetcher";

export const useLazyFetch = <ARGS, RESPONSE>({
  key = "api",
  api,
  args,
}: {
  key?: string;
  api: ApiFunction<ARGS, RESPONSE>;
  args: ARGS;
}): [() => void, SWRResponse<RESPONSE, any>] => {
  const response = useSWR<RESPONSE>([key, args]);

  const trigger = useCallback(() => {
    response.mutate(fetcher(api)(args as NonNullable<ARGS>));
  }, [response.mutate, api, args]);

  return [trigger, response];
};
