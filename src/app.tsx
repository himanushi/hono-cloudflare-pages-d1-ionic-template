import { Flex } from "@yamada-ui/react";
import { type FC, useState } from "react";
import useSWR from "swr";
import { client } from "./client";
import { useFetch } from "./hooks/useFetch";
import { useLazyFetch } from "./hooks/useLazyFetch";
import { fetcher } from "./utils/fetcher";

const App: FC = () => {
  return (
    <Flex flexDirection="column">
      <Button />
      <Button2 />
      <Button3 />
    </Flex>
  );
};

const Button = () => {
  const [skip, setSkip] = useState(true);
  const { data, error, isLoading } = useFetch({
    key: "api1",
    api: client.hello.$get,
    args: { query: { name: "world" } },
    skip,
    revalidateOnFocus: true,
  });

  if (data === undefined)
    return (
      <button type="button" onClick={() => setSkip(false)}>
        load1
      </button>
    );
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <h1>{data?.message}</h1>;
};

const Button2 = () => {
  const [get, { data, error, isLoading }] = useLazyFetch({
    key: "api2",
    api: client.hello.$get,
    args: { query: { name: "world" } },
  });

  if (data === undefined)
    return (
      <button type="button" onClick={() => get()}>
        load2
      </button>
    );
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <h1>{data?.message}</h1>;
};

const Button3 = () => {
  const { data, error, isLoading } = useSWR(
    "api3",
    fetcher(client.hello.$get)({ query: { name: "world" } }),
  );
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <h1>{data?.message}</h1>;
};

export default App;
