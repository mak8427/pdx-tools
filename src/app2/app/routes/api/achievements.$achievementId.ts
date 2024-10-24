import { fetchAchievement, findAchievement } from "@/server-lib/fn/achievement";
import { withCore } from "@/server-lib/middleware";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

export type AchievementApiResponse = Awaited<ReturnType<typeof getAchievement>>;
async function getAchievement({ achievementId }:  { achievementId: string }) {
  const achievement = findAchievement({achievementId});
  const saves = await fetchAchievement(achievement);
  return { achievement, saves: saves.saves };
}

export const Route = createAPIFileRoute("/api/achievements/$achievementId")({
  GET: withCore(async ({ request, params }) => {
    return json(await getAchievement(params));
  }),
});