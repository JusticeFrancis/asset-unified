import Link from "next/link";

export function FaqMarketingLink() {
  return (
    <p className="text-[14px] font-light text-[#787878]">
      Public FAQ:{" "}
      <Link className="text-[#5c60cc] underline" href="/faq">
        /faq
      </Link>
    </p>
  );
}
