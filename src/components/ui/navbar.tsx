"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Heart,
  Menu,
  Search,
  Sparkles,
  SunMedium,
  Moon,
  X,
  ArrowRight,
} from "lucide-react";
import { CartSheet } from "@/components/cart-sheet";
import { cn } from "@/lib/utils";
import { products, currency } from "@/lib/product";
import { motion, AnimatePresence } from "framer-motion";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-secondary transition-colors"
      onClick={() => {
        document.documentElement.classList.toggle("dark");
        setDark((d) => !d);
      }}
      aria-label="Toggle theme"
    >
      {dark ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export function StoreNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          searchRef.current?.focus();
        }
      }
      if (e.key === "Escape") {
        searchRef.current?.blur();
        setIsFocused(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = query.trim();
    setIsFocused(false);
    searchRef.current?.blur();

    if (!q) {
      router.push("/search");
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  // Filter products for preview
  const previewResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 3);
  }, [query]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 py-4",
        scrolled ? "pt-2" : "pt-4"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-full border transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-lg shadow-black/5"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Browse</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 grid gap-2">
                  {"Laptops, Monitors, Audio, Storage, Accessories"
                    .split(", ")
                    .map((c) => (
                      <Button
                        key={c}
                        asChild
                        variant="ghost"
                        className="justify-start rounded-xl"
                      >
                        <Link href={`/search?q=${c}`}>{c}</Link>
                      </Button>
                    ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="group flex items-center gap-2">
              <div className="grid h-8 w-8 place-content-center rounded-xl bg-gradient-to-br from-[var(--brand-1)] to-[var(--brand-2)] text-white shadow-md transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                EUGEN
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
                <Link href="/search?q=Laptops">Laptops</Link>
              </Button>
              <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
                <Link href="/search?q=Audio">Audio</Link>
              </Button>
              <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
                <Link href="/search">All</Link>
              </Button>
            </nav>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md items-center gap-2 mx-4 relative">
            <form className="relative w-full group" onSubmit={handleSearchSubmit}>
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                ref={searchRef}
                className="pl-9 rounded-full bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-primary/20 transition-all"
                placeholder="Search..."
                aria-label="Search products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicks
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); searchRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </form>

            {/* Search Preview Dropdown */}
            <AnimatePresence>
              {isFocused && query.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden p-2"
                >
                  {previewResults.length > 0 ? (
                    <div className="grid gap-1">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Products
                      </div>
                      {previewResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="flex items-center gap-3 rounded-xl p-2 hover:bg-secondary/50 transition-colors group"
                        >
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-secondary/30 border border-border/50">
                            <Image
                              src={product.img}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {currency(product.price)}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </Link>
                      ))}
                      <div className="mt-2 border-t border-border/50 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between text-xs text-muted-foreground hover:text-primary"
                          onClick={() => handleSearchSubmit()}
                        >
                          View all results for "{query}"
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No products found for "{query}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <div className="md:hidden">
              {/* Mobile Search Trigger could go here */}
            </div>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>

            <div className="ml-1">
              <CartSheet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
