"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductFeed({ allProducts }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 👇 1. ADD THIS: The Master Category Dictionary 👇
  const CATEGORY_MAP = {
    1: "🛒 S&R Essentials",
    2: "🥩 Premium Local Meats",
    3: "🥬 Fresh Produce",
    4: "🏍️ Custom Pabili / Others",
  };

  // 👇 2. ADD THIS: Sync the database products with our new names 👇
  const syncedProducts = allProducts.map((product) => ({
    ...product,
    // If the ID exists in our map, use the new name! Otherwise, use the old DB name.
    category_name: CATEGORY_MAP[product.category_id] || product.category_name,
  }));

  // 1. Extract unique categories dynamically
  const categories = [
    "All",
    ...new Set(syncedProducts.map((product) => product.category_name)),
  ];

  // 2. Filter products ONLY by search query first
  const searchFilteredProducts = syncedProducts.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const safeDescription = product.description || "";
    return (
      product.name.toLowerCase().includes(searchLower) ||
      safeDescription.toLowerCase().includes(searchLower)
    );
  });

  // 3. Group the filtered products into their specific categories
  const groupedProducts = {};
  searchFilteredProducts.forEach((product) => {
    if (!groupedProducts[product.category_name]) {
      groupedProducts[product.category_name] = [];
    }
    groupedProducts[product.category_name].push(product);
  });

  // 4. Determine which category rows to display based on the active tab
  const categoriesToShow =
    activeCategory === "All"
      ? Object.keys(groupedProducts)
      : [activeCategory].filter((c) => groupedProducts[c]);

  return (
    <div className="w-full">
      {/* Premium Sticky Search Bar */}
      {/* Background matches the main page (#0a0a09) */}
      <div className="sticky top-0 z-40 bg-[#0a0a09] pt-5 pb-1 w-full ">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            {/* Search Icon changed to muted accent */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c3afb7]">
              🔍
            </span>
            {/* Dark Mode Input Field */}
            <input
              type="text"
              placeholder="Search for essentials, meat, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a09] border border-[#c3afb7]/30 rounded-xl py-3 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-[#d6eb1d] focus:ring-1 focus:ring-[#d6eb1d] transition-all shadow-sm placeholder:text-[#c3afb7]/50"
            />
          </div>
        </div>
      </div>

      {/* Premium Swipeable Category Tabs */}
      {/* Container background and bottom border matched to dark theme */}
      <div className="bg-[#0a0a09] border-b border-[#c3afb7]/30 sticky top-[72px] z-30 mb-8">
        <div className="max-w-4xl mx-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-6">
          <div className="flex gap-2 py-4 w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === category
                    ? "bg-[#d6eb1d] text-[#0a0a09] shadow-md" // Active: Vivid Yellow Green with Dark Text
                    : "bg-[#c3afb7]/10 text-[#c3afb7] hover:bg-[#c3afb7]/20 hover:text-white" // Inactive: Muted Accent
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Not Found State - Updated for dark mode */}
        {categoriesToShow.length === 0 ? (
          <div className="mx-6 text-center py-12 text-[#c3afb7] font-medium bg-[#0a0a09] rounded-xl border border-[#c3afb7]/30 border-dashed">
            No products found for "{searchQuery}"
          </div>
        ) : (
          /* Map through the categories to create the Rows */
          categoriesToShow.map((categoryName) => (
            <div key={categoryName} className="mb-10">
              {/* Row Header with dynamic "View All" button */}
              <div className="flex justify-between items-center mb-4 px-6">
                <h2 className="text-xl font-black text-white">
                  {categoryName}
                </h2>
                {activeCategory === "All" && (
                  <button
                    onClick={() => setActiveCategory(categoryName)}
                    className="text-sm font-bold text-[#acbf00] hover:text-[#d6eb1d] hover:underline transition-colors"
                  >
                    View All
                  </button>
                )}
              </div>

              {/* 👇 UPGRADED: Sleek Mobile-Friendly Custom Request Banner 👇 */}
              {/* Updated gradient to match the dark aesthetic with a subtle border */}
              <div className="mx-6 mb-8 bg-gradient-to-br from-[#c3afb7]/10 to-[#0a0a09] rounded-xl p-4 text-white shadow-lg border border-[#c3afb7]/30 flex items-start gap-3">
                <span className="text-2xl leading-none pt-0.5">🕵️‍♂️</span>
                <div>
                  <h3 className="text-base font-bold mb-1">
                    Can't find an item?
                  </h3>
                  <p className="text-xs text-[#c3afb7] leading-snug">
                    List any unlisted S&R or local items in the{" "}
                    <strong className="text-white">Notes</strong> at checkout.
                    We'll buy it for you!
                  </p>
                </div>
              </div>

              {/* Conditional Layout (Swipe vs Grid) */}
              {activeCategory === "All" ? (
                /* 1. HORIZONTAL SWIPE */
                <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {groupedProducts[categoryName].map((product) => (
                    <div
                      key={product.id}
                      className="snap-start flex-shrink-0 w-[48vw] min-w-[170px] md:w-[220px]"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                /* 2. FULL GRID */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-6 pb-4">
                  {groupedProducts[categoryName].map((product) => (
                    <div key={product.id} className="w-full flex">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
