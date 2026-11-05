import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { COOKIE_NAME } from "@shared/const";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  const hasSessionCookie = (opts.req.headers.cookie ?? '')
    .split(';')
    .some((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`));
  const hasBearerToken = typeof opts.req.headers.authorization === 'string'
    && opts.req.headers.authorization.startsWith('Bearer ');

  // Public routes must work without OAuth or a session cookie. Avoid calling
  // the authentication SDK when there are no credentials to validate.
  if (!hasSessionCookie && !hasBearerToken) {
    return { req: opts.req, res: opts.res, user: null };
  }

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
