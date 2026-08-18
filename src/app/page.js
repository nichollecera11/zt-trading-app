import pool from "../lib/db";
import CartWidget from "../components/CartWidget";
import ProductFeed from "../components/ProductFeed";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  // We use a JOIN here to attach the actual category_name to every product
  const [products] = await pool.query(
    `SELECT p.*, c.name as category_name 
     FROM products p 
     JOIN categories c ON p.category_id = c.id 
     WHERE p.is_available = true`,
  );

  return (
    <main className="min-h-screen bg-[#0a0a09] text-white pb-24">
      <header className="mb-6 flex flex-col items-center justify-center text-center px-4">
        {/* 1. Brand Logo */}
        <img
          src="/images/logo-ui.png"
          alt="SwiftBag Logo"
          className="mt-6 w-28 h-28 object-contain drop-shadow-md"
        />

        {/* 2. Brand Title - Vivid Yellow Green (#d6eb1d) */}
        <h1 className="text-4xl font-black text-[#d6eb1d] tracking-tight uppercase mt-3">
          SWIFTBAG
        </h1>

        {/* 3. Tagline - Soft Muted Accent (#c3afb7) */}
        <p className="text-sm font-medium text-[#c3afb7] mt-2 tracking-wide max-w-sm">
          Premium meats &amp; S&amp;R essentials, delivered straight to your
          door.
        </p>

        {/* 4. Link / Action - Olive (#acbf00) to Yellow Green (#d6eb1d) on hover */}
        <Link
          href="/about"
          className="mt-4 text-xs font-bold text-[#acbf00] hover:text-[#d6eb1d] transition-colors uppercase tracking-wider"
        >
          About the Developer &rarr;
        </Link>
      </header>

      {/* Main Content Feeds */}
      <ProductFeed allProducts={products} />
      <CartWidget />
    </main>
  );
}
