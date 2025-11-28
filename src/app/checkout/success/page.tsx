"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { StoreNavbar } from "@/components/ui/navbar";
import { Footer } from "@/components/footer";

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            <Suspense fallback={<div className="h-16 bg-background/60 backdrop-blur" />}>
                <StoreNavbar />
            </Suspense>
            <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
                <SuccessContent />
            </main>
            <Footer />
        </div>
    );
}

function SuccessContent() {
    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval: any = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md space-y-6"
        >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                <CheckCircle2 className="h-12 w-12" />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Order Confirmed!
                </h1>
                <p className="text-muted-foreground">
                    Thank you for your purchase. We've sent a confirmation email to your inbox.
                </p>
            </div>

            <div className="rounded-2xl border border-dashed p-6 bg-secondary/20">
                <p className="text-sm font-medium">Order #EUGEN-{Math.floor(Math.random() * 10000)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Estimated delivery: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <Button size="lg" className="rounded-full h-12 px-8" asChild>
                    <Link href="/">
                        Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8" asChild>
                    <Link href="/account/orders">
                        View Order
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}
