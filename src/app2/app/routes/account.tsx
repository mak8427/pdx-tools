import { WebPage } from '@/components/layout/WebPage'
import { LoggedIn } from '@/components/LoggedIn'
import { Account } from '@/features/account'
import { usePdxSession } from '@/server-lib/auth/session'
import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/cloudflare'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await usePdxSession(request.headers.get("Cookie"));
  if (session.kind !== "user") {
    throw new Error("Not logged in");
  }
  return json({session});
}

export default function AccountRoute() {
  const {session} = useLoaderData<typeof loader>();
  return (
    <WebPage>
    <LoggedIn session={session}>
      <Account />
    </LoggedIn>
  </WebPage>
  )
}