"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster, toast } from "sonner";
import { ShoppingCart, Search, Heart, Star, Sparkles, SlidersHorizontal, SunMedium, Moon, Menu, CheckCircle2, Wand2, Palette, Cpu, Rocket, Zap, ArrowRight, Info, CreditCard, ShieldCheck, Truck, Eye, ChevronLeft, ChevronRight, LayoutGrid, Rows, Percent, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"

/**
 * EUGEN — Demo E‑Commerce Frontstore (sonner + WOW splash + theme switch)
 * Tailwind + shadcn/ui + framer-motion + lucide-react + sonner
 */

// --- Demo data ---------------------------------------------------------------
const words = ["love", "trust", "choose", "prefer"];
const products = [
  { id: "p1", name: "EUGEN Pro Laptop 14", price: 1499, img: "/test1.jpeg", rating: 4.8, tags: ["AI Recommended", "Bestseller"], specs: ["AMD Ryzen 9", "32GB RAM", "2TB NVMe"], color: "#189AB4" },
  { id: "p2", name: "EUGEN Studio Monitor 27", price: 399, img: "/test3.jpg", rating: 4.6, tags: ["Creator Pick"], specs: ["4K IPS", "100% sRGB", "USB-C"], color: "#75E6DA" },
  { id: "p3", name: "EUGEN Mechanical Keyboard", price: 129, img: "/test4.jpg", rating: 4.7, tags: ["New"], specs: ["Hot-swap", "Hall Effect", "Tri-mode"], color: "#05445E" },
  { id: "p4", name: "EUGEN Noise-Cancel Headset", price: 219, img: "/demo/headset-1.jpg", rating: 4.5, tags: ["Work From Anywhere"], specs: ["ANC", "Dual Mic", "40h"], color: "#189AB4" },
  { id: "p5", name: "EUGEN Portable SSD 2TB", price: 179, img: "/demo/ssd-1.jpg", rating: 4.9, tags: ["Ultra Fast"], specs: ["USB 4.0", "3,800MB/s", "IP67"], color: "#75E6DA" },
  { id: "p6", name: "EUGEN Creator Mouse", price: 89, img: "/demo/mouse-1.jpg", rating: 4.4, tags: ["Ergonomic"], specs: ["8K Polling", "MagWheel", "Quiet"], color: "#05445E" },
];

const TOTAL = products.length; // <= requirement: show total products

// --- Theme system ------------------------------------------------------------
// Two visual themes: "classic" (your palette) and "quartz" (unique aurora look)
// We set CSS vars at runtime to avoid editing globals for now.
const themes = {
  classic: {
    "--brand-1": "#05445E",
    "--brand-2": "#189AB4",
    "--brand-3": "#75E6DA",
    "--bg-accent": "linear-gradient(135deg,#189AB4_30%,#75E6DA)",
  },
  quartz: {
    // Aurora Quartz — unique, premium
    "--brand-1": "oklch(59% 0.11 315)", // amethyst
    "--brand-2": "oklch(72% 0.16 260)", // electric violet
    "--brand-3": "oklch(82% 0.12 180)", // teal glow
    "--bg-accent": "linear-gradient(135deg, oklch(72%_0.16_260), 40%, oklch(82%_0.12_180))",
  },
} as const;

function useThemeCSS(theme: keyof typeof themes) {
  useEffect(() => {
    const vars = themes[theme];
    for (const k in vars) document.documentElement.style.setProperty(k, vars[k as keyof typeof vars]!);
  }, [theme]);
}

// --- Utilities ---------------------------------------------------------------
const currency = (n: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < full ? "fill-yellow-400 stroke-yellow-400" : half && i === full ? "fill-yellow-400/70 stroke-yellow-400/70" : "stroke-muted-foreground"}`} />
      ))}
      <span className="text-xs text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { document.documentElement.classList.toggle("dark"); setDark((d) => !d); }} aria-label="Toggle theme">
      {dark ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}



// --- WOW Splash --------------------------------------------------------------
function IntroSplash({ onEnter, total }: { onEnter: () => void; total: number }) {
  return (
    <WavyBackground backgroundFill="white" speed="slow" waveOpacity={0.28} blur={12}>
      <motion.section
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center overflow-hidden"
      >
        {/* soft aurora wash */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -inset-24 blur-3xl opacity-35"
            style={{
              backgroundImage:
                "radial-gradient(60% 60% at 20% 20%, var(--brand-2), transparent), radial-gradient(60% 60% at 80% 70%, var(--brand-3), transparent)",
            }}
          />
        </div>

        {/* gradient border wrapper */}
        <div className="relative mx-6 w-full max-w-3xl rounded-[28px] p-[1px] bg-[conic-gradient(from_140deg,transparent,rgba(255,255,255,.22)_18%,transparent_40%,rgba(0,0,0,.12)_62%,transparent_82%)]">
          <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-[27px] border bg-background/65 backdrop-blur-xl shadow-2xl"
          >
            <div className="relative p-10 md:p-14">
              {/* kicker */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--brand-2)]" />
                E-commerce, powered by <span className="font-medium text-foreground">EUGEN</span>
              </div>

              {/* headline */}
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Shop smarter —{" "}
                <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand-1),var(--brand-2),var(--brand-3))]">
                  powered by EUGEN
                </span>
              </h1>

              {/* underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="mt-3 h-[2px] w-28 origin-left rounded bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))]"
              />
{/* metrics + value props (high-contrast chips) */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Badge className="rounded-full bg-[var(--brand-2)] text-white hover:bg-[var(--brand-2)]">
                  {total} products in catalog
                </Badge>
                <Badge variant="secondary" className="rounded-full bg-background/90 backdrop-blur border text-foreground">
                  <Cpu className="mr-1.5 h-3.5 w-3.5" /> AI curation
                </Badge>
                <Badge variant="secondary" className="rounded-full bg-background/90 backdrop-blur border text-foreground">
                  <Zap className="mr-1.5 h-3.5 w-3.5" /> Super-fast UX
                </Badge>
                <Badge variant="secondary" className="rounded-full bg-background/90 backdrop-blur border text-foreground">
                  <Rocket className="mr-1.5 h-3.5 w-3.5" /> Demo-ready
                </Badge>
              </div>
              {/* subcopy */}
              <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-prose">
                AI-driven catalog and ranking, instant filters, and a premium UI designed for real shopping experiences
                and slick demos.
              </p>

              

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="rounded-2xl" onClick={onEnter}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Enter the store
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() =>
                    toast.message("Tip: Try the Aurora Quartz theme from the palette in the top bar.")
                  }
                >
                  <Info className="mr-2 h-4 w-4" />
                  How EUGEN helps
                </Button>
              </div>
            </div>

            {/* bottom shimmer */}
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(60%_40%_at_50%_0%,var(--brand-2)/34%,transparent)]" />
          </motion.div>
        </div>
      </motion.section>
    </WavyBackground>
  );
}

// --- Layout ------------------------------------------------------------------
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(2);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
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
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={[
        "w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:saturate-150 transition-shadow",
        scrolled ? "shadow-[0_6px_24px_-12px_rgba(0,0,0,.25)]" : "shadow-none",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Browse</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 grid gap-2">
                  {"Laptops, Monitors, Audio, Storage, Accessories".split(", ").map((c) => (
                    <Button key={c} asChild variant="ghost" className="justify-start">
                      <Link href="#catalog">{c}</Link>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="group flex items-center gap-2">
              <div className="grid h-7 w-7 place-content-center rounded-xl bg-[var(--brand-2)] ring-2 ring-black/5 dark:ring-white/10">
                <Sparkles className="h-4 w-4 text-white drop-shadow" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="transition-colors group-hover:text-foreground">EUGEN</span>{" "}
                <span className="text-muted-foreground">Store</span>
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-2">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                className="pl-9"
                placeholder='Search products, specs, or collections…  (Press “/”)'
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:text-[var(--brand-2)]"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>

            <Button
              className="relative rounded-full bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))] text-white hover:opacity-90 transition"
              aria-label="Open cart"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart
              {/* count badge (hidden at 0) */}
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-content-center rounded-full bg-background px-1 text-xs font-medium text-foreground ring-1 ring-black/10 dark:ring-white/10">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft gradient glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[720px] rounded-[64px] blur-3xl opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(600px_200px_at_50%_10%,var(--brand-3),transparent 70%), radial-gradient(400px_240px_at_70%_60%,var(--brand-2),transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid items-end md:grid-cols-2 gap-8 md:gap-12">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <Badge variant="secondary" className="mb-3 inline-flex items-center gap-1">
              <Wand2 className="h-3.5 w-3.5" />
              Powered by EUGEN
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Tech people <FlipWords words={words} />
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-3 h-[2px] w-32 origin-left rounded bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))]"
            />

            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-prose">
              A modern e-commerce store — with AI curation by EUGEN. Shop the best laptops, displays, audio, and
              accessories with smarter ranking, instant filtering, and a premium checkout-ready UI.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))] text-white hover:opacity-90"
              >
                <Link href="#catalog">Shop all products</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl">
                <Link href="#how-it-works">What EUGEN adds</Link>
              </Button>
            </div>
          </motion.div>

          {/* RIGHT — perfectly bottom-aligned image */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className=""
          >
            <Image
              src="/people.png"
              alt="People shopping illustration"
              width={700}
              height={600}
              className="object-contain w-full h-auto translate-y-[6px]"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
function FiltersSheet({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[380px]">
        <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
        <div className="mt-6 grid gap-6">
          <div>
            <div className="text-sm font-medium mb-2">Category</div>
            <div className="flex flex-wrap gap-2">
              {"All,Laptops,Monitors,Audio,Storage,Accessories".split(",").map((c) => (
                <Toggle key={c} aria-label={c} className="rounded-full" pressed={c === "All"}>{c}</Toggle>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Price</div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Input type="number" placeholder="Min" className="w-24" />
              <span>—</span>
              <Input type="number" placeholder="Max" className="w-24" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Badges</div>
            <div className="flex flex-wrap gap-2">
              {"AI Recommended,Bestseller,New,Creator Pick,Ergonomic,Ultra Fast".split(",").map((b) => (
                <Badge key={b} variant="secondary" className="rounded-full">{b}</Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProductCard({ p }: { p: (typeof products)[number] }) {
  return (
    <Card className="group overflow-hidden rounded-3xl border bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="p-0">
        <div className="relative aspect-square ">
          {/* image sits on a neutral bg so white product shots still read */}
          <Image
            src={p.img}
            alt={p.name}
            fill
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {/* high-contrast tags visible on light shots */}
          <div className="absolute left-3 top-3 flex gap-2">
            {p.tags.slice(0, 2).map((t) => (
              <Badge
                key={t}
                className="rounded-full bg-neutral-900/85 text-white shadow-sm ring-1 ring-black/10
                           dark:bg-white/85 dark:text-black dark:ring-white/10"
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight tracking-tight line-clamp-1">{p.name}</h3>
            <div className="mt-1 text-sm text-muted-foreground line-clamp-1">{p.specs.join(" • ")}</div>
          </div>
          <div className="shrink-0 text-right font-semibold">{currency(p.price)}</div>
        </div>
        <div className="mt-2"><Stars value={p.rating} /></div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Quick view
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[720px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {p.name}
                <Badge style={{ backgroundColor: p.color }} className="text-white">In stock</Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden border bg-muted/40">
                <Image src={p.img} alt={p.name} fill className="object-contain p-3" />
              </div>
              <div>
                <div className="text-2xl font-bold">{currency(p.price)}</div>
                <div className="mt-2"><Stars value={p.rating} /></div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Premium materials, reliable performance, and EUGEN-grade curation.
                </p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {p.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-3">
                  <Button className="rounded-xl">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to cart
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => toast.success(`${p.name} added to wishlist`)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="icon" className="rounded-xl">
          <Heart className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function Catalog() {
  const featured = useMemo(() => products.slice(0, 6), []);

  return (
    <section id="catalog" className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Trending  
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))]"> right now</span>
            </h2>
            <p className="text-muted-foreground">Showing {featured.length} of {TOTAL} results • Curated by EUGEN</p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2">
            {/* Sort (optical) */}
            <Select defaultValue="popular">
              <SelectTrigger className="w-[160px] rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="new">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>

            {/* View toggle (optical) */}
            <div className="hidden sm:flex items-center gap-1 rounded-xl border p-1">
              <Toggle size="sm" aria-label="Grid view" className="rounded-lg data-[state=on]:bg-[var(--brand-3)]/20" pressed>
                <LayoutGrid className="h-4 w-4" />
              </Toggle>
              <Toggle size="sm" aria-label="List view" className="rounded-lg data-[state=on]:bg-[var(--brand-3)]/20">
                <Rows className="h-4 w-4" />
              </Toggle>
            </div>

            {/* Filters button (visual only) */}
            <Button variant="outline" className="rounded-xl">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Quick filters (chips, scroll on mobile) */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["All", "Laptops", "Monitors", "Audio", "Storage", "Accessories", "Peripherals", "Smartphones", "Tablets"].map((c) => (
            <Button key={c} variant={c === "All" ? "default" : "secondary"} className="rounded-full h-8 px-3">
              {c}
            </Button>
          ))}
          
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </motion.div>

        {/* Pagination (optical) */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page 1 of 5</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button className="rounded-xl" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}



function SaleCarousel() {
  const sale = useMemo(
    () =>
      products.slice(0, 10).map((p) => {
        const off = Math.floor(Math.random() * 30) + 10; // 10–40%
        const old = Math.round((p.price * 100) / (100 - off));
        return { ...p, off, old };
      }),
    []
  );

  return (
    <section id="on-sale" className="py-12 md:py-16 bg-gradient-to-b from-transparent to-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              On sale <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))]">right now</span>
            </h2>
            <p className="text-muted-foreground">Hand-picked deals. Best prices guaranteed. This is your chance to buy best products at unbeatable prices.</p>
          </div>
        </div>

        <Carousel
        
          plugins={[
            Autoplay({ delay: 4000, stopOnInteraction: true }),
          ]}
          opts={{ align: "start", loop: true }}
          data-embla
          className="relative"
        >
          {/* slightly larger gutters */}
          <CarouselContent className="-ml-6 pb-2">  {/* small bottom pad */}
  {sale.map((p) => (
    <CarouselItem
      key={p.id}
      className="pl-6 basis-full sm:basis-3/4 lg:basis-1/2 xl:basis-2/5"
    >
      <Card className="group h-full flex flex-col overflow-hidden rounded-3xl border bg-card/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        {/* image block */}
        <div className="relative aspect-[4/3] bg-white dark:bg-white border-b">
          <Image
            src={p.img}
            alt={p.name}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {p.tags?.[0] && (
            <div className="absolute right-4 top-4 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur">
              {p.tags[0]}
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <h3 className="font-semibold leading-tight line-clamp-1">{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {p.specs.join(" • ")}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">{currency(p.price)}</span>
                <span className="text-xs text-muted-foreground line-through">
                  {currency(p.old)}
                </span>
              </div>
              <span className="inline-flex items-center rounded-full bg-[var(--brand-2)]/10 text-[var(--brand-2)] px-2 py-0.5 text-xs font-medium">
                −{p.off}%
              </span>
            </div>
            <Stars value={p.rating} />
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            You save {currency(p.old - p.price)}
          </div>
        </CardContent>

        {/* push footer to the bottom of the card */}
        <CardFooter className="p-5 pt-0 mt-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to cart
              </Button>
            </DialogTrigger>
            {/* …dialog unchanged… */}
          </Dialog>
        </CardFooter>
      </Card>
    </CarouselItem>
  ))}
</CarouselContent>
          {/* arrows */}
          <CarouselPrevious className="left-0 -translate-x-1 rounded-full" />
          <CarouselNext className="right-0 translate-x-1 rounded-full" />
        </Carousel>
      </div>
    </section>
  );
}

// AnnouncementBar.tsx
function AnnouncementBar() {
  return (
    <div className="w-full h-18 bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))] text-white">
      <div className="mx-auto max-w-7xl px-4 flex h-full items-center justify-center text-sm">
        🎉 48-hour flash sale: free express shipping over 50€ —{" "}
        <span className="ml-1 font-semibold underline">Shop now</span>
      </div>
    </div>
  );
}
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-10 border-t bg-gradient-to-b from-transparent to-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 3 equal columns for optical balance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center text-sm text-muted-foreground gap-4">
          
          {/* left: brand */}
          <div className="flex justify-center sm:justify-start items-center gap-2">
            <div
              className="h-6 w-6 rounded-lg"
              style={{
                backgroundImage:
                  "linear-gradient(135deg,var(--brand-1),var(--brand-2)_60%,var(--brand-3))",
              }}
            />
            <span>© {year} EUGEN — Demo Store</span>
          </div>

          {/* middle: nav links (centered always) */}
          <nav className="flex justify-center items-center gap-5">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Imprint</Link>
          </nav>

          {/* right: socials */}
          <div className="flex justify-center sm:justify-end items-center gap-4">
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-4 w-4 hover:text-foreground transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-4 w-4 hover:text-foreground transition-colors" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4 hover:text-foreground transition-colors" />
            </Link>
            <Link href="#" aria-label="YouTube">
              <Youtube className="h-4 w-4 hover:text-foreground transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
function TrustStrip() {
  return (
    <div className="border-y bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="flex items-center gap-2"><Truck className="h-4 w-4"/><span>Free shipping over 50€</span></div>
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/><span>30-day returns</span></div>
        <div className="flex items-center gap-2"><CreditCard className="h-4 w-4"/><span>Secure checkout</span></div>
        <div className="flex items-center gap-2"><Percent className="h-4 w-4"/><span>Price match</span></div>
      </div>
    </div>
  );
}

function ReviewsStrip() {
  const items = [
    { name: "Lea M.", text: "Super fast shipping and the keyboard is unreal.", rating: 5 },
    { name: "Tobias R.", text: "Great curation — picked exactly what I needed.", rating: 5 },
    { name: "Nina K.", text: "Return was simple. Will buy again.", rating: 4.5 },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-transparent relative overflow-hidden">
      {/* soft background glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[360px] w-[640px] rounded-[64px] blur-3xl opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(400px_200px_at_50%_20%,var(--brand-2),transparent 70%), radial-gradient(300px_200px_at_70%_70%,var(--brand-3),transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          What{" "}
          <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))]">
            customers say
          </span>
        </h2>
        <p className="mt-1 text-muted-foreground">
          Real feedback from our community of tech enthusiasts.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((r, i) => (
            <Card
              key={i}
              className="rounded-3xl border bg-card/60 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Stars value={r.rating} />
                  <Badge variant="secondary" className="rounded-full text-xs">
                    Verified
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">{r.text}</p>
                <p className="mt-4 text-xs text-muted-foreground">— {r.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
function FAQ() {
  const faqs = [
    { q: "When will my order ship?", a: "Orders placed before 16:00 ship the same day. Delivery within 1–3 business days." },
    { q: "What’s the return policy?", a: "30-day returns. A free return label is included in every package." },
    { q: "Is there a warranty?", a: "All EUGEN products include a 2-year manufacturer warranty." },
  ];

  return (
    <section id="faq" className="py-14 md:py-20 bg-gradient-to-b from-transparent to-muted/40 relative overflow-hidden">
      {/* soft brand glow */}
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-[360px] w-[640px] rounded-[64px] blur-3xl opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(400px_200px_at_50%_80%,var(--brand-3),transparent 70%), radial-gradient(300px_200px_at_60%_40%,var(--brand-2),transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          Frequently asked{" "}
          <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))]">
            questions
          </span>
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Everything you need to know before placing an order.
        </p>

        <div className="mt-10 divide-y divide-border/60 rounded-3xl border bg-card/60 backdrop-blur-sm">
          {faqs.map((f, i) => (
            <details key={i} className="group open:bg-card/80 transition">
              <summary className="cursor-pointer px-6 py-5 flex items-center justify-between font-medium text-foreground/90">
                {f.q}
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-90 text-muted-foreground" />
              </summary>
              <div className="px-6 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />
      <Navbar /> {/* becomes a normal block, not sticky/fixed */}
    </div>
  );
}
export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [entered, setEntered] = useState(false); // splash -> store
  const [theme, setTheme] = useState<keyof typeof themes>("quartz"); // default to the unique theme

  useThemeCSS(theme);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <AnimatePresence>{!entered && <IntroSplash onEnter={() => setEntered(true)} total={TOTAL} />}</AnimatePresence>

        {entered && (
          <>
          <Header />
            <Hero />
            <TrustStrip/>
            <Catalog />
            <SaleCarousel />
            <ReviewsStrip/>
            <FAQ/>
            <Footer />
          </>
        )}

        <FiltersSheet open={sheetOpen} setOpen={setSheetOpen} />
        <Toaster richColors closeButton position="top-center" />
      </div>
    </TooltipProvider>
  );
}