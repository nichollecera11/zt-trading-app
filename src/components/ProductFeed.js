"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductFeed({ allProducts }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [activeCategory, setActiveCategory] = useState("All");
  // 1. We added a new state to track what the user is typing
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    ...new Set(allProducts.map((product) => product.category_name)),
  ];

  // 2. We updated the filter to check BOTH the category and the search text
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category_name === activeCategory;

    // Check if the search text is inside the product name or description
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setVisibleCount(10);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(10); // Reset the visible count when they search for something new
  };

  return (
    <div className="w-full">
      {/* 3. The New Premium Search Bar */}
      {/* 👇 Added sticky, top-0, z-40, bg-white, and pb-4 to fix the overlap 👇 */}
      <div className="sticky top-0 z-40 bg-white pt-8 pb-4 w-full ">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search for essentials, meat, etc..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Premium Swipeable Category Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[95px] z-30 mb-8">
        <div className="max-w-4xl mx-auto overflow-x-auto hide-scrollbar px-6">
          <div className="flex gap-2 py-4 w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
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

      <div className="max-w-4xl mx-auto px-6">
        {/* The Product Grid with a "Not Found" state */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium bg-white rounded-xl border border-gray-100 border-dashed">
            No products found for "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center pb-8">
            <button
              onClick={handleLoadMore}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-8 rounded-full transition-all active:scale-95 shadow-sm"
            >
              Load More{" "}
              {activeCategory === "All" ? "Essentials" : activeCategory} ↓
            </button>
          </div>
        )}

        {!hasMore && filteredProducts.length > 0 && (
          <div className="mt-12 text-center pb-8 text-sm font-bold text-gray-400">
            You have reached the end of this category!
          </div>
        )}
      </div>
    </div>
  );
}
