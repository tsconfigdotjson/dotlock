import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import Stripe from "stripe";
import { getAdminDb } from "./utils/instant-admin";

export type AppVariables = {
  adminDb: ReturnType<typeof getAdminDb>;
  stripe?: Stripe;
};

export type AppBindings = {
  Bindings: Env;
  Variables: AppVariables;
};

export type AppContext = Context<AppBindings>;

export const requestContextMiddleware = createMiddleware<AppBindings>(
  (c, next) => {
    c.set("adminDb", getAdminDb(c.env));

    const stripeSecretKey = c.env.STRIPE_SECRET_KEY;
    if (stripeSecretKey) {
      c.set("stripe", new Stripe(stripeSecretKey));
    }

    return next();
  },
);

export function requireStripe(c: AppContext) {
  const stripe = c.get("stripe");
  if (!stripe) {
    throw new HTTPException(500, { message: "Stripe is not configured" });
  }
  return stripe;
}
