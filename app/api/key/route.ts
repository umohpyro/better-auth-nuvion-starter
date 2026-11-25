import { byo, checkKey, COOKIE, cookieOf, open, seal } from "@/lib/byo";

// The visitor's own Nuvion key, kept in a sealed cookie in their browser (see lib/byo.ts). It is never sent back to the page.
const sameOrigin = (req: Request) =>
  req.headers.get("origin") === new URL(req.url).origin;
const setCookie = (req: Request, value: string, maxAge: number) =>
  `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${req.url.startsWith("https:") ? "; Secure" : ""}`;

export async function GET(req: Request) {
  const token = cookieOf(req);
  return Response.json({
    byo,
    connected: byo && !!token && (await open(token)) !== null,
  });
}

export async function POST(req: Request) {
  if (!byo || !sameOrigin(req))
    return Response.json({ error: "Not allowed." }, { status: 403 });
  const body = (await req.json().catch(() => null)) as {
    apiKey?: unknown;
  } | null;
  const key = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
  const problem = await checkKey(key);
  if (problem) return Response.json({ error: problem }, { status: 400 });
  return Response.json(
    { connected: true },
    // Eight hours, as long as a demo session needs.
    { headers: { "Set-Cookie": setCookie(req, await seal(key), 8 * 3600) } },
  );
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req))
    return Response.json({ error: "Not allowed." }, { status: 403 });
  return Response.json(
    { connected: false },
    { headers: { "Set-Cookie": setCookie(req, "", 0) } },
  );
}
