"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductFeed({ allProducts }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Extract unique categories dynamically
  const categories = [
    "All",
    ...new Set(allProducts.map((product) => product.category_name)),
  ];

  // 2. Filter products ONLY by search query first
  const searchFilteredProducts = allProducts.filter((product) => {
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

              {/* The Horizontal Swipe Container */}
              <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {groupedProducts[categoryName].map((product) => (
                  /* This wrapper div is the secret! 
                    It forces your existing ProductCard into a fixed width 
                    so it doesn't stretch and break the horizontal scroll.
                  */
                  <div
                    key={product.id}
                    className="snap-start flex-shrink-0 w-[48vw] min-w-[170px] md:w-[220px]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
