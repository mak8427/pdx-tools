import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import tailwind from "@/styles/tailwind.css?url";
import appCss from "@/styles/styles.css?url";
import { useState } from "react";
import {
  dehydrate,
  HydrationBoundary,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { usePdxSession } from "@/server-lib/auth/session";
import { SessionProvider } from "@/features/account";
import { Tooltip } from "@/components/Tooltip";
import { Toaster } from "@/components/Toaster";
import { PostHog } from "@/components/PostHog";
import { captureException } from "@/lib/captureException";
import { pdxKeys } from "./services/appApi";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: appCss },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: pdxKeys.profile(),
    queryFn: () => usePdxSession(request.headers.get("Cookie")),
  })

  return json({ dehydratedState: dehydrate(queryClient)  });
}

export default function App() {
  const { dehydratedState } = useLoaderData<typeof loader>();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
          },
        },
        queryCache: new QueryCache({
          onError(error, _query) {
            captureException(error);
          },
        }),
        mutationCache: new MutationCache({
          onError(error, _variables, _context, _mutation) {
            captureException(error);
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
      <SessionProvider>
        <Tooltip.Provider delayDuration={300}>
          <PostHog />
          <Toaster />
          <Outlet />
        </Tooltip.Provider>
      </SessionProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
