import { Button } from "@yamada-ui/react";
import { type FC, useState } from "react";

const App: FC = () => {
  return <ClockButton />;
};

const ClockButton = () => {
  const [response, setResponse] = useState<string | null>(null);

  const handleClick = async () => {
    const response = await fetch("/api/clock");
    const data = await response.json();
    const headers = Array.from((response.headers as any).entries()).reduce(
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      (acc: any, [key, value]: any) => ({ ...acc, [key]: value }),
      {},
    );
    const fullResponse = {
      url: response.url,
      status: response.status,
      headers,
      body: data,
    };
    setResponse(JSON.stringify(fullResponse, null, 2));
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
