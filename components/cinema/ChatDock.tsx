"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "./useRoom";
import { ChatIcon, CloseIcon, SendIcon, UsersIcon } from "./icons";
import NocturneLogo from "./NocturneLogo";

type ChatDockProps = {
  messages: ChatMessage[];
  onlineCount: number;
  open: boolean;
  peerNames: string[];
  userId: string;
  userName: string;
  movieTitle: string;
  onClose: () => void;
  onInvite: () => void;
  onSend: (message: string) => void;
  onToggle: () => void;
};

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

function formatTime(value: number) {
  return timeFormatter.format(new Date(value));
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ChatDock({
  messages,
  onlineCount,
  open,
  peerNames,
  userId,
  userName: _userName,
  movieTitle,
  onClose,
  onInvite,
  onSend,
  onToggle,
}: ChatDockProps) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleMessages = messages.filter((message) => message.kind === "message");

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      const node = scrollRef.current;
      if (node) node.scrollTop = node.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 320);
    return () => window.clearTimeout(timeout);
  }, [open]);

  function submit() {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  return (
    <aside className={`chat-dock ${open ? "is-open" : ""}`} aria-label="Room chat">
      <button
        type="button"
        className="chat-tab"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? "Close room chat" : "Open room chat"}
      >
        <ChatIcon className="h-[17px] w-[17px]" />
        <span>Room chat</span>
        <span className="chat-count">{onlineCount}</span>
        {visibleMessages.length > 0 && !open ? <span className="chat-unread" aria-label="New messages" /> : null}
      </button>

      <div className="chat-panel" aria-hidden={!open}>
        <header className="chat-head">
          <div>
            <h2>Screen 04 private chat</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close chat">
            <CloseIcon className="h-4 w-4" />
          </button>
        </header>

        <div className="chat-presence">
          <span className="online-dot" aria-hidden="true" />
          <span>
            {onlineCount === 1 ? "You are the first one here" : `${onlineCount} watching together`}
          </span>
          <button type="button" onClick={onInvite}>
            <UsersIcon className="h-3.5 w-3.5" />
            Invite
          </button>
        </div>

        {peerNames.length > 0 ? (
          <div className="chat-peers" aria-label="People in this room">
            {peerNames.slice(0, 4).map((name) => (
              <span key={name} title={name}>
                {initials(name)}
              </span>
            ))}
            {peerNames.length > 4 ? <span>+{peerNames.length - 4}</span> : null}
          </div>
        ) : null}

        <div className="chat-messages" ref={scrollRef} aria-live="polite">
          <div className="chat-system">
            <NocturneLogo size={26} glow={false} />
            <div>
              <p>House lights are down.</p>
              <span>
                {movieTitle ? `“${movieTitle}” is loaded on Screen 04.` : "Your screen is ready when you are."}
              </span>
            </div>
          </div>

          {visibleMessages.map((message) => {
            const isMine = message.userId === userId;
            return (
              <div key={message.id} className={`chat-message ${isMine ? "is-mine" : ""}`}>
                <div className="chat-message-meta">
                  <span>{isMine ? "You" : message.userName}</span>
                  <time dateTime={new Date(message.time).toISOString()}>{formatTime(message.time)}</time>
                </div>
                <p>{message.text}</p>
              </div>
            );
          })}

          {visibleMessages.length === 0 ? (
            <p className="chat-empty">Quiet room. Say something before the opening credits.</p>
          ) : null}
        </div>

        <form
          className="chat-form"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label htmlFor="room-chat-message" className="sr-only">
            Message the room
          </label>
          <input
            ref={inputRef}
            id="room-chat-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message the room…"
            maxLength={320}
            autoComplete="off"
          />
          <button type="submit" aria-label="Send message" disabled={!draft.trim()}>
            <SendIcon className="h-[17px] w-[17px]" />
          </button>
        </form>

        <p className="chat-footnote">Room chat syncs across tabs on this device.</p>
      </div>
    </aside>
  );
}
