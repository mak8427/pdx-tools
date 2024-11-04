import { withAdmin } from "@/server-lib/auth/middleware";
import { dbPool, fromParsedSave, table } from "@/server-lib/db";
import { log } from "@/server-lib/logging";
import { withCore } from "@/server-lib/middleware";
import { ParsedFile } from "@/server-lib/save-parser";
import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@tanstack/start";
import { eq } from "drizzle-orm";

type ReprocessEntry = {
  saveId: string;
  save: Partial<ParsedFile>;
};

export const loader = withCore(
  withAdmin(async ({ request }: LoaderFunctionArgs) => {
    const saves: ReprocessEntry[] = await request.json();
    const db = dbPool().orm;
    for (const save of saves) {
      const update = fromParsedSave(save.save);
      log.info({ saveId: save.saveId, msg: "updating to", update });
      await db
        .update(table.saves)
        .set(update)
        .where(eq(table.saves.id, save.saveId));
    }

    return json(null, { status: 204 });
  })
);
