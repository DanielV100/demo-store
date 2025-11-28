import { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/product";
import { ProductContent } from "./product-content";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found | EUGEN",
    };
  }

  return {
    title: `${product.name} | EUGEN`,
    description: `Buy the ${product.name} at EUGEN. ${product.specs.join(", ")}. Free shipping and 2-year warranty.`,
    openGraph: {
      images: [product.img],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductContent product={product} />;
}