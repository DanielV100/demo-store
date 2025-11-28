"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Eye, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currency, type Product } from "@/lib/product";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
    className?: string;
    index?: number;
}

export function ProductCard({ product, className, index = 0 }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={cn("group relative", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-primary/20">

                {/* Image Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
                    <Link href={`/products/${product.id}`}>
                        <Image
                            src={product.img}
                            alt={product.name}
                            fill
                            className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                    </Link>

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        {product.tags.slice(0, 2).map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground shadow-sm dark:bg-black/80"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:text-red-500 dark:bg-black/80">
                        <Heart className="h-4 w-4" />
                    </button>

                    {/* Quick Actions Overlay */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-x-3 bottom-3 flex gap-2"
                            >
                                <Button
                                    className="flex-1 rounded-xl bg-white/90 text-foreground backdrop-blur-md hover:bg-white dark:bg-black/80 dark:hover:bg-black"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addItem(product);
                                        toast.success("Added to cart");
                                    }}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Quick Add
                                </Button>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="rounded-xl bg-white/90 backdrop-blur-md hover:bg-white dark:bg-black/80 dark:hover:bg-black"
                                    asChild
                                >
                                    <Link href={`/products/${product.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Content Area */}
                <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-xs font-medium text-muted-foreground">
                                {product.rating}
                            </span>
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">
                            {product.specs[0]}
                        </div>
                    </div>

                    <Link href={`/products/${product.id}`} className="block group-hover:text-primary transition-colors">
                        <h3 className="font-semibold leading-tight text-foreground line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-primary">
                            {currency(product.price)}
                        </span>
                        {/* Optional: Fake old price for demo */}
                        {/* <span className="text-xs text-muted-foreground line-through">
              {currency(product.price * 1.2)}
            </span> */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
