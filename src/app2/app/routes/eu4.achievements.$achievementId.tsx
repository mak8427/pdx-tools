import { WebPage } from "@/components/layout";
import { LoadingState } from "@/components/LoadingState";
import {
  AchievementLayout,
  AchievementPage,
} from "@/features/eu4/AchievementPage";
import { fetchAchievement, findAchievement } from "@/server-lib/fn/achievement";
import { ErrorBoundary } from "@sentry/react";
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { Suspense } from "react";

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
        <Suspense fallback={<LoadingState />}>
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
            <Await promise={savesPromise}>
              {(saves) => <AchievementPage achievement={saves} />}
            </Await>
          </ErrorBoundary>
        </Suspense>
      </AchievementLayout>
    </WebPage>
  );
}
