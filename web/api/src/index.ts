import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { type AppBindings, requestContextMiddleware } from "./context";
import { handleCheckout } from "./routes/checkout";
import { handleStripeWebhook } from "./routes/stripe-webhook";

const app = new Hono<AppBindings>();

app.use("*", requestContextMiddleware);
app.use(
  "*",
  cors({ origin: ["https://dotlock.dev", "http://localhost:5173"] }),
);

app.get("/api/checkout", handleCheckout);
app.post("/api/webhooks/stripe", handleStripeWebhook);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default { fetch: app.fetch };
