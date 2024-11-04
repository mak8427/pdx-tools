import { usePdxSession } from "@/server-lib/auth/session";
import { withCore } from "@/server-lib/middleware";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = withCore(async ({ request }: LoaderFunctionArgs) => {
  const session = await usePdxSession(request.headers.get("Cookie"));
  return json(session);
});
