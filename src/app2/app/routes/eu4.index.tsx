import { WebPage } from "@/components/layout/WebPage";
import { Eu4GamePage } from "@/features/eu4/Eu4GamePage";
import { createFileRoute } from "@tanstack/react-router";
import { pdxKeys } from "@/services/appApi";
import { fetchSaves } from "@/server-lib/fn/new";

export const Route = createFileRoute("/eu4/")({
  component: Eu4Route,
  loader({context}) {
    context.queryClient.prefetchInfiniteQuery({
      queryKey: pdxKeys.newSaves(),
      queryFn: () => fetchSaves({}),
      initialPageParam: undefined,
    })
  },
});

function Eu4Route() {
  return (
    <WebPage>
      <Eu4GamePage />
    </WebPage>
  );
}
