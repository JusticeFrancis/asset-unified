import Link from "next/link";

export function LegalLinks() {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <Link href="/legal/privacy-policy">Privacy Policy</Link>
      <Link href="/legal/terms-of-use">Terms of Use</Link>
    </div>
  );
}
