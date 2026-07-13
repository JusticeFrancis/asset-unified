import { parsePhoneNumberFromString } from "libphonenumber-js";

const E164_REGEX = /^\+[1-9]\d{7,14}$/;

export function normalizePhoneToE164(phone: string, countryCode: string) {
  const trimmed = phone.trim();
  if (!trimmed) return "";

  const parsed = parsePhoneNumberFromString(trimmed, countryCode as never);
  if (parsed?.isValid()) {
    return parsed.format("E.164");
  }

  if (trimmed.startsWith("+")) {
    return trimmed.replace(/\s/g, "");
  }

  return "";
}

export function isValidE164Phone(phone: string) {
  return E164_REGEX.test(phone);
}

export function getPhoneValidationError(phone: string) {
  if (!phone.trim()) {
    return "Phone number is required.";
  }

  if (!isValidE164Phone(phone)) {
    return "Enter a valid phone number in international format (e.g. +14155552671).";
  }

  return null;
}

export function getFullNameValidationError(fullName: string) {
  if (!fullName.trim()) {
    return "Full name is required.";
  }
  return null;
}

export function getCountryValidationError(country: string) {
  if (!country.trim()) {
    return "Country is required.";
  }
  return null;
}
