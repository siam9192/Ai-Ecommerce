"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiSolidBot, BiUser } from "react-icons/bi";
import { RiGeminiLine, RiSendPlane2Fill } from "react-icons/ri";
import {
  IoClose,
  IoCopyOutline,
  IoRefresh,
  IoMicOutline,
} from "react-icons/io5";
import { HiSparkles } from "react-icons/hi";
import {
  setAiOpen,
  setAiSearchResults,
  toggleStateUpdate,
} from "@/redux/features/appState-slice";
import { aiAsk, type ChatMessage } from "@/api-services/ai.api.services";
import { logout } from "@/api-services/auth.api.services";
import type { AIActions, ProductResponse } from "@/types/ai.type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/hooks/use-current-user";

interface DisplayMessage extends ChatMessage {
  products?: ProductSummary[];
}

type ProductSummary = Pick<
  ProductResponse,
  "id" | "name" | "slug" | "main_price" | "available_stock"
>;

interface SpeechRecognitionResultEvent extends Event {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function isProductSummary(value: unknown): value is ProductSummary {
  if (typeof value !== "object" || value === null) return false;
  const product = value as Record<string, unknown>;
  return (
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.slug === "string" &&
    typeof product.main_price === "number" &&
    typeof product.available_stock === "number"
  );
}

function isDisplayMessage(value: unknown): value is DisplayMessage {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    (message.products === undefined ||
      (Array.isArray(message.products) &&
        message.products.every(isProductSummary)))
  );
}

const initialMessages: DisplayMessage[] = [
  {
    role: "assistant",
    content: "Hello! 👋 I'm your AI Assistant. How can I help you today?",
  },
];

const suggestions = [
  "What can you help me with?",
  "Explain this to me",
  "Give me some recommendations",
];

