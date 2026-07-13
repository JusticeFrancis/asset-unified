"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/lib/assets";
import {
  FooterDiscordIcon,
  FooterInstagramIcon,
  FooterTelegramIcon,
  FooterXIcon,
  HomeAppStoreBadgeIcon,
  HomeGooglePlayBadgeIcon,
  MailLineIcon,
} from "@/components/icons";
import { useRecord } from "@/lib/api/queries/app";
import { Container } from "./shared";

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function Footer() {
  const { data } = useRecord("site-config", "default");
  const email = text(data?.contactEmail);
  const officeAddress = text(data?.officeAddress);
  const appStoreUrl = text(data?.appStoreUrl);
  const googlePlayUrl = text(data?.googlePlayUrl);
  const rwaReportUrl = text(data?.rwaReportUrl);
  const amlPolicyUrl = text(data?.amlPolicyUrl);
  const cookiePolicyUrl = text(data?.cookiePolicyUrl);
  const riskDisclaimer = text(data?.riskDisclaimer);
  const copyrightText = text(data?.copyrightText);
  const socialLinks = [
    { url: text(data?.telegramUrl), label: "Telegram", Icon: FooterTelegramIcon },
    { url: text(data?.discordUrl), label: "Discord", Icon: FooterDiscordIcon },
    { url: text(data?.instagramUrl), label: "Instagram", Icon: FooterInstagramIcon },
    { url: text(data?.xUrl), label: "X", Icon: FooterXIcon },
  ];
  const compactBadge = "flex items-center gap-[7px] rounded-[5px] border border-[#2C373F] bg-[#050A0E] px-[7px] py-[5px] text-left";

  return (
    <footer className="rounded-t-[20px] bg-footer py-12 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src={Logo} alt="Asset Union logo" />
              <p className="text-lg md:text-xl font-semibold uppercase tracking-tight text-brand">Asset Union</p>
            </Link>
            <p className="mt-2 text-[16px] leading-[25.2px] text-white">Fractional real estate ownership.</p>
            {officeAddress ? <p className="mt-1 max-w-[270px] text-[16px] leading-[25.2px] text-[#919191]">{officeAddress}</p> : null}
          </div>

          <div className="text-[16px] leading-[25.2px]">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-white">
              {rwaReportUrl ? <a href={rwaReportUrl} target="_blank" rel="noopener noreferrer"><span className="text-white">RWA-Tokenization report</span></a> : null}
              <Link href="/documentation/academy"><span className="text-white">Documentation</span></Link>
              <Link href="/products/secondary-market"><span className="text-white">Marketplace</span></Link>
              <Link href="/faq"><span className="text-white">FAQ</span></Link>
              <Link href="/documentation/academy"><span className="text-white">Guide Buying Property</span></Link>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {socialLinks.map(({ url, label, Icon }) => url ? (
                <a key={label} href={url} aria-label={label} target="_blank" rel="noopener noreferrer" className="inline-flex size-10 items-center justify-center rounded-full bg-white/3"><Icon className="size-6 text-brand" /></a>
              ) : (
                <span key={label} aria-hidden className="inline-flex size-10 items-center justify-center rounded-full bg-white/3"><Icon className="size-6 text-brand" /></span>
              ))}
            </div>
          </div>

          <div className="text-[16px] leading-[25.2px] lg:text-right">
            {email ? <><p className="text-[#919191]">Write us an Email</p><a className="mt-1 inline-flex items-center gap-2 text-white" href={`mailto:${email}`}><MailLineIcon className="size-4 text-white" /><span className="text-white">{email}</span></a></> : null}
            <p className="mt-4 text-[#919191]">Get app now</p>
            <div className="mt-2 flex gap-2 lg:justify-end">
              {appStoreUrl ? <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className={compactBadge}><HomeAppStoreBadgeIcon className="size-[19.8px] object-contain" /><span className="text-[9.9px] leading-[12.9px] text-[#F4F6F6]"><span className="block font-light">Download on the</span><span className="block font-medium">App Store</span></span></a> : <button type="button" disabled aria-disabled="true" className={compactBadge}><HomeAppStoreBadgeIcon className="size-[19.8px] object-contain" /><span className="text-[9.9px] leading-[12.9px] text-[#F4F6F6]"><span className="block font-light">Download on the</span><span className="block font-medium">App Store</span></span></button>}
              {googlePlayUrl ? <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className={compactBadge}><HomeGooglePlayBadgeIcon className="h-[19.8px] w-[17.9px] object-contain" /><span className="text-[9.9px] leading-[12.9px] text-[#F4F6F6]"><span className="block font-light">Get it on</span><span className="block font-medium">Google play</span></span></a> : <button type="button" disabled aria-disabled="true" className={compactBadge}><HomeGooglePlayBadgeIcon className="h-[19.8px] w-[17.9px] object-contain" /><span className="text-[9.9px] leading-[12.9px] text-[#F4F6F6]"><span className="block font-light">Get it on</span><span className="block font-medium">Google play</span></span></button>}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-white/10 pt-6 text-[16px] leading-[25.2px] text-white">
          {amlPolicyUrl ? <a href={amlPolicyUrl} target="_blank" rel="noopener noreferrer"><span className="text-white">AML Policy</span></a> : null}
          <Link href="/legal/privacy-policy"><span className="text-white">Privacy Policy</span></Link>
          <Link href="/legal/terms-of-use"><span className="text-white">Terms of Use</span></Link>
          {cookiePolicyUrl ? <a href={cookiePolicyUrl} target="_blank" rel="noopener noreferrer"><span className="text-white">Cookie Policy</span></a> : null}
        </div>
        {riskDisclaimer ? <p className="mt-5 text-[16px] leading-[25.2px] text-[#919191]">{riskDisclaimer}</p> : null}
        {copyrightText ? <p className="mt-6 text-center text-[16px] leading-[25.2px] text-[#919191]">{copyrightText}</p> : null}
      </Container>
    </footer>
  );
}
