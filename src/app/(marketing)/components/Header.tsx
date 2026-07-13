"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "./shared";
import Image from "next/image";
import { Logo } from "@/lib/assets";
import {
  DropdownIcon,
  FlagAeIcon,
  FlagUaIcon,
  FlagUkIcon,
  FlagUsIcon,
  NavBlocksIcon,
  NavBuildingIcon,
  NavDocsIcon,
  NavEcosystemIcon,
  NavGuideIcon,
  NavKeyIcon,
  NavShieldIcon,
} from "@/components/icons";
import * as Icons from "@/components/icons";
import Link from "next/link";

type HeaderMenuKey = "products" | "solutions" | "documentation";
type NavMenuItem = { key: HeaderMenuKey; label: string; href: string };
type DropdownEntry = {
  title: string;
  body: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};
type DropdownConfig = {
  label: string;
  widthClass: string;
  rows: DropdownEntry[][];
};

type LanguageOption = {
  code: "US" | "UK" | "UA" | "AE";
  Flag: ComponentType<{ className?: string }>;
};

const navItems = [
  { key: "products", label: "Products", href: "/products/rental-market" },
  { key: "solutions", label: "Solutions", href: "/solutions/developers" },
  { key: "documentation", label: "Documentation", href: "/documentation/academy" },
] satisfies NavMenuItem[];

const productsMenuItems = [
  {
    title: "Rental market",
    body: "Invest in Tokenized Real Estate Properties",
    href: "/products/rental-market",
    icon: NavKeyIcon,
  },
  {
    title: "Secondary Market",
    body: "Sell Your Tokens or Buy Them From Others",
    href: "/products/secondary-market",
    icon: NavBlocksIcon,
  },
  {
    title: "Construction market",
    body: "More Profits With the Constructions Properties",
    href: "/products/construction-market",
    icon: NavBuildingIcon,
  },
] as const;

const solutionsMenuItems = [
  {
    title: "Developers",
    body: "Meet or become our real estate developers.",
    href: "/solutions/developers",
    icon: NavKeyIcon,
  },
  {
    title: "Agencies",
    body: "Sales Boost Instruments & Brokers Management System",
    href: "/solutions/agency",
    icon: NavBlocksIcon,
  },
  {
    title: "Partners",
    body: "Property Management, Law Firm & Other Service Providers",
    href: "/solutions/partners",
    icon: NavBuildingIcon,
  },
  {
    title: "Independent Agents",
    body: "Community for Real Estate Superstars",
    href: "/solutions/independent-agent",
    icon: NavBuildingIcon,
  },
] as const;

const NavAcademyIconComponent =
  (Icons as { NavAcademyIcon?: typeof NavGuideIcon }).NavAcademyIcon ??
  NavGuideIcon;

const documentationMenuRows: DropdownEntry[][] = [
  [
    {
      title: "Documentation",
      body: "Asset Union Platform Documentation",
      href: "#",
      icon: NavDocsIcon,
    },
    {
      title: "4 Levels of Security",
      body: "How are your ownership rights protected?",
      href: "#",
      icon: NavShieldIcon,
    },
    {
      title: "Academy",
      body: "Learn how to use the Asset Union Platform properly",
      href: "/documentation/academy",
      icon: NavAcademyIconComponent,
    },
    {
      title: "Beginner's Guide",
      body: "All the knowledge about the platform.",
      href: "/faq",
      icon: NavGuideIcon,
    },
  ],
  [
    {
      title: "Ecosystem",
      body: "Launching your own real estate properties as a developer",
      href: "#",
      icon: NavEcosystemIcon,
    },
    {
      title: "Referral Program",
      body: "Invite your friends and get valuable rewards",
      href: "/documentation/referral",
      icon: NavBlocksIcon,
    },
    {
      title: "Tax System",
      body: "Watch and learn with Asset Union",
      href: "/legal/terms-of-use",
      icon: NavBuildingIcon,
    },
  ],
];

