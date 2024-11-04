import { WebPage } from "@/components/layout/WebPage";
import { AchievementsPage } from "@/features/eu4/AchievementsPage";
import { loadAchievements } from "@/server-lib/game";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader = () => {
  const achievements = loadAchievements().map((achievement) => ({
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    difficulty: achievement.difficulty,
  }));
  return json({ achievements });
}

export default function Eu4Achievements() {
  const { achievements } = useLoaderData<typeof loader>();

  return (
    <WebPage>
      <AchievementsPage staticAchievements={achievements} />
    </WebPage>
  );
}
