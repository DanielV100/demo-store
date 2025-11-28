"use client";

import { useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StoreNavbar } from "@/components/ui/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/product";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  ShieldCheck,
  HelpCircle,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Hero Section v3 (Optimized) ---
function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-[#FDFBF7]">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-1.5 text-sm font-medium text-primary shadow-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              New Arrival
            </div>

            <h1 className="text-6xl font-black tracking-tighter text-foreground sm:text-8xl mb-8 leading-[0.9]">
              Sound <br />
              <span className="text-primary">Redefined.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg font-medium">
              Experience the Sony WH-1000XM5. Industry-leading noise cancellation and exceptional sound quality.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full h-16 px-10 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-105"
                asChild
              >
                <Link href="/products/p3">
                  Buy Now - $349
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-16 px-10 text-lg font-medium border-2 hover:bg-secondary/50"
                asChild
              >
                <Link href="/search">
                  View Collection
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">2 Year Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50 }}
            className="relative lg:h-[800px] w-full flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-[700px]">
              {/* Product Image */}
              <Image
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000"
                alt="Sony WH-1000XM5"
                fill
                className="object-contain drop-shadow-2xl z-10"
                priority
              />

              {/* Floating Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 12 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute top-10 right-10 z-20 bg-white rounded-full h-32 w-32 flex flex-col items-center justify-center shadow-2xl border-4 border-white rotate-12"
              >
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Save</span>
                <span className="text-3xl font-black text-primary">$50</span>
                <span className="text-xs font-medium text-muted-foreground">Limited Time</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Stats Section ---
function StatsSection() {
  return (
    <section className="py-12 border-y border-border/50 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { label: "Happy Customers", value: "10k+", icon: Users },
            { label: "Products", value: "500+", icon: Sparkles },
            { label: "Support", value: "24/7", icon: Clock },
            { label: "Satisfaction", value: "99%", icon: CheckCircle2 },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center">
              <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <dt className="text-3xl font-bold tracking-tight">{stat.value}</dt>
              <dd className="text-sm text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- Trending Section ---
function TrendingSection() {
  const trending = useMemo(() => products.slice(0, 4), []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Trending Now</h2>
            <p className="text-muted-foreground max-w-2xl">
              Top-rated picks from our community of creators and tech enthusiasts.
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:flex group" asChild>
            <Link href="/search?sort=popular">
              View all <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Button variant="ghost" className="w-full group" asChild>
            <Link href="/search?sort=popular">
              View all <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// --- About Section ---
function AboutSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Team working"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
              Our Story
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Empowering creators with the best tools.
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At EUGEN, we believe that great work requires great tools. That's why we scour the globe to find the most innovative, reliable, and beautifully designed electronics for professionals.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Founded in 2024, we've helped over 10,000 creators upgrade their workflow. We're not just a store; we're a community of tech enthusiasts.
            </p>
            <Button variant="outline" className="rounded-full">
              Read More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- FAQ Section ---
function FAQSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Everything you need to know about shopping with EUGEN.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {[
            { q: "How fast is shipping?", a: "We offer free express shipping on all orders over $50. Most orders arrive within 2-3 business days." },
            { q: "What is your return policy?", a: "We have a 30-day return policy. If you're not satisfied with your purchase, you can return it for a full refund, no questions asked." },
            { q: "Do you offer international shipping?", a: "Yes, we ship to over 50 countries worldwide. Shipping rates and times vary by location." },
            { q: "Are the products covered by warranty?", a: "Absolutely. All our products come with a standard 2-year manufacturer warranty." },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

// --- CTA Section ---
function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-24 text-center shadow-2xl sm:px-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to upgrade your workflow?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
            Join thousands of satisfied customers and experience the difference today.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="rounded-full h-12 px-8" asChild>
              <Link href="/search">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Suspense fallback={<div className="h-16 bg-background/60 backdrop-blur" />}>
        <StoreNavbar />
      </Suspense>
      <main>
        <Hero />
        <StatsSection />
        <TrendingSection />
        <AboutSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
