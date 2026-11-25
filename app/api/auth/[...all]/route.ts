import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { withVisitorKey } from "@/lib/byo";

// The plugin's webhook receiver lives under this same handler: /api/auth/nuvion/webhook.
// withVisitorKey only does something when visitors bring their own key (lib/byo.ts).
const handler = toNextJsHandler(auth);
export const GET = (req: Request) =>
  withVisitorKey(req, () => handler.GET(req));
export const POST = (req: Request) =>
  withVisitorKey(req, () => handler.POST(req));
