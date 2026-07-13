"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { appQueryKeys, useSupportMessages } from "@/lib/api/queries/app";
import { sendSupportMessage } from "@/lib/api/requests/app";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

export default function LiveChatSupportPage() {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const { data } = useSupportMessages();
  const queryClient = useQueryClient();
  const messages = data?.messages ?? [];

  async function submitMessage() {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      await sendSupportMessage(body);
      setDraft("");
      await queryClient.invalidateQueries({ queryKey: appQueryKeys.support });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col">
      <div className="flex flex-col gap-6 rounded-[20px] bg-white py-4 sm:rounded-[32px] sm:py-6">
        <div className="flex w-full items-center justify-between border-b border-[#cfe2ec] px-4 pb-4 sm:px-6 sm:pb-6">
          <h1
            className="text-[19px] font-medium text-[#050a0e]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Chat with Our Support
          </h1>
        </div>

        <div className="flex w-full flex-col gap-6 px-4 sm:px-6">
          {messages.map((msg: any, index: number) => {
            const isUser = msg.sender === "user";
            const label = new Date(msg.createdAt).toLocaleString();
            return (
              <div
                key={msg.id ?? `${msg.sender}-${index}`}
                className="mx-auto flex w-full max-w-[743px] gap-2"
              >
                {isUser ? (
                  <>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div
                        className="flex w-full items-center justify-between text-[10px] font-normal text-[#050a0e]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                      >
                        <span>{isUser ? label : "Support"}</span>
                        <span>{isUser ? "You" : label}</span>
                      </div>
                      <div className="min-h-[48px] rounded-[8px] bg-[#f5f7f8] px-4 pt-3 pb-3">
                        <p
                          className="text-[12px] font-normal text-[#050a0e]"
                          style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                          {msg.body}
                        </p>
                      </div>
                    </div>
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
                      <img
                        alt="You"
                        className="size-full object-cover"
                        src={DASHBOARD_ASSETS.liveChatSupport.avatarUser}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
                      <img
                        alt="Support"
                        className="size-full object-cover"
                        src={DASHBOARD_ASSETS.liveChatSupport.avatarSupport}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div
                        className="flex w-full items-center justify-between text-[10px] font-normal text-[#050a0e]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                      >
                        <span>{isUser ? label : "Support"}</span>
                        <span>{isUser ? "You" : label}</span>
                      </div>
                      <div className="min-h-[48px] rounded-[8px] bg-[#f5f7f8] px-4 pt-3 pb-3">
                        <p
                          className="text-[12px] font-normal text-[#050a0e]"
                          style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                          {msg.body}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="mx-auto flex h-[118px] w-full max-w-[743px] flex-col rounded-[12px] border border-solid border-[#cfe2ec] px-4">
            <div className="flex min-h-0 flex-1 items-center justify-between gap-4">
              <textarea
                className="min-h-0 w-0 min-w-0 flex-1 resize-none bg-transparent py-6 text-[12px] font-medium text-[#050a0e] outline-none placeholder:text-[#919191]"
                style={{ fontVariationSettings: "'opsz' 14" }}
                placeholder="Your message goes here.."
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button
                className="flex h-10 shrink-0 items-center justify-center rounded-[12px] bg-[#050a0e] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95"
                style={{ fontVariationSettings: "'opsz' 14" }}
                type="button"
                disabled={sending || !draft.trim()}
                onClick={submitMessage}
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
