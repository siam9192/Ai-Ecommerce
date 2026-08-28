"use client";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidBot, BiUser } from "react-icons/bi";
import { RiGeminiLine, RiSendPlane2Fill } from "react-icons/ri";
import {
  IoClose,
  IoCopyOutline,
  IoRefresh,
  IoMicOutline,
} from "react-icons/io5";
import { HiSparkles } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { setAiOpen } from "@/redux/features/appState-slice";

interface ChatMessage {
  role: "AI" | "Human";
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    role: "AI",
    content: "Hello! 👋 I'm your AI Assistant. How can I help you today?",
  },
];

const suggestions = [
  "What can you help me with?",
  "Explain this to me",
  "Give me some recommendations",
];

function AiBox() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const current = bottomRef.current;
    if (current) {
      current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const text = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "Human",
        content: text,
      },
    ]);

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "AI",
          content:
            "I'd be happy to help with that. Let me think about it for you.",
        },
      ]);

      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xl">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[130px]" />

      {/* AI Window */}
      <div className="relative flex h-[720px] w-full max-w-4xl flex-col overflow-hidden rounded-[30px] bg-[#0b0b0f] shadow-[0_30px_100px_rgba(0,0,0,0.75)]">
        {/* ================= HEADER ================= */}

        <header className="relative flex items-center justify-between px-7 py-5">
          {/* subtle header glow */}
          <div className="pointer-events-none absolute left-0 top-0 h-32 w-80 bg-primary/[0.06] blur-[70px]" />

          <div className="relative flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg shadow-primary/10">
              <RiGeminiLine size={26} className="text-primary" />

              <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-semibold tracking-tight text-white">
                  AI Assistant
                </h1>

                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-primary">
                  Beta
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-emerald-400">Online</span>

                <span className="text-gray-700">•</span>

                <span className="text-xs text-gray-600">Powered by Gemini</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center gap-1">
            <button
              className="rounded-xl p-2.5 text-gray-600 transition-all hover:bg-white/[0.04] hover:text-gray-300"
              title="New conversation"
            >
              <IoRefresh size={18} />
            </button>

            <button
              onClick={() => dispatch(setAiOpen(false))}
              className="rounded-xl p-2.5 text-gray-600 transition-all hover:bg-white/[0.04] hover:text-white"
              title="Close"
            >
              <IoClose size={22} />
            </button>
          </div>
        </header>

        {/* ================= CHAT ================= */}

        <main className="flex-1 overflow-y-auto px-7 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {/* Welcome */}
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-[26px] bg-primary/20 blur-2xl" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-primary/20 to-purple-500/10 shadow-2xl shadow-primary/10">
                  <HiSparkles size={34} className="text-primary" />
                </div>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-white">
                How can I help?
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                Ask a question, get recommendations, explain something
                complicated, or just start a conversation.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="mx-auto max-w-3xl space-y-8">
            {messages.map((message, index) => {
              const isAI = message.role === "AI";

              return (
                <div
                  key={index}
                  className={`group flex gap-4 ${
                    isAI ? "items-start" : "flex-row-reverse items-start"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isAI
                        ? "bg-primary/10 text-primary"
                        : "bg-white/[0.07] text-gray-400"
                    }`}
                  >
                    {isAI ? <BiSolidBot size={19} /> : <BiUser size={18} />}
                  </div>

                  {/* Content */}
                  <div className={`max-w-[75%] ${!isAI ? "text-right" : ""}`}>
                    <div
                      className={`mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-700 ${
                        !isAI ? "justify-end" : ""
                      }`}
                    >
                      <span>{isAI ? "AI Assistant" : "You"}</span>

                      <span>•</span>

                      <span>Just now</span>
                    </div>

                    <div
                      className={`px-5 py-3.5 text-[13px] leading-6 ${
                        isAI
                          ? "rounded-2xl rounded-tl-md bg-white/[0.045] text-gray-300 shadow-lg shadow-black/10"
                          : "rounded-2xl rounded-tr-md bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/10"
                      }`}
                    >
                      {message.content}
                    </div>

                    {/* Actions */}
                    {isAI && (
                      <div className="mt-2 flex gap-1 opacity-0 transition-all group-hover:opacity-100">
                        <button className="rounded-lg p-1.5 text-gray-700 hover:bg-white/[0.04] hover:text-gray-400">
                          <IoCopyOutline size={14} />
                        </button>

                        <button className="rounded-lg p-1.5 text-gray-700 hover:bg-white/[0.04] hover:text-gray-400">
                          <IoRefresh size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing */}
            {isTyping && (
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BiSolidBot size={19} />
                </div>

                <div className="rounded-2xl rounded-tl-md bg-white/[0.045] px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* ================= INPUT ================= */}

        <footer className="px-7 pb-6 pt-3">
          {/* Suggestions */}
          <div className="mx-auto mb-4 flex max-w-3xl gap-2 overflow-x-auto scrollbar-none">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="shrink-0 rounded-full bg-white/[0.035] px-4 py-2 text-[11px] text-gray-500 transition-all hover:bg-primary/[0.08] hover:text-gray-300"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input container */}
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[22px] bg-white/[0.045] p-2 shadow-2xl shadow-black/20 transition-all focus-within:bg-white/[0.06]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask AI Assistant anything..."
                rows={2}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-6 text-gray-200 outline-none placeholder:text-gray-600"
              />

              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-2">
                  <button className="rounded-xl p-2 text-gray-600 transition hover:bg-white/[0.05] hover:text-gray-300">
                    <IoMicOutline size={18} />
                  </button>

                  <span className="text-[10px] text-gray-700">
                    AI may occasionally make mistakes
                  </span>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:scale-100"
                >
                  <RiSendPlane2Fill size={17} />
                </button>
              </div>
            </div>

            <p className="mt-2 text-center text-[10px] text-gray-700">
              Enter to send · Shift + Enter for new line
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AiBox;
