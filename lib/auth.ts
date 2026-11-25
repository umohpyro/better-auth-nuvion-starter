import { betterAuth } from "better-auth";
import { visitorFetch, webhookSecret } from "./byo";
import { db } from "./db";
import { plugins } from "./plugins";

export const auth = betterAuth({
  database: db,
  emailAndPassword: { enabled: true },
  plugins: plugins(
    {
      // Without NUVION_API_KEY, each visitor brings their own (lib/byo.ts); this is only a placeholder.
      apiKey: process.env.NUVION_API_KEY || "per-visitor",
      webhookSecret: webhookSecret(),
    },
    visitorFetch,
  ),
});
