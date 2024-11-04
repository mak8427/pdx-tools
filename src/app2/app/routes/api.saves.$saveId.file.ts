import { s3FetchOk, s3Keys } from "@/server-lib/s3";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { z } from "zod";

const saveSchema = z.object({ saveId: z.string() });
export async function loader({ params }: LoaderFunctionArgs) {
  const save = saveSchema.parse(params);
  return s3FetchOk(s3Keys.save(save.saveId));
}
