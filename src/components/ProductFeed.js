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
    4: "🏍️ Custom Pabili / Others"
  };

  // 👇 2. ADD THIS: Sync the database products with our new names 👇
  const syncedProducts = allProducts.map(product => ({
    ...product,
    // If the ID exists in our map, use the new name! Otherwise, use the old DB name.
    category_name: CATEGORY_MAP[product.category_id] || product.category_name 
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
      <div className="sticky top-0 z-40 bg-white pt-5 pb-1 w-full ">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search for essentials, meat, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Premium Swipeable Category Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30 mb-8">
        <div className="max-w-4xl mx-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-6">
          <div className="flex gap-2 py-4 w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === category
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Not Found State */}
        {categoriesToShow.length === 0 ? (
          <div className="mx-6 text-center py-12 text-gray-500 font-medium bg-white rounded-xl border border-gray-100 border-dashed">
            No products found for "{searchQuery}"
          </div>
        ) : (
          /* Map through the categories to create the Rows */
          categoriesToShow.map((categoryName) => (
            <div key={categoryName} className="mb-10">
              {/* Row Header with dynamic "View All" button */}
              <div className="flex justify-between items-center mb-4 px-6">
                <h2 className="text-xl font-black text-gray-900">
                  {categoryName}
                </h2>
                {activeCategory === "All" && (
                  <button
                    onClick={() => setActiveCategory(categoryName)}
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>

              {/* 👇 UPGRADED: Sleek Mobile-Friendly Custom Request Banner 👇 */}
              <div className="mx-6 mb-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 text-white shadow-lg border border-gray-700 flex items-start gap-3">
                <span className="text-2xl leading-none pt-0.5">🕵️‍♂️</span>
                <div>
                  <h3 className="text-base font-bold mb-1">
                    Can't find an item?
                  </h3>
                  <p className="text-xs text-gray-300 leading-snug">
                    List any unlisted S&R or local items in the{" "}
                    <strong>Notes</strong> at checkout. We'll buy it for you!
                  </p>
                </div>
              </div>

              {/* 👇 UPGRADED: Conditional Layout (Swipe vs Grid) 👇 */}
              {activeCategory === "All" ? (
                /* 1. HORIZONTAL SWIPE (Used on the "All" tab) */
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
                /* 2. FULL GRID (Used when a specific category is clicked) */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-6 pb-4">
                  {groupedProducts[categoryName].map((product) => (
                    <div key={product.id} className="w-full flex">
                      {/* Flex ensures all cards in the grid stretch to be the same height */}
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
