"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { cn } from "@/lib/utils";
import { appQueryKeys, useSettings } from "@/lib/api/queries/app";
import { deleteAccount, logoutDevice, revealPrivateKey, updateSettings, uploadAsset } from "@/lib/api/requests/app";
import { useAuth } from "@/contexts/auth-provider";

import {
  SettingsBraveBrowserIcon,
  SettingsChromeBrowserIcon,
} from "./settings-browser-icons";
import {
  DeleteAccountModal,
  RevealPrivateKeyDisplayModal,
  RevealPrivateKeyTermsModal,
} from "./settings-modals";

type SettingsTab = "account" | "security";

type Device = {
  id: string;
  location: string;
  status: string;
  statusTone: "active" | "muted";
  browser: string;
  browserIcon: "brave" | "chrome";
  showLogOut: boolean;
};

function TwoFactorToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      aria-checked={enabled}
      className={cn(
        "relative h-[21.895px] w-[41.895px] shrink-0 rounded-full transition-colors",
        enabled ? "bg-[#5c60cc]" : "bg-[#e3e8ec]",
      )}
      role="switch"
      type="button"
      onClick={onToggle}
    >
      <span
        className={cn(
          "absolute top-1/2 size-[18px] -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-all",
          enabled ? "left-[calc(100%-20px)]" : "left-0.5",
        )}
      />
    </button>
  );
}

