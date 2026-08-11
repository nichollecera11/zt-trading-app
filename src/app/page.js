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
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="mb-10 flex flex-col items-center justify-center text-center">
        {/* 1. The Big Centered Logo */}
        <img
          src="/images/logo_ui.png"
          alt="ZT Trading Logo"
          className="mt-5 w-30 h-30 object-contain"
        />

        {/* 2. The Brand Title */}
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          ZT TRADING
        </h1>

        {/* 3. The Tagline */}
        <p className="text-sm font-medium text-gray-500 mt-2 tracking-wide">
          Premium meats & S&R essentials, delivered to your door.
        </p>

        {/* 4. The About Link */}
        <Link
          href="/about"
          className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          About the Developer
        </Link>
      </header>

      <ProductFeed allProducts={products} />
      <CartWidget />
    </main>
  );
}
