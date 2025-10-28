"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Portal } from "@radix-ui/react-portal";
import { Bot, MessageCircle, Send, Sparkles, Info, Trash2 } from "lucide-react";

type EugenPageContext = {
  route: "home" | "category" | "pdp" | "cart" | "search" | "other";
  category?: string;
  productId?: string;
  productName?: string;
  cartTotal?: number;
  query?: string;
};

type EugenChatMessage = {
  role: "user" | "assistant";
  content: string;
  at: number;
  meta?: any;
};

function useLocalThread(key = "eugen.thread.v1") {
  const [messages, setMessages] = useState<EugenChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(messages));
  }, [key, messages]);
  return {
    messages,
    setMessages,
    reset: () => {
      localStorage.removeItem(key);
    },
  };
}

function useSuggestions(ctx: EugenPageContext) {
  return useMemo(() => {
    switch (ctx.route) {
      case "pdp":
        return [
          `Compare ${ctx.productName ?? "this"} with the next best option`,
          "Is the RAM upgradable? Any gotchas?",
          "Show cheaper alternatives with similar specs",
          "Is there a better monitor pairing for this laptop?",
        ];
      case "category":
        return [
          `Best value in ${ctx.category ?? "this category"}`,
          "Creator picks vs office picks",
          "Help me pick by budget: 700€, 1000€, 1500€",
          "Only USB-C charging models",
        ];
      case "cart":
        return [
          "Optimize my cart for performance/€",
          "Bundle suggestions (dock, case, cable)",
          "Any better GPU/CPU for same price?",
        ];
      case "search":
        return [
          `Refine results for “${ctx.query ?? ""}”`,
          "Filter by weight < 1.4kg and > 12h battery",
          "Top-rated under 1000€",
        ];
      default:
        return [
          "What should I buy for video editing?",
          "Build me a full setup under 2k€",
          "Compare 14” vs 16” for my use",
        ];
    }
  }, [ctx]);
}

