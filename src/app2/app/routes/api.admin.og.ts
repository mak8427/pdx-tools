import { withAdmin } from "@/server-lib/auth/middleware";
import { withCore } from "@/server-lib/middleware";
import { generateOgIntoS3 } from "@/server-lib/og";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@tanstack/start";
import { z } from "zod";

const saveSchema = z.object({ saveId: z.string() });
export const loader = withCore(
  withAdmin(async ({ request }: LoaderFunctionArgs) => {
    const body = await request.json();
    const save = saveSchema.parse(body);
    generateOgIntoS3(save.saveId);
    return json({ msg: "done" });
  })
);
