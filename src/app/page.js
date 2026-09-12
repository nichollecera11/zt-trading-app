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
    <main
      className="min-h-screen text-white pb-24 relative"
      // style={{
      //   // Change 'store-bg.jpg' to your actual image filename
      //   backgroundImage: 'url("/images/bg.png")',
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundAttachment: "fixed", // This creates a premium parallax effect when scrolling
      // }}
    >
      {/* 👇 THE OVERLAY: Keeps your dark theme vibe and ensures text readability 👇 */}
      <div className="absolute inset-0 bg-[#0a0a09]/85 z-0"></div>

      {/* Everything inside this div sits ON TOP of the background image and overlay */}
      <div className="relative z-10">
        {/* ========================================== */}
        {/* STICKY MINI-HEADER (brand mark only — your   */}
        {/* full hero below carries the real branding)   */}
        {/* ========================================== */}
        <div className="sticky top-0 z-50 h-14 flex items-center justify-between px-5 border-b border-[#c3afb7]/15 bg-[#0a0a09]/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 font-bold text-sm">
            <img
              src="/images/logo-ui.png"
              alt="SwiftBag Logo"
              className="w-20 h-20 object-contain drop-shadow-md"
            />
          </div>
          <span className="text-[11px] font-semibold text-[#c3afb7] border border-[#c3afb7]/25 rounded-full px-3 py-1">
            {products.length} items available
          </span>
        </div>

        {/* ========================================== */}
        {/* HERO                                         */}
        {/* ========================================== */}
        <header className="px-4 pt-10 pb-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-end">
            {/* Left: logo + headline + CTA */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1
                className="text-4xl md:text-5xl font-black text-[#d6eb1d] tracking-tight uppercase mt-4 leading-[1.05] animate-saas-pop"
                style={{ animationDelay: "100ms" }}
              >
                Your S&amp;R run,
                <br />
                without the drive.
              </h1>

              <p
                className="text-sm font-medium text-[#c3afb7] mt-3 tracking-wide max-w-sm animate-saas-pop"
                style={{ animationDelay: "200ms" }}
              >
                Premium meats &amp; S&amp;R essentials, delivered straight to
                your door in Cagayan de Oro.
              </p>

              <Link
                href="/about"
                className="mt-5 text-xs font-bold text-[#acbf00] hover:text-[#d6eb1d] transition-colors uppercase tracking-wider animate-saas-pop"
                style={{ animationDelay: "300ms" }}
              >
                About the Developer &rarr;
              </Link>
            </div>

            {/* Right: the one deliberate hero moment — a receipt-style status strip */}
            <div
              className="relative bg-[#141412] border border-[#c3afb7]/15 rounded-xl px-5 py-4 overflow-hidden animate-saas-pop shadow-2xl"
              style={{ animationDelay: "400ms" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #acbf00 0 8px, transparent 8px 16px)",
                }}
              />
              <div className="flex justify-between text-[13px] py-2 border-b border-dashed border-[#c3afb7]/20">
                <span className="text-[#c3afb7]">Sourcing from</span>
                <b className="font-medium">Kauswagan · Bulua · Bayabas</b>
              </div>
              <div className="flex justify-between text-[13px] py-2 border-b border-dashed border-[#c3afb7]/20">
                <span className="text-[#c3afb7]">Delivery</span>
                <b className="font-medium">Same-day, CDO-wide</b>
              </div>
              <div className="flex justify-between text-[13px] py-2 border-b border-dashed border-[#c3afb7]/20">
                <span className="text-[#c3afb7]">Payment</span>
                <b className="font-medium">COD or GCash</b>
              </div>
              <div className="flex justify-between text-[13px] py-2">
                <span className="text-[#c3afb7]">Status</span>
                <span className="text-[#d6eb1d] animate-pulse">
                  ● Shopping today
                </span>
              </div>
            </div>
          </div>

          {/* How it works — a real 3-step sequence, so numbering earns its place */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#c3afb7]/15 border border-[#c3afb7]/15 rounded-xl overflow-hidden mt-8">
            <div
              className="bg-[#141412] px-5 py-4 animate-saas-pop"
              style={{ animationDelay: "550ms" }}
            >
              <div className="text-[11px] font-semibold text-[#acbf00] mb-1.5">
                01
              </div>
              <h3 className="text-sm font-semibold mb-1">You order</h3>
              <p className="text-xs text-[#c3afb7] leading-relaxed">
                Pick from the catalog or list a custom Pabili request.
              </p>
            </div>
            <div
              className="bg-[#141412] px-5 py-4 animate-saas-pop"
              style={{ animationDelay: "700ms" }}
            >
              <div className="text-[11px] font-semibold text-[#acbf00] mb-1.5">
                02
              </div>
              <h3 className="text-sm font-semibold mb-1">We shop</h3>
              <p className="text-xs text-[#c3afb7] leading-relaxed">
                Your personal shopper picks, checks, and packs every item.
              </p>
            </div>
            <div
              className="bg-[#141412] px-5 py-4 animate-saas-pop"
              style={{ animationDelay: "850ms" }}
            >
              <div className="text-[11px] font-semibold text-[#acbf00] mb-1.5">
                03
              </div>
              <h3 className="text-sm font-semibold mb-1">You receive</h3>
              <p className="text-xs text-[#c3afb7] leading-relaxed">
                Delivered to your door, with status updates on your phone.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Feeds */}
        <ProductFeed allProducts={products} />
        <CartWidget />
      </div>
    </main>
  );
}
