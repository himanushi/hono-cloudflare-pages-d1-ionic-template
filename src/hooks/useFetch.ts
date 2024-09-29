import { useQuery } from "@tanstack/react-query";
import useSWR, { type SWRConfiguration } from "swr";
import type { ApiFunction } from "~/types/ApiFunction";
import { fetcher } from "~/utils/fetcher";

export const useFetch = <ARGS, RESPONSE>({
  key = "api",
  api,
  args,
  skip = false,
}: {
  key?: string;
  api: ApiFunction<ARGS, RESPONSE> | null;
  args: ARGS;
  skip?: boolean;
}) =>
  useQuery({
    queryKey: [key],
    queryFn: () => {
      if (!skip && api) {
        return fetcher(api)(args as NonNullable<ARGS>)();
      }
    },
  });

// export const useFetch = <ARGS, RESPONSE>({
//   key = "api",
//   api,
//   args,
//   skip = false,
//   ...options
// }: {
//   key?: string;
//   api: ApiFunction<ARGS, RESPONSE> | null;
//   args: ARGS;
//   skip?: boolean;
// } & SWRConfiguration) =>
//   useSWR(
//     skip ? undefined : [key, args],
//     api ? fetcher(api)(args as NonNullable<ARGS>) : null,
//     options,
//   );
