import { Button } from "@yamada-ui/react";
import { hc } from "hono/client";
import { type FC, useState } from "react";
import type { AppType } from ".";

const App: FC = () => {
  return <ClockButton />;
};

const ClockButton = () => {
  const [response, setResponse] = useState<string | null>(null);
  const client = hc<AppType>(location.origin);

  const handleClick = async () => {
    const res = await client.hello.$get({
      query: {
        name: "world",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      console.log(data.message);
    }
  };

  return (
    <div>
      <Button type="button" onClick={handleClick}>
        Get Server Time
      </Button>
      {response && <pre>{response}</pre>}
    </div>
  );
};

export default App;