function DeviceRow({
  id,
  location,
  status,
  statusTone,
  browser,
  browserIcon,
  showLogOut,
  onLogout,
}: Device & { onLogout: (id: string) => void }) {
  const statusClass =
    statusTone === "active" ? "text-[#14ae5c]" : "text-[#919191]";

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <p
          className="text-[14px] font-medium text-[#050a0e]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {location}
        </p>
        <div className="flex flex-wrap items-center gap-1">
          <span
            className={cn("text-[12px] font-medium", statusClass)}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {status}
          </span>
          <span
            className={cn("text-[9px] font-medium", statusClass)}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            •
          </span>
          <div className="flex items-center gap-1">
            {browserIcon === "brave" ? (
              <SettingsBraveBrowserIcon />
            ) : (
              <SettingsChromeBrowserIcon />
            )}
            <span
              className={cn("text-[12px] font-medium", statusClass)}
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {browser}
            </span>
          </div>
        </div>
      </div>
      {showLogOut ? (
        <button
          className="flex h-10 shrink-0 items-center justify-center rounded-[12px] bg-[#edf4f8] px-3 text-[12px] font-medium text-[#050a0e] transition-opacity hover:opacity-90"
          style={{ fontVariationSettings: "'opsz' 14" }}
          type="button"
          onClick={() => onLogout(id)}
        >
          Log out
        </button>
      ) : null}
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("account");
  const [twoFactor, setTwoFactor] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dialCode, setDialCode] = useState("+");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data } = useSettings();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout } = useAuth();
  const devices: Device[] = data?.devices ?? [];

  useEffect(() => {
    if (!data?.user) return;
    setFullName(data.user.fullName ?? "");
    setEmail(data.user.email ?? "");
    const rawPhone = String(data.user.phoneNumber ?? "");
    const match = rawPhone.match(/^(\+\d{1,3})(.*)$/);
    setDialCode(match?.[1] ?? "+");
    setPhone((match?.[2] ?? rawPhone).trim());
    setAvatarUrl(data.user.avatarUrl ?? null);
    setTwoFactor(Boolean(data.user.twoFactorEnabled));
  }, [data?.user]);

  const [revealTermsOpen, setRevealTermsOpen] = useState(false);
  const [revealKeyOpen, setRevealKeyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openRevealFlow = useCallback(() => setRevealTermsOpen(true), []);
  const continueRevealFlow = useCallback(async () => {
    setRevealTermsOpen(false);
    try {
      const result = await revealPrivateKey();
      setPrivateKey(result.privateKey);
      setRevealKeyOpen(true);
    } catch {
      setPrivateKey("");
    }
  }, []);

  const saveChanges = useCallback(async () => {
    setSaving(true);
    try {
      await updateSettings({ fullName, email, phoneNumber: `${dialCode}${phone}`.replace(/\s+/g, "") });
      await Promise.all([queryClient.invalidateQueries({ queryKey: appQueryKeys.settings }), queryClient.invalidateQueries({ queryKey: ["auth", "me"] })]);
    } finally {
      setSaving(false);
    }
  }, [dialCode, email, fullName, phone, queryClient]);

  const toggleTwoFactor = useCallback(async () => {
    const next = !twoFactor;
    setTwoFactor(next);
    try {
      await updateSettings({ twoFactorEnabled: next });
      await queryClient.invalidateQueries({ queryKey: appQueryKeys.settings });
    } catch {
      setTwoFactor(!next);
    }
  }, [queryClient, twoFactor]);

  const logOutDevice = useCallback(async (id: string) => {
    await logoutDevice(id);
    await queryClient.invalidateQueries({ queryKey: appQueryKeys.settings });
  }, [queryClient]);

  const logOutOtherDevices = useCallback(async () => {
    await Promise.all(devices.filter((device) => device.showLogOut).map((device) => logoutDevice(device.id)));
    await queryClient.invalidateQueries({ queryKey: appQueryKeys.settings });
  }, [devices, queryClient]);

  const uploadAvatar = useCallback(async (file?: File) => {
    if (!file) return;
    const uploaded = await uploadAsset(file, "asset-union/avatars");
    await updateSettings({ avatarUrl: uploaded.url });
    setAvatarUrl(uploaded.url);
    await queryClient.invalidateQueries({ queryKey: appQueryKeys.settings });
  }, [queryClient]);

  const confirmDelete = useCallback(async () => {
    await deleteAccount();
    setDeleteOpen(false);
    await logout();
    router.replace("/sign-in");
  }, [logout, router]);

  return (
    <div className="mx-auto flex w-full max-w-[604px] flex-col">
      <div className="flex flex-col gap-8 rounded-[20px] bg-white p-4 sm:gap-10 sm:p-8 md:gap-12 md:p-12">
        <div className="flex h-10 w-fit items-center self-center rounded-[12px] bg-[#f5f7f8] p-1">
          <button
            className={cn(
              "flex h-full items-center justify-center rounded-[8px] px-3 text-[12px] transition-colors",
              tab === "account"
                ? "bg-white font-medium text-[#050a0e] shadow-[0_1px_4px_rgba(12,12,13,0.05)]"
                : "font-medium text-[#919191]",
            )}
            style={{ fontVariationSettings: "'opsz' 14" }}
            type="button"
            onClick={() => setTab("account")}
          >
            Account
          </button>
          <button
            className={cn(
              "flex h-full items-center justify-center rounded-[8px] px-3 text-[12px] transition-colors",
              tab === "security"
                ? "bg-white font-medium text-[#050a0e] shadow-[0_1px_4px_rgba(12,12,13,0.05)]"
                : "font-medium text-[#919191]",
            )}
            style={{ fontVariationSettings: "'opsz' 14" }}
            type="button"
            onClick={() => setTab("security")}
          >
            Security & Privacy
          </button>
        </div>

        {tab === "account" ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative size-[177.922px] shrink-0 overflow-hidden rounded-full">
              <Image
                alt="Profile photo"
                className="object-cover"
                fill
                priority
                sizes="178px"
                src={avatarUrl || DASHBOARD_ASSETS.settings.profileAvatar}
                unoptimized
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[98px] bg-[rgba(0,0,0,0.49)] blur-[3.5px]"
              />
              <button className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-2 pt-3" type="button" onClick={() => fileRef.current?.click()}>
                <div className="relative size-6">
                  <Image
                    alt=""
                    aria-hidden
                    className="object-contain"
                    fill
                    src={DASHBOARD_ASSETS.settings.uploadCloudIcon}
                  />
                </div>
                <p
                  className="mt-0.5 text-center text-[11px] font-medium text-white"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Upload
                </p>
              </button>
              <input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={(event) => void uploadAvatar(event.target.files?.[0])} />
            </div>

            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className="text-[12px] font-medium text-[#050a0e]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    Full Name
                  </span>
                  <input
                    className="h-10 w-full rounded-[12px] border border-[#cfe2ec] bg-white px-4 text-[12px] font-medium text-[#050a0e] outline-none focus-visible:border-[#5c60cc] focus-visible:ring-2 focus-visible:ring-[#5c60cc]/20"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className="text-[12px] font-medium text-[#050a0e]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    Email Address
                  </span>
                  <input
                    className="h-10 w-full rounded-[12px] border border-[#cfe2ec] bg-white px-4 text-[12px] font-medium text-[#050a0e] outline-none focus-visible:border-[#5c60cc] focus-visible:ring-2 focus-visible:ring-[#5c60cc]/20"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className="text-[12px] font-medium text-[#050a0e]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    Phone Number
                  </span>
                  <div className="flex h-10 w-full items-center gap-2 rounded-[12px] border border-[#cfe2ec] bg-white px-4">
                    <input
                      className="w-12 bg-transparent text-[12px] font-medium text-[#050a0e] outline-none"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                    />
                    <span
                      className="text-[12px] font-medium text-[#cfe2ec]"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                      |
                    </span>
                    <input
                      className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#050a0e] outline-none"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </label>
                <button
                  className="flex h-10 shrink-0 items-center justify-center rounded-[12px] bg-[#5c60cc] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                  type="button"
                  disabled={saving}
                  onClick={saveChanges}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-[12px] border border-[#cfe2ec] p-4 sm:px-4 sm:py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p
                    className="text-[14px] font-medium text-[#050a0e]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    2 - step verification
                  </p>
                  <p
                    className="max-w-[320px] text-[12px] font-medium text-[#919191]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    Increase youre safety by adding 2-step verification method
                  </p>
                </div>
                <TwoFactorToggle
                  enabled={twoFactor}
                  onToggle={toggleTwoFactor}
                />
              </div>
            </div>

            <div className="rounded-[12px] border border-[#cfe2ec] p-4 sm:px-4 sm:py-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p
                    className="text-[14px] font-medium text-[#050a0e]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    Private Key
                  </p>
                  <p
                    className="max-w-[280px] whitespace-pre-wrap text-[12px] font-medium leading-normal text-[#919191]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {`Protect your wallet by saving your Secret  Recovery Phrase in various places like on  a piece of paper, password manager and/or the cloud.`}
                  </p>
                </div>
                <button
                  className="flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] bg-[#050a0e] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                  type="button"
                  onClick={openRevealFlow}
                >
                  Reveal your private key
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p
                className="text-[12px] font-medium text-[#050a0e]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Logged Devices
              </p>
              <div className="rounded-[12px] border border-[#cfe2ec] p-4 sm:px-4 sm:py-6">
                <div className="flex flex-col gap-6">
                  {devices.map((device) => (
                    <DeviceRow key={device.id} {...device} onLogout={logOutDevice} />
                  ))}
                  <div className="flex justify-center pt-1">
                    <button
                      className="flex h-10 w-[147px] items-center justify-center rounded-[12px] bg-[#5c60cc] text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                      type="button"
                      onClick={logOutOtherDevices}
                    >
                      Log out all devices
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p
                className="text-[12px] font-medium text-[#050a0e]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Account
              </p>
              <div className="rounded-[12px] border border-[#cfe2ec] p-4 sm:px-4 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p
                      className="text-[14px] font-medium text-[#050a0e]"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                      Delete Account
                    </p>
                    <p
                      className="text-[12px] font-medium text-[#919191]"
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                      Erase all my data from this platform
                    </p>
                  </div>
                  <button
                    className="flex h-10 shrink-0 items-center justify-center rounded-[12px] bg-[#b3261e] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <RevealPrivateKeyTermsModal
        open={revealTermsOpen}
        onContinue={continueRevealFlow}
        onOpenChange={setRevealTermsOpen}
        walletAddress={data?.wallet?.address}
      />
      <RevealPrivateKeyDisplayModal
        open={revealKeyOpen}
        onOpenChange={setRevealKeyOpen}
        privateKey={privateKey}
      />
      <DeleteAccountModal open={deleteOpen} onOpenChange={setDeleteOpen} onConfirmDelete={confirmDelete} />
    </div>
  );
}
