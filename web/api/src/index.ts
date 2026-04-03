import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.all("*", async (c) => {
  const assets = (c.env as Env & { ASSETS: { fetch: typeof fetch } }).ASSETS;
  if (assets) {
    return assets.fetch(c.req.raw);
  }
  return c.text("Not found", 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default { fetch: app.fetch };
