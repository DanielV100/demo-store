"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { currency } from "@/lib/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StoreNavbar } from "@/components/ui/navbar";
import { Footer } from "@/components/footer";
import { Loader2, CheckCircle2, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            <Suspense fallback={<div className="h-16 bg-background/60 backdrop-blur" />}>
                <StoreNavbar />
            </Suspense>
            <main className="pb-24 pt-24 md:pt-32">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
                        <CheckoutContent />
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function CheckoutContent() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<"shipping" | "payment">("shipping");

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === "shipping") {
            setStep("payment");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setIsProcessing(true);
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        clearCart();
        router.push("/checkout/success");
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-12 text-center">
                <div className="mb-4 rounded-full bg-secondary/50 p-6">
                    <CreditCard className="h-10 w-10 opacity-50" />
                </div>
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-muted-foreground">
                    Add some items to your cart to proceed with checkout.
                </p>
                <Button className="mt-6 rounded-full" onClick={() => router.push("/")}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
                <CheckoutForm />
            </div>

            <div className="lg:col-span-5">
                <div className="sticky top-32">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const shippingSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address is too short"),
    city: z.string().min(2, "City is too short"),
    zip: z.string().min(4, "Invalid ZIP code"),
});

const paymentSchema = z.object({
    cardNumber: z.string().min(16, "Card number must be 16 digits").max(19, "Card number too long"),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry (MM/YY)"),
    cvc: z.string().min(3, "CVC must be 3 digits").max(4, "CVC must be 4 digits"),
});

// Combine schemas for the full form state, though we validate step-by-step
const checkoutSchema = shippingSchema.merge(paymentSchema);
type CheckoutValues = z.infer<typeof checkoutSchema>;

function CheckoutForm() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    const [step, setStep] = useState<"shipping" | "payment">("shipping");
    const [isProcessing, setIsProcessing] = useState(false);

    const form = useForm<CheckoutValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            city: "",
            zip: "",
            cardNumber: "",
            expiry: "",
            cvc: "",
        },
        mode: "onChange",
    });

    const handleNextStep = async () => {
        const valid = await form.trigger(["firstName", "lastName", "email", "address", "city", "zip"]);
        if (valid) {
            setStep("payment");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const onSubmit = async (data: CheckoutValues) => {
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        clearCart();
        router.push(`/checkout/success?orderId=EUGEN-${Math.floor(Math.random() * 10000)}`);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                    {step === "shipping" ? (
                        <motion.div
                            key="shipping"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-primary" />
                                        Shipping Information
                                    </CardTitle>
                                    <CardDescription>
                                        Enter your delivery details.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" className="rounded-xl" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Doe" className="rounded-xl" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="john@example.com" className="rounded-xl" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Main St" className="rounded-xl" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="New York" className="rounded-xl" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="zip"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ZIP Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="10001" className="rounded-xl" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="w-full rounded-full h-12 text-base"
                                    >
                                        Continue to Payment
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="payment"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                            Payment Details
                                        </CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setStep("shipping")}>
                                            Edit Shipping
                                        </Button>
                                    </div>
                                    <CardDescription>
                                        Secure payment processing.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="cardNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Card number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0000 0000 0000 0000" className="rounded-xl" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="expiry"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Expiry Date</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="MM/YY" className="rounded-xl" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cvc"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CVC</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="123" className="rounded-xl" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 rounded-xl bg-secondary/30 p-4 text-sm text-muted-foreground">
                                        <ShieldCheck className="h-5 w-5 text-green-600" />
                                        <span>Your payment information is encrypted and secure.</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        className="w-full rounded-full h-12 text-base"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Pay Now"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </Form>
    );
}

function OrderSummary() {
    const { items } = useCartStore();
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Card className="border-border/50 bg-secondary/10 shadow-none">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-background">
                                <Image
                                    src={item.img}
                                    alt={item.name}
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <span className="font-medium line-clamp-1">{item.name}</span>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Qty {item.quantity}</span>
                                    <span>{currency(item.price * item.quantity)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Separator />
                <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{currency(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxes</span>
                        <span>Included</span>
                    </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{currency(total)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
