import { type AppContext, requireStripe } from "../context";
import { verifyAuthToken } from "../utils/auth";
import { getAdminDb } from "../utils/instant-admin";

export async function handleCheckout(c: AppContext) {
  const authResult = await verifyAuthToken(c);
  if (authResult.error) {
    return authResult.error;
  }

  const adminDb = getAdminDb(c.env);

  // Check if user already has a license
  const { licenses } = await adminDb.query({
    licenses: { $: { where: { userId: authResult.user.id } } },
  });

  if (licenses.length > 0) {
    return c.json({ error: "Already purchased" }, 400);
  }

  const stripe = requireStripe(c);
  const priceId = c.env.STRIPE_PRICE_ID;
  const host = c.env.HOST;

  if (!priceId) {
    return c.json({ error: "Price ID not configured" }, 500);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: host ? `${host}/dashboard` : undefined,
      cancel_url: host ? `${host}/dashboard` : undefined,
      metadata: {
        app_user_id: authResult.user.id,
      },
      payment_intent_data: {
        metadata: {
          app_user_id: authResult.user.id,
        },
      },
    });

    if (!session.url) {
      return c.json({ error: "Failed to create checkout session" }, 500);
    }

    return c.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return c.json(
      {
        error: "Failed to create checkout",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}
