import "server-only";
import { env } from "@/lib/env";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") console.info(`[email preview] ${to} ${subject} ${html}`);
    return { preview: true };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, html }),
  });
  if (!response.ok) throw new Error("Email delivery failed.");
  return { preview: false };
}
