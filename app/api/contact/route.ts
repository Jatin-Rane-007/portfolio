import { Resend } from "resend";
import { personal } from "@/data/portfolio";

/**
 * Contact endpoint for the hero form. The send is one HTTPS call, so there is
 * no outbound socket to plan a runtime around.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generous for a person, tight enough that a bot cannot use the form as a
 // mail-to-anyone relay through the site's own email credentials.
const LIMITS = { name: 120, email: 160, subject: 160, message: 6000 } as const;

type Fields = { name: string; email: string; subject: string; message: string; company: string };

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status });
}

/*
 * Best-effort throttle. Serverless instances are short-lived and share no
 * memory, so this only damps a single warm instance — it is not the spam
 * defence, just a cheap speed bump behind the honeypot.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (attempts.size > 500) attempts.clear();
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

/** Mirrors the client checks: the browser is not the trust boundary, this is. */
function readFields(raw: unknown): { ok: true; fields: Fields } | { ok: false; error: string } {
  const src = (raw ?? {}) as Record<string, unknown>;
  const pick = (key: keyof typeof LIMITS) =>
    typeof src[key] === "string" ? src[key].trim() : "";

  const name = pick("name");
  const email = pick("email");
  const subject = pick("subject");
  const message = pick("message");

  if (!name) return { ok: false, error: "Name is required." };
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "A valid email is required." };
  if (!message || message.length < 12) return { ok: false, error: "Message is too short." };

  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return { ok: false, error: "One of those fields is too long." };
  }

  return {
    ok: true,
    fields: {
      name,
      email,
      subject,
      message,
      company: typeof src.company === "string" ? src.company.trim() : "",
    },
  };
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Expected JSON." }, 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Malformed body." }, 400);
  }

  const parsed = readFields(body);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, 422);
  const { fields } = parsed;

  // A filled honeypot is a bot: answer as if it worked, send nothing.
  if (fields.company) return json({ ok: true }, 200);

  if (throttled(clientIp(request))) {
    return json({ ok: false, error: "Too many messages from here. Try again shortly." }, 429);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Deliberately not a hard failure: the client falls back to a mailto
    // composer, so the site still converts before credentials are wired up.
    console.warn("[contact] RESEND_API_KEY missing — message not sent");
    return json({ ok: false, error: "not_configured", configured: false }, 503);
  }

  // Resend's shared test sender only delivers to the address registered on the
  // account, which is exactly right for a contact form: the enquiry lands in
  // Jatin's inbox and the visitor stays reachable through Reply-To. Point
  // CONTACT_FROM at a sender on a verified domain once one exists.
  const to = process.env.CONTACT_TO || personal.email;
  const from = process.env.CONTACT_FROM || "Portfolio Contact <onboarding@resend.dev>";

  const subject = `[Portfolio] ${fields.subject || "Project inquiry"}`;
  const text = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    fields.subject ? `Subject: ${fields.subject}` : null,
    "",
    fields.message,
  ]
    .filter(line => line !== null)
    .join("\n");

  // Resend answers a rejected send with a returned error rather than throwing,
  // so both shapes collapse into one failure before anything is reported.
  let failure: { code?: string; message?: string } | null = null;
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      subject,
      text,
      replyTo: fields.email,
    });
    if (error) failure = { code: error.name, message: error.message };
  } catch (thrown) {
    const err = thrown as { name?: string; message?: string };
    failure = { code: err?.name, message: err?.message };
  }

  if (!failure) return json({ ok: true }, 200);

  console.error("[contact] send failed:", failure.code, failure.message);
  // The server log is the primary source, but a one-line switch makes the
  // reason visible from the browser's Network tab: set CONTACT_DEBUG to any
  // value in Vercel env vars, redeploy, submit again, read `hint`, unset it.
  // The message names the account, so it stays off by default.
  const hint = process.env.CONTACT_DEBUG
    ? `${failure.code ?? ""} ${failure.message ?? "unknown send error"}`.trim().slice(0, 300)
    : undefined;
  return json({ ok: false, error: "The message could not be sent.", hint }, 502);
}
