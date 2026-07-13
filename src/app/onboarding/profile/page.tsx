"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { useAuth } from "@/contexts/auth-provider";
import {
  sanitizeCallbackUrl,
  signInPathWithCallback,
} from "@/lib/auth/callback-url";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { COUNTRIES } from "@/lib/countries";
import { SignInBackground, SignInOtpFaviconBg } from "@/lib/assets";
import {
  getCountryValidationError,
  getFullNameValidationError,
  getPhoneValidationError,
  normalizePhoneToE164,
} from "@/lib/validation/profile";

function OnboardingProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, updateProfile } = useAuth();

  const callbackUrl = searchParams.get("callbackUrl");

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(signInPathWithCallback(callbackUrl));
    }
  }, [callbackUrl, isLoading, router, user]);

  const phoneHint = useMemo(() => {
    const example = parsePhoneNumberFromString("4155552671", country as never);
    if (example) {
      return `Example: ${example.formatInternational()}`;
    }
    return "Include country code or we will format it on submit.";
  }, [country]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const normalizedPhone = normalizePhoneToE164(phone, country);
    const nextErrors: Record<string, string> = {};

    const fullNameError = getFullNameValidationError(fullName);
    if (fullNameError) nextErrors.fullName = fullNameError;

    const countryError = getCountryValidationError(country);
    if (countryError) nextErrors.country = countryError;

    const phoneError = getPhoneValidationError(normalizedPhone);
    if (phoneError) nextErrors.phoneNumber = phoneError;

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await updateProfile({
        fullName: fullName.trim(),
        country,
        phoneNumber: normalizedPhone,
      });

      const destination = sanitizeCallbackUrl(callbackUrl) ?? "/dashboard";
      router.replace(destination);
    } catch (error) {
      setSubmitError(
        getAuthErrorMessage(error, "Unable to save your profile. Try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
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
            <img
              alt=""
              aria-hidden
              className="h-full w-full object-contain"
              src={SignInOtpFaviconBg}
            />
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center gap-6"
          >
            <div className="space-y-2 text-center">
              <h1 className="text-h2 font-medium leading-tight text-foreground">
                Complete your profile
              </h1>
              <p className="max-w-[472px] text-base leading-7 text-[#919191] sm:text-body-lg">
                Add a few details so we can set up your investor account.
              </p>
            </div>

            <div className="w-full space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground">
                  Email address
                </label>
                <input
                  readOnly
                  value={user.email}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-[#f7f9fb] px-4 text-sm text-muted outline-none sm:h-10"
                />
              </div>

              <div>
                <label
                  className="text-xs font-medium text-foreground"
                  htmlFor="profile-full-name"
                >
                  Full name
                </label>
                <input
                  id="profile-full-name"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand sm:h-10"
                />
                {fieldErrors.fullName ? (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.fullName}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="text-xs font-medium text-foreground"
                  htmlFor="profile-country"
                >
                  Country
                </label>
                <select
                  id="profile-country"
                  required
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand sm:h-10"
                >
                  {COUNTRIES.map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.country ? (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.country}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="text-xs font-medium text-foreground"
                  htmlFor="profile-phone"
                >
                  Phone number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 415 555 2671"
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand sm:h-10"
                />
                <p className="mt-1 text-xs text-[#919191]">{phoneHint}</p>
                {fieldErrors.phoneNumber ? (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.phoneNumber}
                  </p>
                ) : null}
              </div>
            </div>

            {submitError ? (
              <p className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-tap w-full rounded-xl bg-brand px-10 text-sm font-medium text-background transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-4 sm:text-base"
            >
              {isSubmitting ? "Saving…" : "Continue to dashboard"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function OnboardingProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted">Loading…</p>
        </main>
      }
    >
      <OnboardingProfilePageContent />
    </Suspense>
  );
}
