import type { SWRConfiguration } from "swr";
import useSWRInfinite, { type SWRInfiniteKeyLoader } from "swr/infinite";
import type { ApiFunction } from "~/types/ApiFunction";
import { fetcher } from "~/utils/fetcher";

export const useInfiniteFetch = <ARGS, RESPONSE>({
  getKey,
  api,
  args,
  focusThrottleInterval = 0,
  errorRetryCount = 0,
  ...options
}: {
  getKey: SWRInfiniteKeyLoader;
  api: ApiFunction<ARGS, RESPONSE> | null;
  args: ARGS;
} & SWRConfiguration) =>
  useSWRInfinite(getKey, api ? fetcher(api)(args as NonNullable<ARGS>) : null, {
    ...options,
    focusThrottleInterval,
    errorRetryCount,
  });
