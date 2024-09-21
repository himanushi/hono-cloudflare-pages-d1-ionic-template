import type { InferRequestType } from "hono";
import type { ClientRequestOptions, ClientResponse } from "hono/client";

export const fetcher =
  <ARG, RES>(
    api: (
      args: ARG,
      options?: ClientRequestOptions,
    ) => Promise<ClientResponse<RES>>,
  ) =>
  (arg: InferRequestType<typeof api>) =>
  async () => {
    const res = await api(arg);
    return await res.json();
  };
