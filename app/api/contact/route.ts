import { createTransport } from "nodemailer";
import { personal } from "@/data/portfolio";

/**
 * Contact endpoint for the hero form. nodemailer opens a TCP socket, so this
 * needs the Node runtime — the Edge runtime has no net module to speak SMTP.
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generous for a person, tight enough that a bot cannot use the form as a
 // mail-to-anyone relay through the site's own SMTP credentials.
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

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // Deliberately not a hard failure: the client falls back to a mailto
    // composer, so the site still converts before credentials are wired up.
    console.warn("[contact] SMTP not configured — message not sent");
    return json({ ok: false, error: "not_configured", configured: false }, 503);
  }

  const to = process.env.CONTACT_TO || personal.email;
  const port = Number(SMTP_PORT) || 465; // 465 = implicit TLS; 587 would be STARTTLS
  // Gmail and most providers reject a From that is not the authenticated
  // account, so the sender stays fixed and the visitor arrives via Reply-To.
  const from = process.env.CONTACT_FROM || SMTP_USER;

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

  try {
    const transport = createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transport.sendMail({
      from,
      to,
      replyTo: fields.email,
      subject,
      text,
      headers: { "X-Contact-Origin": "portfolio-contact-form" },
    });
    transport.close();
  } catch (error) {
    console.error("[contact] send failed:", error);
    return json({ ok: false, error: "The message could not be sent." }, 502);
  }

  return json({ ok: true }, 200);
}
