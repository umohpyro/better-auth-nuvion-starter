import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// The plugin's webhook receiver lives under this same handler: /api/auth/nuvion/webhook.
export const { GET, POST } = toNextJsHandler(auth);
