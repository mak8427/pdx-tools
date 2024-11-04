import { getUser } from "@/server-lib/db";
import { withCore } from "@/server-lib/middleware";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { z } from "zod";

const UserParams = z.object({ userId: z.string() });
export const loader = withCore(async ({ params }: LoaderFunctionArgs) => {
    const input = UserParams.parse(params);
    return json(await getUser(input.userId));
});
