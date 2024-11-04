import { fetchAchievement, findAchievement } from "@/server-lib/fn/achievement";
import { withCore } from "@/server-lib/middleware";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@tanstack/start";
import { z } from "zod";

export type AchievementApiResponse = Awaited<ReturnType<typeof getAchievement>>;
async function getAchievement({ achievementId }: { achievementId: string }) {
  const achievement = findAchievement({achievementId});
  const saves = await fetchAchievement(achievement);
  return { achievement, saves: saves.saves };
}

const paramsSchema = z.object({ achievementId: z.string() });
export const loader = withCore(async ({params}: LoaderFunctionArgs) => {
  return json(await getAchievement(paramsSchema.parse(params)));
});
