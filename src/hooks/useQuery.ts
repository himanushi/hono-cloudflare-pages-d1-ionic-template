import type { ClientRequestOptions } from "hono";
import type { ClientResponse } from "hono/client";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

export const useQuery = <ARGS, RESPONSE>({
  api,
  args,
  skip = false,
}: {
  api: (
    args: ARGS,
    options?: ClientRequestOptions,
  ) => Promise<ClientResponse<RESPONSE>>;
  args: ARGS;
  skip?: boolean;
}) => {
  return useSWR(
    skip ? undefined : "api",
    fetcher(api)(args as NonNullable<ARGS>),
  );
};
