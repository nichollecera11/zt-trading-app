import pool from '../lib/db';
import CartWidget from '../components/CartWidget';
import ProductFeed from '../components/ProductFeed'; 
import Link from 'next/link';


export const dynamic = 'force-dynamic';

export default async function Home() {
  // We use a JOIN here to attach the actual category_name to every product
  const [products] = await pool.query(
    `SELECT p.*, c.name as category_name 
     FROM products p 
     JOIN categories c ON p.category_id = c.id 
     WHERE p.is_available = true`
  );

  return (
    <>
      {/* Mourning Banner with Small Logo */}
      <div className="bg-black text-white text-center py-2.5 px-4 flex items-center justify-center gap-3 border-b border-gray-800">
        <img 
          src="/images/logo.png" 
          alt="Logo" 
          className="h-5 w-auto object-contain brightness-200" 
        />
        <Link 
          href="/statement" 
          className="text-xs sm:text-sm font-bold tracking-wider uppercase hover:text-gray-300 transition-colors"
        >
          Official Statement: The passing of [Member's Name] →
        </Link>
      </div>

      <main className="min-h-screen bg-gray-50 pb-24">
        
        <header className="bg-white shadow-sm pt-12 pb-6 px-6 text-center sticky top-0 z-40 border-b border-gray-200">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">ZT Trading</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            Premium S&R Essentials & Fresh Meat Delivery in CDO
          </p>
          
          {/* The Developer Portfolio Link */}
          <div className="mt-3">
            <Link href="/about" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
              ⚡ Built by Migo (View Developer Profile)
            </Link>
          </div>
        </header>

        <ProductFeed allProducts={products} />
        <CartWidget />
        
      </main>
    </>
  );
}