const dropdownConfigs: Record<HeaderMenuKey, DropdownConfig> = {
  products: {
    label: "Real Estate",
    widthClass: "w-[792px]",
    rows: [productsMenuItems as unknown as DropdownEntry[]],
  },
  solutions: {
    label: "Solution",
    widthClass: "w-[875px]",
    rows: [solutionsMenuItems as unknown as DropdownEntry[]],
  },
  documentation: {
    label: "Documentation",
    widthClass: "w-[875px]",
    rows: documentationMenuRows,
  },
};

const languageOptions: LanguageOption[] = [
  { code: "US", Flag: FlagUsIcon },
  { code: "UK", Flag: FlagUkIcon },
  { code: "UA", Flag: FlagUaIcon },
  { code: "AE", Flag: FlagAeIcon },
];

function DropdownMenuPanel({ config }: { config: DropdownConfig }) {
  return (
    <div
      className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 ${config.widthClass} max-w-[calc(100vw-2rem)]`}
    >
      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.11)]">
        <p className="px-3 text-[10px] font-medium uppercase text-muted">
          {config.label}
        </p>

        <div className="mt-2">
          {config.rows.map((row, rowIndex) => (
            <div key={`menu-row-${rowIndex}`}>
              <div
                className={`grid ${row.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}
              >
                {row.map((entry, index) => {
                  const Icon = entry.icon;

                  return (
                    <Link
                      key={entry.title}
                      href={entry.href}
                      className={`group flex min-h-[72px] gap-1 px-3 py-2 ${
                        index < row.length - 1
                          ? "border-r border-[#F5F7F8]"
                          : ""
                      }`}
                    >
                      <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center">
                        <Icon className="size-4 text-brand" />
                      </span>
                      <span className="block">
                        <span className="block text-[12px] font-normal leading-normal text-foreground transition group-hover:text-brand">
                          {entry.title}
                        </span>
                        <span className="mt-1 block text-[12px] font-light leading-normal text-muted">
                          {entry.body}
                        </span>
                      </span>
                    </Link>
                  );
                })}
                {row.length === 3 ? <div /> : null}
              </div>
              {rowIndex < config.rows.length - 1 ? (
                <div className="mx-3 my-4 h-px bg-[#F5F7F8]" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type LanguageSwitcherProps = {
  selectedLanguage: LanguageOption;
  onSelect: (option: LanguageOption) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Render an inline (non-popover) variant for the mobile sheet. */
  variant?: "popover" | "inline";
};

function LanguageSwitcher({
  selectedLanguage,
  onSelect,
  isOpen,
  onOpenChange,
  variant = "popover",
}: LanguageSwitcherProps) {
  if (variant === "inline") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {languageOptions.map((option) => {
          const isSelected = option.code === selectedLanguage.code;
          return (
            <button
              key={option.code}
              type="button"
              onClick={() => onSelect(option)}
              className={`flex min-h-tap items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${
                isSelected
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-white text-foreground hover:border-brand/40"
              }`}
            >
              <option.Flag className="h-3 w-4 rounded-[2px] object-cover" />
              <span className="text-sm font-medium">{option.code}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
    >
      <button
        type="button"
        className="flex min-h-tap items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-[10px] text-foreground"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <selectedLanguage.Flag className="h-[8px] w-[12px] rounded-[2px] object-cover" />
        <span className="text-[12px] text-foreground">EN</span>
        <DropdownIcon />
      </button>

      {isOpen ? (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
          <div className="w-[84px] rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.11)]">
            {languageOptions.map((option, index) => (
              <div key={option.code}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left cursor-pointer"
                  onClick={() => {
                    onSelect(option);
                    onOpenChange(false);
                  }}
                >
                  <option.Flag className="h-[10px] w-[14px] rounded-[2px] object-cover" />
                  <span className="text-[12px] font-light text-foreground">
                    {option.code}
                  </span>
                </button>
                {index < languageOptions.length - 1 ? (
                  <div className="h-px bg-[#F5F7F8]" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type MobileNavSheetProps = {
  open: boolean;
  onClose: () => void;
  selectedLanguage: LanguageOption;
  onSelectLanguage: (option: LanguageOption) => void;
};

function MobileNavSheet({
  open,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}: MobileNavSheetProps) {
  const [expandedKey, setExpandedKey] = useState<HeaderMenuKey | null>(
    "products",
  );

  // Lock body scroll while the sheet is open and close on Escape /
  // resize past the md breakpoint (so we don't end up with the sheet
  // still mounted underneath the desktop layout).
  useEffect(() => {
    if (!open) return;

    document.body.dataset.scrollLocked = "true";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      delete document.body.dataset.scrollLocked;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <Link href="/" onClick={onClose} className="flex items-center gap-2">
          <Image src={Logo} alt="Asset Union logo" />
          <p className="text-base font-bold uppercase tracking-tight text-brand">
            Asset Union
          </p>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="inline-flex size-tap items-center justify-center rounded-lg text-foreground hover:bg-surface"
        >
          <X className="size-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const config = dropdownConfigs[item.key];
            const isExpanded = expandedKey === item.key;
            const entries = config.rows.flat();

            return (
              <li
                key={item.key}
                className="rounded-xl border border-border bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpandedKey((current) =>
                      current === item.key ? null : item.key,
                    )
                  }
                >
                  <span className="text-base font-medium text-foreground">
                    {item.label}
                  </span>
                  <DropdownIcon
                    className={`transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isExpanded ? (
                  <ul className="space-y-1 border-t border-border p-2">
                    {entries.map((entry) => {
                      const Icon = entry.icon;
                      return (
                        <li key={entry.title}>
                          <Link
                            href={entry.href}
                            onClick={onClose}
                            className="flex items-start gap-3 rounded-lg p-3 transition hover:bg-surface"
                          >
                            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                              <Icon className="size-4" />
                            </span>
                            <span className="block">
                              <span className="block text-sm font-medium text-foreground">
                                {entry.title}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-muted">
                                {entry.body}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-6">
          <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Language
          </p>
          <LanguageSwitcher
            variant="inline"
            selectedLanguage={selectedLanguage}
            onSelect={onSelectLanguage}
            isOpen={false}
            onOpenChange={() => {}}
          />
        </div>
      </nav>

      <div className="border-t border-border bg-white px-4 py-4">
        <Link
          href="/sign-in"
          onClick={onClose}
          className="inline-flex min-h-tap w-full items-center justify-center rounded-xl bg-brand px-6 py-3 text-base font-medium text-white"
        >
          <span className="text-base font-medium text-white">Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const [activeMenu, setActiveMenu] = useState<HeaderMenuKey | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
    languageOptions[0],
  );
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 z-40 w-full bg-transparent py-3">
        <Container className="flex min-h-[48px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="Asset Union logo" />
            <p className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-tight text-brand">
              Asset Union
            </p>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <div
              className="relative hidden md:block"
              onMouseLeave={() => setActiveMenu(null)}
            >
              <nav className="flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onMouseEnter={() => setActiveMenu(item.key)}
                    className="flex items-center gap-1 text-[18px] transition"
                  >
                    <span
                      className={`text-[18px] ${activeMenu === item.key ? "text-brand" : "text-foreground hover:text-brand"}`}
                    >
                      {item.label}
                    </span>
                    <DropdownIcon />
                  </Link>
                ))}
              </nav>

              {activeMenu ? (
                <DropdownMenuPanel config={dropdownConfigs[activeMenu]} />
              ) : null}
            </div>

            <div className="hidden md:block">
              <LanguageSwitcher
                selectedLanguage={selectedLanguage}
                onSelect={setSelectedLanguage}
                isOpen={isLanguageMenuOpen}
                onOpenChange={setIsLanguageMenuOpen}
              />
            </div>

            <Link
              href="/sign-in"
              className="hidden md:inline-flex min-h-[53px] items-center justify-center rounded-xl bg-brand px-6 py-4 text-base font-medium text-white transition hover:opacity-95"
            >
              <span className="text-white">Sign In</span>
            </Link>

            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={isMobileNavOpen}
              aria-controls="marketing-mobile-nav"
              onClick={() => setIsMobileNavOpen(true)}
              className="inline-flex size-tap items-center justify-center rounded-lg text-foreground hover:bg-surface md:hidden"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </Container>
      </header>

      <MobileNavSheet
        open={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />
    </>
  );
}
