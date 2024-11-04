import { getAppSession, destroyAppSession } from "@/server-lib/auth/session";
import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";

export async function action({ request }: ActionFunctionArgs) {
    let session = await getAppSession(request.headers.get("Cookie"));
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroyAppSession(session),
      },
    });
}