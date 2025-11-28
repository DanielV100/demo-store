"use client";

import { useState, useEffect, Suspense, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StoreNavbar } from "@/components/ui/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ChevronRight,
  Search as SearchIcon,
  Truck,
  ShieldCheck,
  CreditCard,
  LayoutGrid,
  Rows,
  SlidersHorizontal,
  X,
  Star as StarIcon,
  ShoppingCart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// 1. IMPORT DATA from lib (Single Source of Truth)
// Do NOT define "const products = [...]" locally in this file.
import { products, currency, type Product } from "@/lib/product";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

// 2. UPDATE HELPERS
const CATEGORY_BY_ID: Record<string, string> = {
  p1: "Laptops",
  p2: "Monitors",
  p3: "Keyboards",
  p4: "Audio",
  p5: "Storage",
  p6: "Mice",
  // Add mapping for the new IDs so they appear under "Laptops" filter
  p7: "Laptops",
  p8: "Laptops",
  p9: "Laptops",
  p10: "Laptops",
  p11: "Laptops",
  p12: "Laptops",
  p13: "Laptops",
  p14: "Laptops",
};

const CATEGORY_LABELS = [
  "All",
  "Laptops",
  "Monitors",
  "Keyboards",
  "Audio",
  "Storage",
  "Mice",
];

function getCategory(p: Product): string {
  return CATEGORY_BY_ID[p.id] ?? "Other";
}

// Collect all unique tags to show as filter chips
const ALL_TAGS = Array.from(
  new Set(products.flatMap((p) => p.tags ?? []))
).sort();

