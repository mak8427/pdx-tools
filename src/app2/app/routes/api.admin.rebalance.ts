import { withAdmin } from "@/server-lib/auth/middleware";
import { dbPool, table } from "@/server-lib/db";
import { latestEu4MinorPatch } from "@/server-lib/game";
import { withCore } from "@/server-lib/middleware";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@tanstack/start";
import { sql } from "drizzle-orm";

export const loader = withCore(
  withAdmin(async ({ request }: LoaderFunctionArgs) => {
    const db = dbPool().orm;
    const patch =
      new URL(request.url).searchParams.get("__patch_override_for_testing") ??
      latestEu4MinorPatch();

    await db
      .update(table.saves)
      .set({
        scoreDays: sql`days * (10 + (${+patch} - LEAST(save_version_second, ${+patch}))) / 10`,
      })
      .where(sql`cardinality(${table.saves.achieveIds}) != 0`);

    return json({ msg: "done" });
  })
);
