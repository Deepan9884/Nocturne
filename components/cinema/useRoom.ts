"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ChatMessage = {
  id: string;
  kind: "message" | "system";
  text: string;
  time: number;
  userId: string;
  userName: string;
};

type Peer = {
  id: string;
  name: string;
  lastSeen: number;
};

type RoomPacket =
  | { type: "hello"; from: string; user: Peer }
  | { type: "here"; from: string; user: Peer }
  | { type: "ping"; from: string; user: Peer }
  | { type: "bye"; from: string; user: Peer }
  | { type: "chat"; from: string; message: ChatMessage };

const PRESENCE_TIMEOUT = 11_000;

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `guest-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function readStoredMessages(key: string): ChatMessage[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.text === "string").slice(-80);
  } catch {
    return [];
  }
}

export function useRoom(roomId: string, userName: string) {
  const [userId, setUserId] = useState("");
  const storageKey = useMemo(() => `nocturne-chat-${roomId}`, [roomId]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);
  const peersRef = useRef<Map<string, Peer>>(new Map());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const nameRef = useRef(userName);
  const roomRef = useRef(roomId);

  nameRef.current = userName;
  roomRef.current = roomId;

  useEffect(() => {
    setUserId((current) => current || createId());
  }, []);

  const syncPeers = useCallback(() => {
    setPeers(Array.from(peersRef.current.values()).sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  const touchPeer = useCallback(
    (user: Peer) => {
      if (!user?.id || user.id === userId) return;
      peersRef.current.set(user.id, { ...user, lastSeen: Date.now() });
      syncPeers();
    },
    [syncPeers, userId],
  );

  const persistMessages = useCallback(
    (next: ChatMessage[]) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next.slice(-80)));
      } catch {
        // Storage can be disabled in private modes. Chat still works for the session.
      }
    },
    [storageKey],
  );

  useEffect(() => {
    setMessages(readStoredMessages(storageKey));
    setPeers([]);
    peersRef.current.clear();
  }, [storageKey]);

  useEffect(() => {
    if (!userId) return;
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(`nocturne-room-${roomId}`);
    channelRef.current = channel;

    const announce = () => {
      const user: Peer = { id: userId, name: nameRef.current || "Guest", lastSeen: Date.now() };
      channel.postMessage({ type: "ping", from: userId, user } satisfies RoomPacket);
    };

    channel.onmessage = (event: MessageEvent<RoomPacket>) => {
      const packet = event.data;
      if (!packet || packet.from === userId) return;

      if (packet.type === "chat") {
        setMessages((current) => {
          if (current.some((message) => message.id === packet.message.id)) return current;
          return [...current, packet.message].slice(-80);
        });
        touchPeer({
          id: packet.message.userId,
          name: packet.message.userName,
          lastSeen: Date.now(),
        });
        return;
      }

      if (packet.type === "bye") {
        peersRef.current.delete(packet.user.id);
        syncPeers();
        return;
      }

      touchPeer(packet.user);
      if (packet.type === "hello") {
        const user: Peer = { id: userId, name: nameRef.current || "Guest", lastSeen: Date.now() };
        channel.postMessage({ type: "here", from: userId, user } satisfies RoomPacket);
      }
    };

    const user: Peer = { id: userId, name: nameRef.current || "Guest", lastSeen: Date.now() };
    channel.postMessage({ type: "hello", from: userId, user } satisfies RoomPacket);

    const ping = window.setInterval(announce, 3_500);
    const prune = window.setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, peer] of peersRef.current) {
        if (now - peer.lastSeen > PRESENCE_TIMEOUT) {
          peersRef.current.delete(id);
          changed = true;
        }
      }
      if (changed) syncPeers();
    }, 4_000);

    const leave = () => {
      channel.postMessage({
        type: "bye",
        from: userId,
        user: { id: userId, name: nameRef.current || "Guest", lastSeen: Date.now() },
      } satisfies RoomPacket);
    };

    window.addEventListener("pagehide", leave);
    window.addEventListener("beforeunload", leave);

    return () => {
      window.clearInterval(ping);
      window.clearInterval(prune);
      window.removeEventListener("pagehide", leave);
      window.removeEventListener("beforeunload", leave);
      leave();
      channel.close();
      if (channelRef.current === channel) channelRef.current = null;
    };
  }, [roomId, syncPeers, touchPeer, userId]);

  const sendMessage = useCallback(
    (raw: string) => {
      if (!userId) return;
      const text = raw.trim().slice(0, 320);
      if (!text) return;

      const message: ChatMessage = {
        id: createId(),
        kind: "message",
        text,
        time: Date.now(),
        userId,
        userName: nameRef.current.trim() || "Guest",
      };

      setMessages((current) => {
        const next = [...current, message].slice(-80);
        persistMessages(next);
        return next;
      });

      channelRef.current?.postMessage({ type: "chat", from: userId, message } satisfies RoomPacket);
    },
    [persistMessages, userId],
  );

  return {
    messages,
    peers,
    sendMessage,
    userId,
    onlineCount: peers.length + 1,
  };
}
