import type { EnvFile, KeyEntry, Repo } from "../types";

/** Helper to build a mock env file with the new required fields. */
function mockEnv(
  filename: string,
  path: string,
  keys: KeyEntry[],
): EnvFile {
  const rawContent = keys.map((k) => `${k.name}=${k.value}`).join("\n");
  return { filename, absolutePath: path, rawContent, keys, syncStatus: "synced" };
}

export const PROVIDERS = [
  "AWS",
  "Cloudflare",
  "DigitalOcean",
  "Hetzner",
  "Vercel",
  "Heroku",
  "Fly.io",
  "Railway",
  "Supabase",
  "PlanetScale",
  "Stripe",
  "SendGrid",
  "Datadog",
  "Sentry",
] as const;

export const MOCK_REPOS: Repo[] = [
  {
    name: "poppy",
    path: "/mock/poppy",
    envFiles: [
      mockEnv(".env", "/mock/poppy/.env", [
        { name: "DATABASE_URL", value: "postgres://poppy_user:x8kM2pL9@db.hetzner.cloud:5432/poppy_prod", provider: "Hetzner", addedAt: "2025-12-10", lastRotated: "2026-03-01" },
        { name: "REDIS_URL", value: "redis://default:aB3kx9Lm@redis.hetzner.cloud:6379", provider: "Hetzner", addedAt: "2025-12-10" },
      ]),
      mockEnv(".env.local", "/mock/poppy/.env.local", [
        { name: "OPENAPI_KEY", value: "sk-proj-a8xKm2pL9nR4vB7cD1eF3gH5iJ0kQ", addedAt: "2026-01-15", lastRotated: "2026-03-18" },
        { name: "CLOUDFLARE_API_TOKEN", value: "v1.0-8f3d91ab2c4e6a7b0d1f3e5c7a9b2d4f", provider: "Cloudflare", addedAt: "2026-01-15" },
        { name: "HARNESS_KEY", value: "pat.harn.kL9mN2pQ4rS6tU8vW0xK9z", addedAt: "2026-02-20" },
      ]),
    ],
  },
  {
    name: "earlyco",
    path: "/mock/earlyco",
    envFiles: [
      mockEnv(".env", "/mock/earlyco/.env", [
        { name: "DATABASE_URL", value: "postgres://earlyco:pR4kx9Lm2n@db-prod.supabase.co:5432/earlyco", provider: "Supabase", addedAt: "2025-11-05", lastRotated: "2026-02-28" },
        { name: "NEXT_PUBLIC_APP_URL", value: "https://earlyco.app", addedAt: "2025-11-05" },
        { name: "NEXT_PUBLIC_POSTHOG_KEY", value: "phc_a8Kx3mN5pQ7rS9tU1vW3xY5zA7bC9dE", addedAt: "2026-01-20" },
      ]),
      mockEnv(".env.local", "/mock/earlyco/.env.local", [
        { name: "STRIPE_SECRET_KEY", value: "sk_live_51HxK9mN2pQ4rS6tU8vW0xK9zA7bCyZq", provider: "Stripe", addedAt: "2025-11-05", lastRotated: "2026-03-10" },
        { name: "STRIPE_WEBHOOK_SECRET", value: "whsec_MjA3NTk4ZmQtYjRiNy00MDg5", provider: "Stripe", addedAt: "2025-11-05" },
        { name: "SENDGRID_API_KEY", value: "SG.xK9mN2pQ4rS6tU8v.W0xK9zA7bC9dE1fG3hI5jK7lM9nO1pQ3v", provider: "SendGrid", addedAt: "2026-01-08" },
        { name: "JWT_SECRET", value: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9Rk9", addedAt: "2025-11-05" },
      ]),
      mockEnv(".env.production", "/mock/earlyco/.env.production", [
        { name: "SENTRY_DSN", value: "https://abc123def456@o789012.ingest.sentry.io/1234567", provider: "Sentry", addedAt: "2026-02-01" },
        { name: "LOGFLARE_API_KEY", value: "lf_k9xmN2pQ4rS6tU8vW0xK2mP", addedAt: "2026-02-01" },
        { name: "DATADOG_API_KEY", value: "dd-api-k9xmN2pQ4rS6tU8vW0x7xR", provider: "Datadog", addedAt: "2026-02-15" },
        { name: "LAUNCHDARKLY_SDK_KEY", value: "sdk-a4f8kL9mN2pQ4rS6tU8vpQ9", addedAt: "2026-03-01" },
        { name: "SEGMENT_WRITE_KEY", value: "wk_9xJmN2pQ4rS6tU8vW0xK3nL", addedAt: "2026-03-01" },
      ]),
    ],
  },
  {
    name: "infractl",
    path: "/mock/infractl",
    envFiles: [
      mockEnv(".env", "/mock/infractl/.env", [
        { name: "AWS_ACCESS_KEY_ID", value: "AKIA4EXAMPLE7X7MQ", provider: "AWS", addedAt: "2025-10-20", lastRotated: "2026-03-15" },
        { name: "AWS_SECRET_ACCESS_KEY", value: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY4ceP", provider: "AWS", addedAt: "2025-10-20", lastRotated: "2026-03-15" },
        { name: "TERRAFORM_TOKEN", value: "tfe-at-k9xmN2pQ4rS6tU8vW0xK9xZp", addedAt: "2025-10-20" },
      ]),
    ],
  },
];

export const MOCK_PROVIDERS = [
  { name: "cloudflare", keyCount: 4 },
  { name: "digitalocean", keyCount: 3 },
  { name: "aws", keyCount: 8 },
];
