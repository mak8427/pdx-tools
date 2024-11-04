import { check } from "@/lib/isPresent";
import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { z } from "zod";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "sid",
      secrets: [check(import.meta.env.VITE_SESSION_SECRET)],
      sameSite: "strict",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    },
  });

export {
  getSession as getAppSession,
  commitSession as commitAppSession,
  destroySession as destroyAppSession,
};

export function newSession() {
  return getSession();
}

export type PdxSession = Awaited<ReturnType<typeof usePdxSession>>;
export type PdxUserSession = Extract<PdxSession, { kind: "user" }>;
export async function usePdxSession(cookie: string | null) {
  const session = await getSession(cookie);
  const parsed = SessionPayloadSchema.safeParse(session.data);
  if (parsed.success) {
    return {
      kind: "user",
      ...parsed.data,
    } as const
  } else {
    return { kind: "guest" } as const;
  }
}

const SessionPayloadSchema = z.object({
  userId: z.string(),
  steamId: z.string(),
  account: z.enum(["free", "admin"]),
}).strict();

export type SessionPayload = z.infer<typeof SessionPayloadSchema>;
