export type Product = {
  id: string;
  name: string;
  price: number;
  img: string;
  rating: number;
  tags: string[];
  specs: string[];
  color: string;
};

export const currency = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(n);

export const products: Product[] = [
  // --- Laptops ---
  {
    id: "p1",
    name: "Apple MacBook Pro 14 M3",
    price: 1999,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9,
    tags: ["Bestseller", "Apple", "Creative"],
    specs: ["M3 Pro Chip", "18GB RAM", "512GB SSD"],
    color: "#C7C7C7",
  },
  {
    id: "p2",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    price: 1899,
    img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    tags: ["Business", "Ultralight", "Windows"],
    specs: ["i7-1355U", "16GB RAM", "OLED Touch"],
    color: "#000000",
  },
  {
    id: "p10",
    name: "Dell XPS 15",
    price: 2299,
    img: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=1000",
    rating: 4.6,
    tags: ["Premium", "Windows", "Creator"],
    specs: ["i9-13900H", "RTX 4070", "3.5K OLED"],
    color: "#C0C0C0",
  },

  // --- Peripherals ---
  {
    id: "p3",
    name: "Sony WH-1000XM5 Headphones",
    price: 349,
    img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000",
    rating: 4.8,
    tags: ["Audio", "Noise Cancelling", "Travel"],
    specs: ["30h Battery", "LDAC", "Adaptive ANC"],
    color: "#000000",
  },
  {
    id: "p4",
    name: "Logitech MX Master 3S",
    price: 99,
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9,
    tags: ["Productivity", "Accessories", "Ergonomic"],
    specs: ["8K DPI", "Quiet Clicks", "MagSpeed"],
    color: "#303030",
  },
  {
    id: "p5",
    name: "Keychron Q1 Pro Wireless",
    price: 199,
    img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    tags: ["Mechanical", "Custom", "Gaming"],
    specs: ["Hot-Swappable", "Aluminum Body", "QMK/VIA"],
    color: "#404040",
  },

  // --- Displays & Printers ---
  {
    id: "p6",
    name: "Samsung Odyssey OLED G9",
    price: 1599,
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000",
    rating: 4.8,
    tags: ["Gaming", "Ultrawide", "Immersive"],
    specs: ["49\" 32:9", "240Hz", "0.03ms Response"],
    color: "#000000",
  },
  {
    id: "p7",
    name: "Epson EcoTank ET-8550",
    price: 699,
    img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=1000",
    rating: 4.5,
    tags: ["Office", "Creative", "Photo"],
    specs: ["A3+ Print", "6-Color Ink", "Wireless"],
    color: "#FFFFFF",
  },

  // --- Tablets & Storage ---
  {
    id: "p8",
    name: "Apple iPad Pro 12.9\" M2",
    price: 1099,
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9,
    tags: ["Tablet", "Apple", "Drawing"],
    specs: ["M2 Chip", "XDR Display", "Face ID"],
    color: "#808080",
  },
  {
    id: "p9",
    name: "Samsung T7 Shield 2TB",
    price: 169,
    img: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?auto=format&fit=crop&q=80&w=1000",
    rating: 4.8,
    tags: ["Storage", "Portable", "Rugged"],
    specs: ["1050MB/s", "IP65 Rating", "USB 3.2"],
    color: "#0000FF",
  },
];

export const TOTAL_PRODUCTS = products.length;