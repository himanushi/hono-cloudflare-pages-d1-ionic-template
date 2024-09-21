import { type FC, useState } from "react";
import { client } from "./client";
import { useQuery } from "./hooks/useQuery";

const App: FC = () => {
  return <ClockButton />;
};

const ClockButton = () => {
  const [skip, setSkip] = useState(true);
  const { data, error, isLoading } = useQuery({
    api: client.hello.$get,
    args: { query: { name: "world" } },
    skip,
  });

  if (data === undefined)
    return (
      <button type="button" onClick={() => setSkip(false)}>
        load
      </button>
    );
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <h1>{data?.message}</h1>;
};

export default App;
