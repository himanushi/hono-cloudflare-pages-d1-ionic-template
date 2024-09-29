import type { InferRequestType } from "hono";
import type { ClientRequestOptions, ClientResponse } from "hono/client";

export const fetcher =
  <ARGS, RESPONSE>(
    api: (
      args: ARGS,
      options?: ClientRequestOptions,
    ) => Promise<ClientResponse<RESPONSE>>,
    arg: InferRequestType<typeof api>,
  ) =>
  async () => {
    const res = await api(arg);
    return (await res.json()) as RESPONSE;
  };
