import Link from "next/link";

export function TermsLegalLink() {
  return (
    <p className="text-[14px] font-light text-[#787878]">
      Full terms of use:{" "}
      <Link className="text-[#5c60cc] underline" href="/legal/terms-of-use">
        /legal/terms-of-use
      </Link>
    </p>
  );
}
