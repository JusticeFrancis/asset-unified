"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  SignInBackground,
  SignInOtpFaviconBg,
  SignInSocialFaviconBg,
  SignInWeb3FaviconBg,
} from "@/lib/assets";
import {
  SignInAppleIcon,
  SignInGoogleIcon,
  SignInMetamaskIcon,
  SignInWalletConnectIcon,
} from "@/components/icons";
import { ArrowLeftIcon } from "lucide-react";

import { useAuth } from "@/contexts/auth-provider";
import { getPostAuthRedirectPath } from "@/lib/auth/callback-url";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import {
  clearOtpSession,
  getOtpSession,
  saveOtpSession,
} from "@/lib/auth/otp-session";

type MethodMode = "social" | "web3";
type ViewState = "entry" | "otp";

const otpLength = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const boxButtonClass =
  "h-10 w-full rounded-xl border border-border bg-background px-4 text-xs text-muted transition hover:border-brand/30";

function SignInPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const referralCode = searchParams.get("ref");
  const { sendOtp, verifyOtp, profileComplete, user, isLoading } = useAuth();

  const [methodMode, setMethodMode] = useState<MethodMode>("social");
  const [viewState, setViewState] = useState<ViewState>("entry");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: otpLength }, () => ""),
  );
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const openConfiguredAuthProvider = (provider: "google" | "apple" | "metamask" | "walletconnect") => {
    const urls = {
      google: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL,
      apple: process.env.NEXT_PUBLIC_APPLE_AUTH_URL,
      metamask: process.env.NEXT_PUBLIC_METAMASK_AUTH_URL,
      walletconnect: process.env.NEXT_PUBLIC_WALLETCONNECT_AUTH_URL,
    } as const;
    const url = urls[provider];
    if (!url) {
      setFormError(`${provider === "walletconnect" ? "WalletConnect" : provider[0].toUpperCase() + provider.slice(1)} sign-in is not configured.`);
      return;
    }
    window.location.assign(url);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    router.replace(getPostAuthRedirectPath(profileComplete, callbackUrl));
  }, [callbackUrl, isLoading, profileComplete, router, user]);

  useEffect(() => {
    const storedSession = getOtpSession();
    if (!storedSession) return;

    setEmail(storedSession.email);
    setMaskedEmail(storedSession.maskedEmail);
    setOtpSessionId(storedSession.otpSessionId);
    setViewState("otp");

    const remainingSeconds = Math.max(
      storedSession.expiresAt - Math.floor(Date.now() / 1000),
      0,
    );
    setSecondsLeft(Math.min(remainingSeconds, RESEND_COOLDOWN_SECONDS));
  }, []);

  useEffect(() => {
    if (viewState !== "otp") return;
    const id = requestAnimationFrame(() => otpInputRefs.current[0]?.focus());
    return () => cancelAnimationFrame(id);
  }, [viewState]);

  useEffect(() => {
    if (viewState !== "otp" || secondsLeft <= 0) return;

    const timer = window.setTimeout(() => {
      setSecondsLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft, viewState]);

  const faviconBackground = useMemo(() => {
    if (viewState === "otp") return SignInOtpFaviconBg;
    return methodMode === "social"
      ? SignInSocialFaviconBg
      : SignInWeb3FaviconBg;
  }, [methodMode, viewState]);

  const startOtpFlow = async (targetEmail: string) => {
    setFormError(null);
    setIsSendingOtp(true);

    try {
      const response = await sendOtp(targetEmail.trim());
      saveOtpSession({
        otpSessionId: response.otpSessionId,
        email: targetEmail.trim(),
        maskedEmail: response.maskedEmail,
        expiresAt: response.expiresAt,
      });

      setEmail(targetEmail.trim());
      setMaskedEmail(response.maskedEmail);
      setOtpSessionId(response.otpSessionId);
      setViewState("otp");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setOtp(Array.from({ length: otpLength }, () => ""));
    } catch (error) {
      setFormError(
        getAuthErrorMessage(error, "Unable to send a code right now."),
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onContinueWithEmail = async (event: FormEvent) => {
    event.preventDefault();
    await startOtpFlow(email);
  };

  const onResendCode = async () => {
    if (!email || secondsLeft > 0) return;
    await startOtpFlow(email);
  };

  const onVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== otpLength || !otpSessionId) return;

    setFormError(null);
    setIsVerifyingOtp(true);

    try {
      await verifyOtp(otpSessionId, code, callbackUrl, referralCode);
      clearOtpSession();
    } catch (error) {
      setFormError(getAuthErrorMessage(error, "Unable to verify that code."));
      setOtp(Array.from({ length: otpLength }, () => ""));
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const onOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otpLength);
    const next = Array.from(
      { length: otpLength },
      (_, index) => value[index] ?? "",
    );
    setOtp(next);
    const lastFilled = Math.min(value.length, otpLength) - 1;
    if (lastFilled >= 0) {
      otpInputRefs.current[lastFilled]?.focus();
    }
  };

  const onOtpKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key !== "Backspace") return;
    if (otp[index]) return;
    if (index === 0) return;
    event.preventDefault();
    const next = [...otp];
    next[index - 1] = "";
    setOtp(next);
    otpInputRefs.current[index - 1]?.focus();
  };

  const onUseAnotherEmail = () => {
    clearOtpSession();
    setViewState("entry");
    setOtpSessionId(null);
    setMaskedEmail("");
    setOtp(Array.from({ length: otpLength }, () => ""));
    setFormError(null);
  };

  const onPasteCode = async () => {
    try {
      const value = await navigator.clipboard.readText();
      const digits = value.replace(/\D/g, "").slice(0, otpLength);
      if (!digits) return;

      const next = Array.from(
        { length: otpLength },
        (_, index) => digits[index] ?? "",
      );
      setOtp(next);
      const lastFilled = Math.min(digits.length, otpLength) - 1;
      if (lastFilled >= 0) {
        otpInputRefs.current[lastFilled]?.focus();
      }
    } catch {
      setFormError("Unable to read from clipboard.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading…</p>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-background bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${SignInBackground})` }}
    >
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-6 sm:py-10">
        <section className="relative flex w-full max-w-[670px] flex-col rounded-[20px] bg-surface px-4 pb-8 pt-16 shadow-[0_15px_45px_rgba(5,10,14,0.08)] sm:px-8 sm:pb-10 sm:pt-12 md:px-12">
          <Link
            href="/"
            className="absolute left-4 top-4 inline-flex min-h-tap items-center gap-2 text-sm font-medium text-brand transition-colors hover:underline sm:left-6 sm:top-6 sm:text-[15px] md:left-8 md:top-8"
          >
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline">Back to home page</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="relative mx-auto mb-6 size-14 shrink-0 sm:size-16 md:size-[72px]">
            <svg
              className="block h-full w-full"
              viewBox="0 0 105 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect
                width="104.809"
                height="97.9757"
                fill="url(#signInEmblemPattern)"
              />
              <defs>
                <pattern
                  id="signInEmblemPattern"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#signInEmblemImage"
                    href="#signInEmblemImage"
                    transform="matrix(0.00245793 0 0 0.00262935 -0.767197 -0.647223)"
                  />
                </pattern>
                <image
                  id="signInEmblemImage"
                  width="1024"
                  height="1024"
                  preserveAspectRatio="none"
                  href={faviconBackground}
                  xlinkHref={faviconBackground}
                />
              </defs>
            </svg>
          </div>

          {viewState === "otp" ? (
            <div className="flex flex-col items-center gap-6">
              <h1 className="text-center text-h2 font-medium leading-tight text-foreground">
                We&apos;ve sent you a code
              </h1>
              <p className="text-center text-base leading-7 text-[#919191] sm:text-body-lg">
                Please enter the code sent to
                <br />
                <span className="text-foreground">{maskedEmail || email}</span>
              </p>

              <div className="flex w-full max-w-[360px] items-center justify-between gap-2 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={`otp-${index}`}
                    ref={(element) => {
                      otpInputRefs.current[index] = element;
                    }}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onPaste={onOtpPaste}
                    onKeyDown={(event) => onOtpKeyDown(event, index)}
                    onChange={(event) => {
                      const raw = event.target.value.replace(/\D/g, "");
                      const next = [...otp];
                      if (raw.length === 0) {
                        next[index] = "";
                        setOtp(next);
                        return;
                      }
                      const char = raw.slice(-1);
                      next[index] = char;
                      setOtp(next);
                      if (index < otpLength - 1) {
                        otpInputRefs.current[index + 1]?.focus();
                      }
                    }}
                    className="h-12 w-full min-w-0 max-w-[52px] flex-1 rounded-xl border border-border bg-background text-center text-base text-foreground outline-none transition focus:border-brand sm:h-[52px] sm:max-w-[44px] sm:text-lg"
                  />
                ))}
              </div>

              <button
                type="button"
                className="text-sm text-brand"
                onClick={onPasteCode}
              >
                Paste Code
              </button>

              {formError ? (
                <p className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </p>
              ) : null}

              <div className="flex w-full flex-col items-center gap-2">
                <button
                  type="button"
                  disabled={
                    otp.join("").length !== otpLength ||
                    isVerifyingOtp ||
                    !otpSessionId
                  }
                  className="min-h-tap w-full rounded-xl bg-brand px-8 text-sm font-medium text-background transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-4 sm:text-base"
                  onClick={onVerifyOtp}
                >
                  {isVerifyingOtp ? "Verifying…" : "Confirm"}
                </button>
                {secondsLeft > 0 ? (
                  <p className="text-center text-sm text-[#919191]">
                    Resend code in 0:
                    {secondsLeft.toString().padStart(2, "0")} secs
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={isSendingOtp}
                    className="text-sm text-brand underline disabled:opacity-50"
                    onClick={onResendCode}
                  >
                    {isSendingOtp ? "Sending…" : "Resend code"}
                  </button>
                )}
              </div>
              <button
                type="button"
                className="text-sm text-foreground sm:text-[15px]"
                onClick={onUseAnotherEmail}
              >
                Use another email
              </button>
            </div>
          ) : (
            <form
              onSubmit={onContinueWithEmail}
              className="flex flex-col items-center gap-6"
            >
              <h1 className="text-center text-h2 font-medium leading-tight text-foreground">
                Welcome to Asset Union
              </h1>
              <p className="max-w-[472px] text-center text-base leading-7 text-[#919191] sm:text-body-lg">
                Sign up or log in to access your account and manage your invest
                appropriate.
              </p>

              <div className="w-full">
                <label
                  className="text-xs font-medium text-foreground"
                  htmlFor="signin-email"
                >
                  Email Address
                </label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand sm:h-10 sm:text-xs"
                />
              </div>

              {formError ? (
                <p className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSendingOtp}
                className="min-h-tap w-full rounded-xl bg-brand px-10 text-sm font-medium text-background transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-4 sm:text-base"
              >
                {isSendingOtp ? "Sending code…" : "Continue with Email"}
              </button>

              <div className="flex w-full items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-[#919191]">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              {methodMode === "social" ? (
                <>
                  <button
                    type="button"
                    onClick={() => openConfiguredAuthProvider("google")}
                    className={`${boxButtonClass} inline-flex items-center justify-center gap-2`}
                  >
                    <SignInGoogleIcon className="h-[20px] w-[20px]" />
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    onClick={() => openConfiguredAuthProvider("apple")}
                    className={`${boxButtonClass} inline-flex items-center justify-center gap-2`}
                  >
                    <SignInAppleIcon className="h-[20px] w-[20px]" />
                    Continue with Apple
                  </button>
                  <button
                    type="button"
                    className="text-base text-brand underline"
                    onClick={() => setMethodMode("web3")}
                  >
                    Try other login options
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openConfiguredAuthProvider("metamask")}
                    className={`${boxButtonClass} inline-flex items-center justify-center gap-2`}
                  >
                    <SignInMetamaskIcon className="h-[20px] w-[20px]" />
                    Continue with Metamask
                  </button>
                  <button
                    type="button"
                    onClick={() => openConfiguredAuthProvider("walletconnect")}
                    className={`${boxButtonClass} inline-flex items-center justify-center gap-2`}
                  >
                    <SignInWalletConnectIcon className="h-[20px] w-[20px]" />
                    Continue with Wallet Connect
                  </button>
                  <button
                    type="button"
                    className="text-base text-brand underline"
                    onClick={() => setMethodMode("social")}
                  >
                    Back to social login
                  </button>
                </>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted">Loading…</p>
        </main>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}
