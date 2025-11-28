"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Since we might not have radix-ui/react-accordion installed, 
// let's implement a custom one using standard React + Framer Motion 
// to be safe and dependency-free for this demo.
// IF the user had radix installed we would use it, but let's assume we want to be self-contained.
// ACTUALLY, let's check if we can just use a simple state-based one for the demo 
// to avoid "Module not found" for radix if it's missing.
// BUT, to keep it clean and "shadcn-like" API, I will build it with context.

import { motion, AnimatePresence } from "framer-motion";

const AccordionContext = React.createContext<{
    value: string | undefined;
    setValue: (v: string | undefined) => void;
}>({ value: undefined, setValue: () => { } });

export function Accordion({
    children,
    type = "single",
    collapsible = false,
    className,
    ...props
}: {
    children: React.ReactNode;
    type?: "single" | "multiple";
    collapsible?: boolean;
    className?: string;
}) {
    const [value, setValue] = React.useState<string | undefined>(undefined);

    return (
        <AccordionContext.Provider value={{ value, setValue }}>
            <div className={cn("space-y-2", className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
}

export function AccordionItem({
    children,
    value: itemValue,
    className,
    ...props
}: {
    children: React.ReactNode;
    value: string;
    className?: string;
}) {
    return (
        <div className={cn("border-b", className)} {...props}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as any, { itemValue });
                }
                return child;
            })}
        </div>
    );
}

export function AccordionTrigger({
    children,
    className,
    itemValue,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    itemValue?: string;
}) {
    const { value, setValue } = React.useContext(AccordionContext);
    const isOpen = value === itemValue;

    return (
        <div className="flex">
            <button
                type="button"
                onClick={() => setValue(isOpen ? undefined : itemValue)}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </div>
    );
}

export function AccordionContent({
    children,
    className,
    itemValue,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    itemValue?: string;
}) {
    const { value } = React.useContext(AccordionContext);
    const isOpen = value === itemValue;

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden text-sm"
                >
                    <div className={cn("pb-4 pt-0", className)} {...props}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