// --- UI bits -----------------------------------------------------------------

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${i < full
            ? "fill-yellow-400 stroke-yellow-400"
            : half && i === full
              ? "fill-yellow-400/70 stroke-yellow-400/70"
              : "stroke-muted-foreground"
            }`}
        />
      ))}
      <span className="text-xs text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  );
}

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent {...props} />
    </Suspense>
  );
}

function SearchContent({ searchParams }: SearchPageProps) {
  // read q both from props (initial) and from URL for client transitions
  const urlParams = useSearchParams();
  const resolvedParams = use(searchParams);
  const rawQ = urlParams.get("q") ?? resolvedParams?.q ?? "";
  const q = rawQ.toString().trim();
  const term = q.toLowerCase();

  // base search (relevance) – this is the "raw SERP" before filters/sort
  const baseResults: Product[] = useMemo(() => {
    if (!term) return products;
    return products.filter((p) => {
      const haystack = (
        p.name +
        " " +
        (p.tags ?? []).join(" ") +
        " " +
        (p.specs ?? []).join(" ")
      ).toLowerCase();
      return haystack.includes(term);
    });
  }, [term]);

  const total = products.length;
  const hasQuery = q.length > 0;
  const hasBaseResults = baseResults.length > 0;

  // --- Filter + sort state ---------------------------------------------------

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "relevance" | "price_low" | "price_high" | "rating" | "name"
  >("relevance");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  // Reset page when search term or filters change
  useEffect(() => {
    setPage(1);
  }, [
    q,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    selectedTags,
    sortBy,
  ]);

  function toggleTag(tag: string) {
    setSelectedTags((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  }

  function clearAllFilters() {
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(null);
    setSelectedTags([]);
    setSortBy("relevance");
  }

  // --- Apply filters + sort --------------------------------------------------

  const filteredAndSorted = useMemo(() => {
    let list = [...baseResults];

    // Category
    if (selectedCategory !== "All") {
      list = list.filter((p) => getCategory(p) === selectedCategory);
    }

    // Price
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min != null && !Number.isNaN(min)) {
      list = list.filter((p) => p.price >= min);
    }
    if (max != null && !Number.isNaN(max)) {
      list = list.filter((p) => p.price <= max);
    }

    // Rating
    if (minRating != null) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Tags (OR logic: match any selected tag)
    if (selectedTags.length > 0) {
      list = list.filter((p) =>
        (p.tags ?? []).some((t) => selectedTags.includes(t))
      );
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "relevance":
      default:
        // keep base order
        break;
    }

    return list;
  }, [
    baseResults,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    selectedTags,
    sortBy,
  ]);

  const totalFiltered = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pagedResults = filteredAndSorted.slice(
    (pageSafe - 1) * pageSize,
    pageSafe * pageSize
  );

  const hasResults = totalFiltered > 0;

  // --- Render ---------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar - Fixed position handled by component */}
      <StoreNavbar />

      {/* Soft background glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-30 blur-3xl"
        style={{
          backgroundImage:
            "radial-gradient(600px_320px_at_20%_0%,var(--brand-3),transparent 65%), radial-gradient(520px_260px_at_80%_60%,var(--brand-2),transparent 70%)",
        }}
      />

      {/* Main content with top padding to clear fixed navbar */}
      {/* Main content with top padding to clear fixed navbar */}
      <main className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back link + meta */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full px-3"
          >
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to store
            </Link>
          </Button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <SearchIcon className="h-4 w-4 text-[var(--brand-2)]" />
            <span>Search & discovery curated by EUGEN</span>
          </div>
        </div>

        {/* Title + meta */}
        <header className="mb-4 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {hasQuery ? (
              <>
                Results for{" "}
                <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))]">
                  “{q}”
                </span>
              </>
            ) : (
              <>
                Browse{" "}
                <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--brand-2),var(--brand-3))]">
                  all products
                </span>
              </>
            )}
          </h1>

          <p className="text-sm text-muted-foreground">
            {hasBaseResults ? (
              <>
                Found{" "}
                <span className="font-medium text-foreground">
                  {totalFiltered}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {baseResults.length}
                </span>{" "}
                matches{" "}
                {hasQuery && (
                  <>
                    for <span className="font-medium">“{q}”</span>
                  </>
                )}
                .
              </>
            ) : hasQuery ? (
              <>
                No results found for <span className="font-medium">“{q}”</span>.
                Try adjusting your query or filters.
              </>
            ) : (
              <>Showing all {total} products.</>
            )}
          </p>
        </header>
        <Separator className="mb-4" />

        {/* Trust strip */}
        <div className="mb-6 grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-2xl border bg-card/60 px-3 py-2">
            <Truck className="h-4 w-4 text-[var(--brand-2)]" />
            <span>Free shipping over 50€</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border bg-card/60 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-[var(--brand-3)]" />
            <span>30-day returns & 2-year warranty</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border bg-card/60 px-3 py-2">
            <CreditCard className="h-4 w-4 text-[var(--brand-2)]" />
            <span>Secure checkout & multiple providers</span>
          </div>
        </div>

        {/* Layout: filters + results */}
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar filters */}
          <aside className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full px-2 text-xs"
                onClick={clearAllFilters}
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            </div>

            <Accordion type="multiple" className="w-full">
              {/* Category */}
              <AccordionItem value="category" className="border-b-0">
                <AccordionTrigger className="py-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  CATEGORY
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2">
                    {CATEGORY_LABELS.map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full border border-primary/20 flex items-center justify-center cursor-pointer transition-colors",
                            selectedCategory === cat ? "bg-primary border-primary" : "hover:border-primary"
                          )}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {selectedCategory === cat && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                        </div>
                        <span
                          className="text-sm cursor-pointer hover:text-primary transition-colors"
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Price range */}
              <AccordionItem value="price" className="border-b-0">
                <AccordionTrigger className="py-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  PRICE RANGE
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
                    />
                    <span className="text-xs text-muted-foreground">–</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Rating */}
              <AccordionItem value="rating" className="border-b-0">
                <AccordionTrigger className="py-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  RATING
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2">
                    {[4, 4.5].map((r) => (
                      <div key={r} className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full border border-primary/20 flex items-center justify-center cursor-pointer transition-colors",
                            minRating === r ? "bg-primary border-primary" : "hover:border-primary"
                          )}
                          onClick={() => setMinRating((prev) => (prev === r ? null : r))}
                        >
                          {minRating === r && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                        </div>
                        <span
                          className="text-sm cursor-pointer hover:text-primary transition-colors"
                          onClick={() => setMinRating((prev) => (prev === r ? null : r))}
                        >
                          {r.toFixed(1)}+ Stars
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border border-primary/20 flex items-center justify-center cursor-pointer transition-colors",
                          minRating === null ? "bg-primary border-primary" : "hover:border-primary"
                        )}
                        onClick={() => setMinRating(null)}
                      >
                        {minRating === null && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                      </div>
                      <span
                        className="text-sm cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setMinRating(null)}
                      >
                        Any
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tags */}
              <AccordionItem value="tags" className="border-b-0">
                <AccordionTrigger className="py-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  HIGHLIGHTS
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_TAGS.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <Toggle
                          key={tag}
                          pressed={active}
                          onPressedChange={() => toggleTag(tag)}
                          className="h-7 rounded-full border px-3 text-xs data-[state=on]:bg-[var(--brand-2)] data-[state=on]:text-white"
                        >
                          {tag}
                        </Toggle>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Active filter summary chips */}
            {(selectedCategory !== "All" ||
              !!minPrice ||
              !!maxPrice ||
              minRating != null ||
              selectedTags.length > 0) && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Active filters
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCategory !== "All" && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
                      >
                        {selectedCategory}
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("All")}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {minPrice && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
                      >
                        Min {currency(Number(minPrice))}
                        <button type="button" onClick={() => setMinPrice("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {maxPrice && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
                      >
                        Max {currency(Number(maxPrice))}
                        <button type="button" onClick={() => setMaxPrice("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {minRating != null && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
                      >
                        {minRating.toFixed(1)}+ stars
                        <button type="button" onClick={() => setMinRating(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
                      >
                        {tag}
                        <button type="button" onClick={() => toggleTag(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </aside>

          {/* Results section */}
          <section className="space-y-4">
            {/* Toolbar: sort + view + result meta */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {pagedResults.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalFiltered}
                </span>{" "}
                filtered results • page {pageSafe} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as typeof sortBy)}
                >
                  <SelectTrigger className="h-8 w-[170px] rounded-xl text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Top rated</SelectItem>
                    <SelectItem value="name">Name A–Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View toggle */}
                <div className="flex items-center gap-1 rounded-xl border p-1">
                  <Toggle
                    size="sm"
                    aria-label="Grid view"
                    pressed={view === "grid"}
                    onPressedChange={() => setView("grid")}
                    className="rounded-lg data-[state=on]:bg-[var(--brand-3)]/20"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    size="sm"
                    aria-label="List view"
                    pressed={view === "list"}
                    onPressedChange={() => setView("list")}
                    className="rounded-lg data-[state=on]:bg-[var(--brand-3)]/20"
                  >
                    <Rows className="h-4 w-4" />
                  </Toggle>
                </div>
              </div>
            </div>

            {/* No results state */}
            {!hasResults && hasQuery && (
              <div className="mt-10 flex flex-col items-center text-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <SearchIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold">No matches found</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Try searching for a product name, a key spec (like “32GB RAM”)
                  or adjust the filters on the left.
                </p>
                <Button asChild className="mt-1 rounded-full" variant="outline">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            )}

            {/* Results list */}
            {hasResults && (
              <>
                {view === "grid" ? (
                  <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {pagedResults.map((p) => (
                      <ProductCardGrid key={p.id} p={p} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pagedResults.map((p) => (
                      <ProductCardList key={p.id} p={p} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Page {pageSafe} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full px-3"
                      disabled={pageSafe <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full px-3"
                      disabled={pageSafe >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

// --- Product cards -----------------------------------------------------------

function ProductCardGrid({ p }: { p: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <Card className="group overflow-hidden rounded-3xl border bg-card/70 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="relative aspect-[4/3] rounded-2xl border bg-white dark:bg-zinc-900/80">
          <Image
            src={p.img}
            alt={p.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {p.tags[0] && (
            <Badge className="absolute left-3 top-3 rounded-full bg-neutral-900/85 text-white shadow-sm ring-1 ring-black/10 dark:bg-white/85 dark:text-black dark:ring-white/10 text-[10px]">
              {p.tags[0]}
            </Badge>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold leading-tight line-clamp-1">
              {p.name}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {p.specs.join(" • ")}
            </p>
          </div>
          <div className="text-sm font-semibold shrink-0">
            {currency(p.price)}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Stars value={p.rating} />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 px-4 pb-4 pt-0">
        <Button asChild size="sm" className="rounded-full h-8 px-3 text-xs">
          <Link href={`/products/${p.id}`}>
            View
            <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full h-8 px-3 text-xs"
          onClick={() => {
            addItem(p);
            toast.success(`${p.name} added to cart`);
          }}
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProductCardList({ p }: { p: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <Card className="group overflow-hidden rounded-3xl border bg-card/70 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row">
        {/* Image - Fixed width on desktop */}
        <div className="relative aspect-[4/3] w-full sm:w-[200px] shrink-0 border-b sm:border-b-0 sm:border-r bg-white dark:bg-zinc-900/80">
          <Image
            src={p.img}
            alt={p.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {p.tags[0] && (
            <Badge className="absolute left-3 top-3 rounded-full bg-neutral-900/85 text-white shadow-sm ring-1 ring-black/10 dark:bg-white/85 dark:text-black dark:ring-white/10 text-[10px]">
              {p.tags[0]}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold leading-tight">
                  {p.name}
                </h2>
                <Stars value={p.rating} />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {p.specs.join(" • ")}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {p.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full px-2 py-0.5 text-[10px]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0 shrink-0">
              <div className="text-lg font-bold text-primary">
                {currency(p.price)}
              </div>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                incl. VAT
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between gap-3">
            <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
              In stock • Ready to ship
            </span>
            <div className="flex gap-2 ml-auto">
              <Button asChild size="sm" variant="ghost" className="rounded-full h-8 px-3 text-xs">
                <Link href={`/products/${p.id}`}>
                  View
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              <Button
                size="sm"
                className="rounded-full h-8 px-4 text-xs"
                onClick={() => {
                  addItem(p);
                  toast.success(`${p.name} added to cart`);
                }}
              >
                <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}