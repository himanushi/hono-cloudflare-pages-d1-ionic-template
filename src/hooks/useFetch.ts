import type { ClientRequestOptions } from "hono";
import type { ClientResponse } from "hono/client";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

export const useFetch = <ARGS, RESPONSE>({
  name = "api",
  api,
  args,
  skip = false,
}: {
  name?: string;
  api: (
    args: ARGS,
    options?: ClientRequestOptions,
  ) => Promise<ClientResponse<RESPONSE>>;
  args: ARGS;
  skip?: boolean;
}) => {
  return useSWR(
    skip ? undefined : name,
    fetcher(api)(args as NonNullable<ARGS>),
  );
};
