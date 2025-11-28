import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="grid h-8 w-8 place-content-center rounded-xl bg-gradient-to-br from-[var(--brand-1)] to-[var(--brand-2)] text-white shadow-md">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">EUGEN</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Premium e-commerce experience powered by AI curation. Shop smarter, faster, and better.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Shop</h3>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/search?q=Laptops" className="hover:text-primary">Laptops</Link></li>
                            <li><Link href="/search?q=Audio" className="hover:text-primary">Audio</Link></li>
                            <li><Link href="/search?q=Accessories" className="hover:text-primary">Accessories</Link></li>
                            <li><Link href="/search" className="hover:text-primary">All Products</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Support</h3>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary">Order Status</Link></li>
                            <li><Link href="#" className="hover:text-primary">Returns</Link></li>
                            <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Legal</h3>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} EUGEN Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
