import useSWR, { type SWRConfiguration } from "swr";
import type { ApiFunction } from "../types/ApiFunction";
import { fetcher } from "../utils/fetcher";

export const useFetch = <ARGS, RESPONSE>({
  key = "api",
  api,
  args,
  skip = false,
  ...options
}: {
  key?: string;
  api: ApiFunction<ARGS, RESPONSE>;
  args: ARGS;
  skip?: boolean;
} & SWRConfiguration) =>
  useSWR(
    skip ? undefined : key,
    fetcher(api)(args as NonNullable<ARGS>),
    options,
  );