export function EugenChatProvider({
  pageContext,
  endpoint = "/api/eugen/chat",
  children,
}: {
  pageContext: EugenPageContext;
  endpoint?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, reset } = useLocalThread();
  const scrollRef = useRef<HTMLDivElement>(null);

  // FAB label varies by context
  const fabLabel = useMemo(() => {
    switch (pageContext.route) {
      case "pdp":
        return "Ask about this product";
      case "category":
        return "Need help choosing?";
      case "cart":
        return "Optimize my cart";
      case "search":
        return "Refine these results";
      default:
        return "Ask EUGEN";
    }
  }, [pageContext.route]);

  // First-time onboarding hint
  const INTRO_KEY = "eugen.intro.v1";
  const [showIntroHint, setShowIntroHint] = useState(false);
  useEffect(() => {
    try {
      const seen = localStorage.getItem(INTRO_KEY);
      if (!seen) {
        const d1 = setTimeout(() => setShowIntroHint(true), 600);
        const d2 = setTimeout(() => setShowIntroHint(false), 10600);
        return () => {
          clearTimeout(d1);
          clearTimeout(d2);
        };
      }
    } catch {
      // ignore
    }
  }, []);
  const dismissIntro = () => {
    setShowIntroHint(false);
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {
      // ignore
    }
  };

  // keyboard: Shift+E toggles, Cmd/Ctrl+/ focuses
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (e.key === "/" && mod) {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => document.getElementById("eugen-input")?.focus(), 0);
      }
      if (e.key.toLowerCase() === "e" && e.shiftKey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // autoscroll on open/new message
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [open, messages.length]);

  // “Popular asks” visibility rules:
  // - Show only when no messages yet AND not loading AND input is empty.
  const suggestions = useSuggestions(pageContext);
  const showSuggestions =
    messages.length === 0 && !loading && (input ?? "").trim().length === 0;

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: EugenChatMessage = {
      role: "user",
      content: trimmed,
      at: Date.now(),
      meta: { ctx: pageContext },
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, thread: [] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // { reply: string }
      const bot: EugenChatMessage = {
        role: "assistant",
        content: data.reply ?? "I’m here! How can I help you decide?",
        at: Date.now(),
      };
      setMessages((prev) => [...prev, bot]);
    } catch {
      toast.error("EUGEN is thinking… but the network failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {children}

      {/* FAB + Intro hint (FAB HIDDEN when chat is open) */}
      {!open && (
        <Portal>
          <div className="fixed inset-0 z-[10060] pointer-events-none">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => {
                      setOpen(true);
                      dismissIntro();
                    }}
                    className="pointer-events-auto fixed bottom-5 right-5 flex items-center gap-2 rounded-full shadow-lg
                               bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))] text-white font-medium px-4 py-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Open EUGEN — Product Advice"
                  >
                    <MessageCircle className="h-5 w-5 sm:hidden" />
                    <Bot className="h-4 w-4 hidden sm:inline" />
                    <span className="hidden sm:inline">{fabLabel}</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>Open EUGEN — Product Advice (⇧E)</TooltipContent>
              </Tooltip>

              {/* Onboarding hint bubble (first-time only) */}
              <AnimatePresence>
                {showIntroHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="pointer-events-auto fixed bottom-20 right-5 bg-background border shadow-md px-3 py-2 rounded-xl text-sm max-w-[240px]"
                  >
                    <div className="font-medium">
                      💬 Meet <span className="text-primary">EUGEN</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      Your digital <b>Product Advisor</b> — ask for tips, comparisons & setups.
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => {
                          setOpen(true);
                          dismissIntro();
                        }}
                      >
                        Open now
                      </Button>
                      <button
                        onClick={dismissIntro}
                        className="text-xs text-muted-foreground underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TooltipProvider>
          </div>
        </Portal>
      )}

      {/* Chat sheet */}
      <Sheet
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) dismissIntro();
        }}
      >
        <SheetContent
          side="right"
          className="z-[10050] p-0 gap-0 border-l flex flex-col w-[88vw] sm:w-[520px] h-dvh overflow-hidden"
        >
          {/* NOTE: shadcn SheetContent already includes its own top-right Close (X).
              We DO NOT render a second one to avoid duplicates. */}
          <SheetHeader className="px-5 pt-5 pb-2">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                EUGEN — Product Advisor
              </SheetTitle>
            
            </div>

            <div className="px-1 pb-1 text-xs text-muted-foreground flex items-center gap-2">
              <Info className="h-3.5 w-3.5" />
              EUGEN uses the current page to tailor answers. No personal data shared without consent.
            </div>
          </SheetHeader>

          {/* “Popular asks” — improved visual & placement.
              - Sits naturally under the header.
              - Collapses as soon as the user types or after first message. */}
          <AnimatePresence initial={false}>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="px-5 pb-3"
              >
                <div className="rounded-2xl border bg-card/60 backdrop-blur p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">Popular asks</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 px-3"
                        onClick={() => {
                          // send and collapse
                          setInput("");
                          sendMessage(q);
                        }}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator />

          {/* Messages */}
          <ScrollArea className="flex-1 px-5" ref={scrollRef as any}>
            <div className="space-y-3 py-6">
              <AnimatePresence initial={false}>
                {messages.length === 0 && !loading && !showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-10 text-muted-foreground text-sm"
                  >
                    <Bot className="mx-auto h-6 w-6 mb-2" />
                    <p>
                      <strong>EUGEN</strong>, your digital <strong>Product Advisor</strong>.
                    </p>
                    <p className="text-xs mt-1">
                      Compare laptops, find best value, or build a setup by budget.
                    </p>
                  </motion.div>
                )}

                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[86%] rounded-2xl border p-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "ml-auto bg-background"
                        : "mr-auto bg-card/70 backdrop-blur"
                    }`}
                  >
                    {m.content}
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mr-auto max-w-[86%] rounded-2xl border p-3 text-sm bg-card/70"
                  >
                    <span className="animate-pulse">EUGEN is typing…</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <Separator />

          {/* Composer with embedded Send button */}
          <div className="p-4 flex items-center gap-2 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex-1"
            >
              <div className="relative">
                <Input
                  id="eugen-input"
                  placeholder="Ask EUGEN… (Cmd+/ to focus)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-xl pr-12"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg"
                  disabled={loading}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Optional: clear-thread icon */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => {
                      reset();
                      toast.message("Thread cleared");
                    }}
                    aria-label="Clear thread"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear thread</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

         
        </SheetContent>
      </Sheet>
    </>
  );
}

/** Optional inline PDP advisor card */
export function EugenInlinePDP({ productName }: { productName?: string }) {
  return (
    <div className="mt-6 rounded-2xl border p-4 bg-card/60 backdrop-blur">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="h-4 w-4" />
        <span className="font-medium">Ask EUGEN about this product</span>
      </div>
      <div className="text-sm text-muted-foreground mb-3">
        Compare {productName ?? "this"} with alternatives, check compatibility, or get bundle tips.
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          "Compare with cheaper option",
          "Is this good for video editing?",
          "What should I bundle with it?",
        ].map((q) => (
          <Badge key={q} variant="secondary" className="rounded-full">
            {q}
          </Badge>
        ))}
      </div>
    </div>
  );
}