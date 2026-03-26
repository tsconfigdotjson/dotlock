import type Stripe from "stripe";
import { type AppContext, requireStripe } from "../context";
import { getAdminDb } from "../utils/instant-admin";
import { generateLicenseKey } from "../utils/license";
import { id } from "@instantdb/admin";

export async function handleStripeWebhook(c: AppContext) {
  const stripeWebhookSecret = c.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeWebhookSecret) {
    return c.json({ error: "Stripe webhook secret not configured" }, 500);
  }

  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return c.json({ error: "Missing signature" }, 401);
  }

  const body = await c.req.text();
  const stripe = requireStripe(c);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      stripeWebhookSecret,
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return c.json({ error: "Invalid signature" }, 401);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const appUserId = session.metadata?.app_user_id;

    if (!appUserId) {
      console.error("No app_user_id in session metadata");
      return c.json({ error: "Missing app_user_id" }, 400);
    }

    const adminDb = getAdminDb(c.env);

    // Idempotency: skip if license already exists
    const { licenses } = await adminDb.query({
      licenses: { $: { where: { userId: appUserId } } },
    });

    if (licenses.length > 0) {
      return c.json({ received: true });
    }

    // Generate license key
    const serial = Math.floor(Math.random() * 65535) + 1;
    const privateKeyPem = c.env.LICENSE_PRIVATE_KEY_PEM;
    const licenseKey = await generateLicenseKey(serial, privateKeyPem);

    // Store in InstantDB
    const licenseId = id();
    await adminDb.transact([
      adminDb.tx.licenses[licenseId].update({
        userId: appUserId,
        licenseKey,
        serial,
        createdAt: Date.now(),
      }),
      adminDb.tx.licenses[licenseId].link({ user: appUserId }),
    ]);
  }

  return c.json({ received: true });
}
