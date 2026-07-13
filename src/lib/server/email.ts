import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/^['"]|['"]$/g, "");
  if (!user || !pass) return null;
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

export function gmailIsConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendOtpEmail(to: string, code: string) {
  const mailer = getTransporter();
  if (!mailer) throw new Error("Gmail SMTP is not configured");
  const from = process.env.EMAIL_FROM || `Asset Union <${process.env.GMAIL_USER}>`;
  await mailer.sendMail({
    from,
    to,
    subject: "Your Asset Union sign-in code",
    text: `Your Asset Union verification code is ${code}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px"><h2 style="margin:0 0 16px">Asset Union</h2><p>Use this verification code to sign in:</p><p style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${code}</p><p style="color:#667085">This code expires in 10 minutes. If you did not request it, ignore this email.</p></div>`,
  });
}
