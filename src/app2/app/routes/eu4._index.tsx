import { WebPage } from "@/components/layout/WebPage";
import { LoadingState } from "@/components/LoadingState";
import { Eu4GamePage } from "@/features/eu4/Eu4GamePage";
import { getSaves } from "@/server-lib/fn/new";
import { pdxKeys } from "@/services/appApi";
import { defer, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export const loader = async ({}: LoaderFunctionArgs) => {
  const queryClient = new QueryClient();
  const prefetch = queryClient
    .fetchInfiniteQuery({
      queryKey: pdxKeys.newSaves(),
      queryFn: () => getSaves({ pageSize: 10 }),
      retry: false,
      initialPageParam: undefined,
    })
    .then(() => dehydrate(queryClient));

  return defer({
    prefetch,
  });
};

export default function Eu4Route() {
  const { prefetch } = useLoaderData<typeof loader>();

  return (
    <WebPage>
      <Suspense fallback={<LoadingState />}>
        <Await resolve={prefetch}>
          {(dehydratedState: DehydratedState) => (
            <HydrationBoundary state={dehydratedState}>
              <Eu4GamePage />
            </HydrationBoundary>
          )}
        </Await>
      </Suspense>
    </WebPage>
  );
}
