"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Star,
    Truck,
    ShieldCheck,
    RotateCcw,
    Heart,
    ChevronRight,
    Minus,
    Plus,
    ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreNavbar } from "@/components/ui/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { products, currency, type Product } from "@/lib/product";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Components --------------------------------------------------------------

function Stars({ value }: { value: number }) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "h-4 w-4",
                        i < full
                            ? "fill-yellow-400 text-yellow-400"
                            : half && i === full
                                ? "fill-yellow-400/50 text-yellow-400"
                                : "text-muted-foreground/40"
                    )}
                />
            ))}
            <span className="ml-2 text-sm font-medium text-foreground">
                {value.toFixed(1)}
            </span>
        </div>
    );
}

export function ProductContent({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Mock multiple images for the gallery
    const images = [product.img, product.img, product.img];

    const relatedProducts = useMemo(
        () => products.filter((p) => p.id !== product.id).slice(0, 4),
        [product.id]
    );

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        toast.success(`Added ${quantity} ${product.name} to cart`);
    };

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            <Suspense fallback={<div className="h-16" />}>
                <StoreNavbar />
            </Suspense>

            <main className="pb-24 pt-24 md:pt-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/search" className="hover:text-primary transition-colors">
                            Products
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-foreground line-clamp-1">
                            {product.name}
                        </span>
                    </nav>

                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Left: Gallery */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative aspect-square overflow-hidden rounded-3xl border bg-secondary/20"
                            >
                                <Image
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8 transition-transform duration-500 hover:scale-105"
                                    priority
                                />
                                {product.tags[0] && (
                                    <Badge className="absolute left-4 top-4 text-sm px-3 py-1">
                                        {product.tags[0]}
                                    </Badge>
                                )}
                            </motion.div>

                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn(
                                            "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-secondary/20 transition-all",
                                            selectedImage === idx
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-transparent hover:border-border"
                                        )}
                                    >
                                        <Image
                                            src={img}
                                            alt={`View ${idx + 1}`}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <Stars value={product.rating} />
                                    <span className="text-sm text-muted-foreground">
                                        (128 reviews)
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-primary">
                                        {currency(product.price)}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Includes local taxes and shipping.
                                </p>
                            </div>

                            <Separator className="my-8" />

                            <div className="space-y-6">
                                {/* Color Selection (Mock) */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium">
                                        Color
                                    </label>
                                    <div className="flex gap-3">
                                        {["#1a1a1a", "#e5e5e5", "#3b82f6"].map((c, i) => (
                                            <button
                                                key={c}
                                                className={cn(
                                                    "h-8 w-8 rounded-full border-2 ring-offset-2 focus:outline-none focus:ring-2 focus:ring-primary",
                                                    i === 0 ? "border-primary" : "border-transparent"
                                                )}
                                                style={{ backgroundColor: c }}
                                                aria-label="Select color"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex items-center rounded-full border border-border bg-background p-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-full"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-12 text-center font-medium">
                                            {quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-full"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="flex-1 rounded-full text-base h-12"
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Add to Cart
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-12 w-12 rounded-full"
                                    >
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {[
                                    { icon: Truck, text: "Free Shipping" },
                                    { icon: ShieldCheck, text: "2 Year Warranty" },
                                    { icon: RotateCcw, text: "30 Day Returns" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 rounded-xl border bg-secondary/20 p-3 text-sm font-medium"
                                    >
                                        <item.icon className="h-4 w-4 text-primary" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>

                            {/* Description / Specs Tabs */}
                            <div className="mt-12">
                                <Tabs defaultValue="description">
                                    <TabsList className="w-full justify-start rounded-xl bg-secondary/30 p-1">
                                        <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
                                        <TabsTrigger value="specs" className="rounded-lg">Specifications</TabsTrigger>
                                        <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="description" className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                                        <p>
                                            Experience the pinnacle of performance with the {product.name}.
                                            Designed for professionals and enthusiasts alike, this device combines
                                            cutting-edge technology with sleek aesthetics.
                                        </p>
                                        <p>
                                            Whether you&apos;re creating content, gaming, or handling complex workflows,
                                            the {product.name} delivers reliability and speed that you can count on.
                                        </p>
                                    </TabsContent>
                                    <TabsContent value="specs" className="mt-6">
                                        <dl className="grid gap-4 sm:grid-cols-2">
                                            {product.specs.map((spec, i) => (
                                                <div key={i} className="rounded-xl border p-4">
                                                    <dt className="text-sm font-medium text-muted-foreground">Feature</dt>
                                                    <dd className="mt-1 font-medium">{spec}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </TabsContent>
                                    <TabsContent value="reviews" className="mt-6">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 rounded-xl border bg-secondary/10 p-6">
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-foreground">{product.rating}</div>
                                                    <Stars value={product.rating} />
                                                    <div className="mt-1 text-xs text-muted-foreground">128 reviews</div>
                                                </div>
                                                <Separator orientation="vertical" className="h-12" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="w-12 text-xs text-muted-foreground">5 stars</span>
                                                        <div className="h-2 flex-1 rounded-full bg-secondary">
                                                            <div className="h-full w-[85%] rounded-full bg-yellow-400" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="w-12 text-xs text-muted-foreground">4 stars</span>
                                                        <div className="h-2 flex-1 rounded-full bg-secondary">
                                                            <div className="h-full w-[10%] rounded-full bg-yellow-400" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="w-12 text-xs text-muted-foreground">3 stars</span>
                                                        <div className="h-2 flex-1 rounded-full bg-secondary">
                                                            <div className="h-full w-[5%] rounded-full bg-yellow-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    {
                                                        user: "Alex M.",
                                                        rating: 5,
                                                        date: "2 days ago",
                                                        title: "Absolutely amazing!",
                                                        text: "The build quality is incredible. I use it every day for work and it never lets me down. Highly recommended!",
                                                    },
                                                    {
                                                        user: "Sarah K.",
                                                        rating: 5,
                                                        date: "1 week ago",
                                                        title: "Best purchase this year",
                                                        text: "Shipping was super fast and the packaging was premium. The product itself exceeds all expectations.",
                                                    },
                                                    {
                                                        user: "David R.",
                                                        rating: 4,
                                                        date: "2 weeks ago",
                                                        title: "Great, but pricey",
                                                        text: "Performance is top notch, but it is a bit on the expensive side. Still worth it if you need the power.",
                                                    },
                                                ].map((review, i) => (
                                                    <div key={i} className="rounded-xl border p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-sm">{review.user}</span>
                                                                <Badge variant="secondary" className="text-[10px] h-5 rounded-md px-1.5">Verified Buyer</Badge>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{review.date}</span>
                                                        </div>
                                                        <div className="mb-2">
                                                            <Stars value={review.rating} />
                                                        </div>
                                                        <h4 className="text-sm font-medium mb-1">{review.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{review.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </motion.div>
                    </div>

                    {/* Related Products */}
                    <div className="mt-24">
                        <h2 className="mb-8 text-2xl font-bold tracking-tight">
                            Frequently Bought Together
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((p, i) => (
                                <ProductCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
