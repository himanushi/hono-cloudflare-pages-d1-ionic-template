import type { BareFetcher } from "swr";
import useSWRInfinite, {
  type SWRInfiniteConfiguration,
  type SWRInfiniteKeyLoader,
} from "swr/infinite";

export const useInfiniteFetch = <RESPONSE>({
  getKey,
  fetcher,
  ...options
}: {
  getKey: SWRInfiniteKeyLoader;
  fetcher: BareFetcher<RESPONSE>;
} & SWRInfiniteConfiguration) => {
  const response = useSWRInfinite(getKey, fetcher, {
    persistSize: false,
    revalidateFirstPage: true,
    // revalidateAll: true,
    ...options,
  });
  const data = response.data ?? [[]];
  const hasNext = !(
    data[data.length - 1] && data[data.length - 1].length === 0
  );
  const items = data.flat() as RESPONSE;

  return {
    ...response,
    hasNext,
    items,
  };
};
