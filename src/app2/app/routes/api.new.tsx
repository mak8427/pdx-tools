import { getSaves } from "@/server-lib/fn/new";
import { withCore } from "@/server-lib/middleware";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@tanstack/start";
import { z } from "zod";

const NewSchema = z.object({
  pageSize: z
    .number()
    .nullish()
    .transform((x) => x ?? 50),
  cursor: z.string().nullish(),
});

export type NewestSaveResponse = Awaited<ReturnType<typeof getSaves>>;

export const loader = withCore(async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const params = NewSchema.parse(Object.fromEntries(searchParams.entries()));
  return json(await getSaves(params));
});
