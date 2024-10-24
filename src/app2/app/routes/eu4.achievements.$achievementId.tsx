import { Alert } from "@/components/Alert";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WebPage } from "@/components/layout";
import { LoadingState } from "@/components/LoadingState";
import {
  AchievementLayout,
  AchievementPage,
} from "@/features/eu4/AchievementPage";
import { seo } from "@/lib/seo";
import { fetchAchievement, findAchievement } from "@/server-lib/fn/achievement";
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

export const findAchievementFn = createServerFn(
  "GET",
  (...args: Parameters<typeof findAchievement>) => {
    return findAchievement(...args);
  }
);

export const fetchAchievementFn = createServerFn(
  "GET",
  (...args: Parameters<typeof fetchAchievement>) => {
    return fetchAchievement(...args);
  }
);

export const Route = createFileRoute("/eu4/achievements/$achievementId")({
  loader: async ({ params }) => {
    const achievement = await findAchievementFn(params);
    return {
      achievement,
      savesPromise: defer(fetchAchievementFn(achievement)),
    };
  },
  meta: ({ loaderData }) =>
    seo({
      title: `${loaderData.achievement.name} Leaderboard`,
      description: `Top EU4 saves in a leaderboard for achievement ${loaderData.achievement.name}: ${loaderData.achievement.description}`,
    }),
  component: Eu4Achievement,
});

function Eu4Achievement() {
  const { achievement, savesPromise } = Route.useLoaderData();
  return (
    <WebPage>
      <AchievementLayout
        achievementId={`${achievement.id}`}
        description={achievement.description}
        title={achievement.name}
      >
        <ErrorBoundary
          fallback={({ error }) => (
            <div className="m-8">
              <Alert.Error
                className="px-4 py-2"
                msg={`Failed to fetch leaderboard: ${error}`}
              />
            </div>
          )}
        >
          <Await promise={savesPromise} fallback={<LoadingState />}>
            {(saves) => <AchievementPage achievement={saves} />}
          </Await>
        </ErrorBoundary>
      </AchievementLayout>
    </WebPage>
  );
}
