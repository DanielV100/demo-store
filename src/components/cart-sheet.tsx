"use client";

import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store";
import { currency } from "@/lib/product";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CartSheet() {
    const { items, removeItem, updateQuantity } = useCartStore();

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-secondary transition-colors"
                    aria-label="Open cart"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in duration-300">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-lg rounded-l-3xl border-l border-border/50 bg-background/95 backdrop-blur-xl">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Shopping Cart
                        <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {itemCount} items
                        </span>
                    </SheetTitle>
                    <Separator />
                </SheetHeader>

                <ScrollArea className="flex-1 -mr-6 pr-6">
                    <div className="flex flex-col gap-6 py-6">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center text-muted-foreground">
                                <div className="rounded-full bg-secondary/50 p-6">
                                    <ShoppingCart className="h-10 w-10 opacity-50" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-medium text-foreground">
                                        Your cart is empty
                                    </p>
                                    <p className="text-sm">
                                        Looks like you haven't added anything yet.
                                    </p>
                                </div>
                                <SheetClose asChild>
                                    <Button variant="outline" className="mt-4 rounded-full">
                                        Start Shopping
                                    </Button>
                                </SheetClose>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex gap-4"
                                    >
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-secondary/20">
                                            <Image
                                                src={item.img}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="space-y-1">
                                                <h4 className="font-medium leading-none line-clamp-2">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {currency(item.price)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1 rounded-full border bg-background p-0.5 shadow-sm">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-full"
                                                        onClick={() =>
                                                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                                        }
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-xs font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-full"
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </ScrollArea>

                {items.length > 0 && (
                    <SheetFooter className="flex-col gap-4 border-t pt-6 sm:flex-col sm:space-x-0">
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{currency(total)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{currency(total)}</span>
                            </div>
                        </div>
                        <SheetClose asChild>
                            <Button className="w-full rounded-full h-12 text-base shadow-lg shadow-primary/20" asChild>
                                <Link href="/checkout">
                                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