function AiBox() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);
  const [uiError, setUiError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { refetch: refetchCurrentUser } = useCurrentUser();

  const clientState = useAppSelector((state) => state.appState);

  useEffect(
    () => () => {
      const recognition = recognitionRef.current;
      if (!recognition) return;

      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    },
    [],
  );

  // Load chat history
  useEffect(() => {
    try {
      const storedHistory = sessionStorage.getItem("chat_history");

      if (storedHistory) {
        const history: unknown = JSON.parse(storedHistory);

        if (Array.isArray(history) && history.length > 0 && history.every(isDisplayMessage)) {
          setMessages(history);
        } else {
          setMessages(initialMessages);
        }
      } else {
        setMessages(initialMessages);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      try {
        sessionStorage.removeItem("chat_history");
      } catch (storageError) {
        console.error("Failed to clear invalid chat history:", storageError);
      }
      setMessages(initialMessages);
    } finally {
      setHasLoadedHistory(true);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (!hasLoadedHistory || messages.length === 0) return;

    try {
      sessionStorage.setItem("chat_history", JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history:", error);
      setUiError("Chat history could not be saved in this browser.");
    }
  }, [messages, hasLoadedHistory]);

  // Scroll to bottom
  useEffect(() => {
    if (!hasLoadedHistory) return;

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, hasLoadedHistory]);

  const processActions = async (actions: AIActions) => {
    if (actions.client_logout) {
      await logout();
      await refetchCurrentUser();
    }

    const route = actions.client_navigate_to;
    let target: URL | undefined;
    if (route) {
      target = new URL(route, window.location.origin);
    }

    const searchResults = actions.product_ai_search_results ?? [];
    const isAiSearchRoute =
      target?.origin === window.location.origin &&
      target.pathname.replace(/\/+$/, "") === "/ai-search";

    if (searchResults.length > 0 || isAiSearchRoute) {
      dispatch(setAiSearchResults(searchResults));
    }

    if (target?.origin === window.location.origin) {
      router.push(`${target.pathname}${target.search}${target.hash}`);
    } else if (searchResults.length > 0) {
      router.push("/ai-search");
    }

    if (
      actions.cart_update ||
      actions.order_update ||
      actions.product_update ||
      actions.user_update
    ) {
      dispatch(toggleStateUpdate());
    }

  
  };

  const sendMessage = async (
    messageText: string,
    conversation: DisplayMessage[] = messages,
  ) => {
    const text = messageText.trim();
    if (!text || isTyping) return;

    setMessages((previous) => [...previous, { role: "user", content: text }]);
    setInput("");
    setUiError("");
    setIsTyping(true);

    try {
      const response = await aiAsk({
        message: text,
        chat_history: conversation
          .filter((message) => message.content !== initialMessages[0].content)
          .map(({ role, content }) => ({ role, content })),
        client_state: {
          current_path: window.location.pathname,
          featured_product_ids: clientState.featured_product_ids,
          shop_product_ids: clientState.shop_product_ids,
          ai_search_product_ids: clientState.ai_search_product_ids,
          customer_order_ids: clientState.customer_order_ids,
          customer_ids: clientState.customer_ids,
          order_ids: clientState.order_ids,
          product_ids: clientState.product_ids,
          cart_item_ids: clientState.cart_item_ids,
          wishlist_item_ids: clientState.wishlist_item_ids,
        },
      });
      await processActions(response.actions);
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.message,
          products: (response.actions.product_ai_search_results ?? []).map(
            ({ id, name, slug, main_price, available_stock }) => ({
              id,
              name,
              slug,
              main_price,
              available_stock,
            }),
          ),
        },
      ]);
    } catch (error) {
      console.error("AI request failed:", error);
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I couldn't complete that request. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => void sendMessage(input);

  const handleRegenerate = (messageIndex: number) => {
    let userIndex = messageIndex - 1;
    while (userIndex >= 0 && messages[userIndex].role !== "user") {
      userIndex -= 1;
    }
    if (userIndex < 0) return;

    const retryText = messages[userIndex].content;
    const precedingMessages = messages.slice(0, userIndex);
    setMessages(precedingMessages);
    void sendMessage(retryText, precedingMessages);
  };

  const handleNewConversation = () => {
    if (isTyping) return;
    setMessages(initialMessages);
    setInput("");
    setUiError("");
    try {
      sessionStorage.removeItem("chat_history");
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      setUiError("The conversation was reset, but saved history could not be cleared.");
    }
  };

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessage(index);
      window.setTimeout(() => setCopiedMessage(null), 1500);
    } catch (error) {
      console.error("Failed to copy AI response:", error);
      setUiError("Could not copy the response to the clipboard.");
    }
  };

  const handleVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setUiError("Voice input is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setInput((previous) => `${previous}${previous ? " " : ""}${transcript}`);
      }
    };
    recognition.onerror = () => {
      setUiError("Voice input failed. Please check microphone permissions and try again.");
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setUiError("");

    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error("Failed to start voice input:", error);
      setUiError("Could not start voice input.");
    }
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-10 sm:right-5">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[90vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[110px] sm:h-[520px] sm:blur-[130px]" />

      {/* AI Window */}
      <div className="relative flex h-[min(82vh,720px)] w-[calc(100vw-1.5rem)] max-w-[560px] flex-col overflow-hidden rounded-[24px] bg-[#0b0b0f] shadow-[0_30px_100px_rgba(0,0,0,0.75)] sm:max-w-[520px] sm:rounded-[30px] md:max-w-[560px]">
        {/* ================= HEADER ================= */}

        <header className="relative flex items-center justify-between px-4 py-4 sm:px-7 sm:py-5">
          {/* subtle header glow */}
          <div className="pointer-events-none absolute left-0 top-0 h-32 w-80 bg-primary/[0.06] blur-[70px]" />

          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg shadow-primary/10 sm:h-12 sm:w-12">
              <RiGeminiLine size={22} className="text-primary sm:size-[26px]" />

              <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40 sm:h-3 sm:w-3" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-tight text-white sm:text-[17px]">
                  AI Assistant
                </h1>

                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[8px] font-medium uppercase tracking-widest text-primary sm:text-[9px]">
                  Beta
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 sm:text-xs">
                  Online
                </span>

                <span className="text-gray-700">•</span>

                <span className="text-[10px] text-gray-600 sm:text-xs">
                  Powered by Gemini
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center gap-1">
            <button
              onClick={handleNewConversation}
              disabled={isTyping}
              className="rounded-xl p-2 text-gray-600 transition-all hover:bg-white/[0.04] hover:text-gray-300 sm:p-2.5"
              title="New conversation"
              aria-label="Start a new conversation"
            >
              <IoRefresh size={16} className="sm:size-[18px]" />
            </button>

            <button
              onClick={() => dispatch(setAiOpen(false))}
              className="rounded-xl p-2 text-gray-600 transition-all hover:bg-white/[0.04] hover:text-white sm:p-2.5"
              title="Close"
            >
              <IoClose size={18} className="sm:size-[22px]" />
            </button>
          </div>
        </header>

        {/* ================= CHAT ================= */}

        <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 sm:px-7 sm:py-5">
          {uiError && (
            <p
              className="mx-auto mb-4 max-w-3xl rounded-xl bg-red-500/10 px-4 py-2 text-xs text-red-300"
              role="alert"
            >
              {uiError}
            </p>
          )}

          {/* Welcome */}
          {messages.length === 1 &&
            messages[0]?.content === initialMessages[0].content && (
            <div className="flex flex-col items-center justify-center py-8 text-center sm:py-10">
              <div className="relative mb-5 sm:mb-6">
                <div className="absolute inset-0 rounded-[26px] bg-primary/20 blur-2xl" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-[26px] bg-gradient-to-br from-primary/20 to-purple-500/10 shadow-2xl shadow-primary/10 sm:h-20 sm:w-20">
                  <HiSparkles
                    size={28}
                    className="text-primary sm:size-[34px]"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                How can I help?
              </h2>

              <p className="mt-3 max-w-md text-xs leading-6 text-gray-500 sm:text-sm">
                Ask a question, get recommendations, explain something
                complicated, or just start a conversation.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
            {messages.map((message, index) => {
              const isAI = message.role === "assistant";

              return (
                <div
                  key={index}
                  className={`group flex gap-3 sm:gap-4 ${
                    isAI ? "items-start" : "flex-row-reverse items-start"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
                      isAI
                        ? "bg-primary/10 text-primary"
                        : "bg-white/[0.07] text-gray-400"
                    }`}
                  >
                    {isAI ? (
                      <BiSolidBot size={16} className="sm:size-[19px]" />
                    ) : (
                      <BiUser size={15} className="sm:size-[18px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`max-w-[80%] sm:max-w-[75%] ${!isAI ? "text-right" : ""}`}
                  >
                    <div
                      className={`mb-2 flex items-center gap-2 text-[9px] uppercase tracking-wider text-gray-700 sm:text-[10px] ${
                        !isAI ? "justify-end" : ""
                      }`}
                    >
                      <span>{isAI ? "AI Assistant" : "You"}</span>
                    </div>

                    <div
                      className={`px-4 py-3 text-[12px] leading-6 sm:px-5 sm:py-3.5 sm:text-[13px] ${
                        isAI
                          ? "rounded-2xl rounded-tl-md bg-white/[0.045] text-gray-300 shadow-lg shadow-black/10"
                          : "rounded-2xl rounded-tr-md bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/10"
                      }`}
                    >
                      {message.content}
                    </div>

                    {message.products && message.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-primary/40 hover:bg-white/[0.06]"
                          >
                            <span className="block text-sm font-medium text-white">
                              {product.name}
                            </span>
                            <span className="mt-1 block text-xs text-gray-400">
                              ${product.main_price.toFixed(2)}
                              {product.available_stock <= 0 && " · Out of stock"}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {isAI && (
                      <div className="mt-2 flex gap-1 opacity-0 transition-all group-hover:opacity-100 group-focus-within:opacity-100">
                        <button
                          onClick={() => void handleCopy(message.content, index)}
                          className="rounded-lg p-1.5 text-gray-700 hover:bg-white/[0.04] hover:text-gray-400"
                          title={copiedMessage === index ? "Copied" : "Copy response"}
                          aria-label={copiedMessage === index ? "Copied response" : "Copy response"}
                        >
                          {copiedMessage === index ? (
                            "Copied"
                          ) : (
                            <IoCopyOutline size={14} />
                          )}
                        </button>

                        <button
                          onClick={() => handleRegenerate(index)}
                          disabled={isTyping}
                          className="rounded-lg p-1.5 text-gray-700 hover:bg-white/[0.04] hover:text-gray-400 disabled:opacity-40"
                          title="Regenerate response"
                          aria-label="Regenerate response"
                        >
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

        <footer className="px-4 pb-4 pt-2 sm:px-7 sm:pb-6 sm:pt-3">
          {/* Suggestions */}
          <div className="mx-auto mb-4 flex max-w-3xl gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="shrink-0 rounded-full bg-white/[0.035] px-3 py-2 text-[10px] text-gray-500 transition-all hover:bg-primary/[0.08] hover:text-gray-300 sm:px-4 sm:text-[11px]"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input container */}
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[18px] bg-white/[0.045] p-2 shadow-2xl shadow-black/20 transition-all focus-within:bg-white/[0.06] sm:rounded-[22px]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask AI Assistant anything..."
                rows={2}
                className="w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-gray-200 outline-none placeholder:text-gray-600 sm:px-4 sm:py-3"
              />

              <div className="flex items-center justify-between gap-2 px-1 pb-1 sm:px-2">
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    onClick={handleVoiceInput}
                    disabled={isTyping}
                    title={isListening ? "Stop voice input" : "Use voice input"}
                    aria-label={isListening ? "Stop voice input" : "Use voice input"}
                    className={`rounded-xl p-2 transition hover:bg-white/[0.05] hover:text-gray-300 disabled:opacity-40 ${
                      isListening ? "text-primary" : "text-gray-600"
                    }`}
                  >
                    <IoMicOutline size={16} className="sm:size-[18px]" />
                  </button>

                  <span className="truncate text-[9px] text-gray-700 sm:text-[10px]">
                    AI may occasionally make mistakes
                  </span>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:scale-100"
                >
                  <RiSendPlane2Fill size={17} />
                </button>
              </div>
            </div>

            <p className="mt-2 text-center text-[9px] text-gray-700 sm:text-[10px]">
              Enter to send · Shift + Enter for new line
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AiBox;
