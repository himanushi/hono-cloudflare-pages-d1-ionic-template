import type { ClientRequestOptions, ClientResponse } from "hono/client";

export type ApiFunction<ARGS, RESPONSE> = (
  args: ARGS,
  options?: ClientRequestOptions,
) => Promise<ClientResponse<RESPONSE>>;
