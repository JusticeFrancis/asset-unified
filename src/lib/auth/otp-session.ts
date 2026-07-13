const OTP_SESSION_ID_KEY = "au_otp_session_id";
const OTP_EMAIL_KEY = "au_otp_email";
const OTP_MASKED_EMAIL_KEY = "au_otp_masked_email";
const OTP_EXPIRES_AT_KEY = "au_otp_expires_at";

export type OtpSession = {
  otpSessionId: string;
  email: string;
  maskedEmail: string;
  expiresAt: number;
};

export function saveOtpSession(session: OtpSession) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(OTP_SESSION_ID_KEY, session.otpSessionId);
  sessionStorage.setItem(OTP_EMAIL_KEY, session.email);
  sessionStorage.setItem(OTP_MASKED_EMAIL_KEY, session.maskedEmail);
  sessionStorage.setItem(OTP_EXPIRES_AT_KEY, String(session.expiresAt));
}

export function getOtpSession(): OtpSession | null {
  if (typeof sessionStorage === "undefined") return null;

  const otpSessionId = sessionStorage.getItem(OTP_SESSION_ID_KEY);
  const email = sessionStorage.getItem(OTP_EMAIL_KEY);
  const maskedEmail = sessionStorage.getItem(OTP_MASKED_EMAIL_KEY);
  const expiresAtRaw = sessionStorage.getItem(OTP_EXPIRES_AT_KEY);

  if (!otpSessionId || !email || !maskedEmail || !expiresAtRaw) {
    return null;
  }

  return {
    otpSessionId,
    email,
    maskedEmail,
    expiresAt: Number(expiresAtRaw),
  };
}

export function clearOtpSession() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(OTP_SESSION_ID_KEY);
  sessionStorage.removeItem(OTP_EMAIL_KEY);
  sessionStorage.removeItem(OTP_MASKED_EMAIL_KEY);
  sessionStorage.removeItem(OTP_EXPIRES_AT_KEY);
}
