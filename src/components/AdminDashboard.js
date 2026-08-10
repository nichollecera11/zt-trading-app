"use client";
import { useState } from "react";

export default function AdminDashboard({ allProducts }) {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState(allProducts);
  const [activeTab, setActiveTab] = useState("products");

  // NEW: State for our Add Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category_id: 1,
    image_url: "",
  });

  const SECRET_PIN = "1234";

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === SECRET_PIN) setIsAuthenticated(true);
    else alert("Incorrect PIN");
  };

  const updateProduct = async (id, newPrice, newStatus) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, price: newPrice, is_available: newStatus } : p,
      ),
    );
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price: newPrice, is_available: newStatus }),
    });
  };

  // NEW: Function to handle adding a product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      const data = await res.json();
      // Instantly add it to the screen
      setProducts([
        ...products,
        {
          id: data.insertId,
          name: newProduct.name,
          price: newProduct.price,
          image_url: newProduct.image_url,
          is_available: true,
        },
      ]);
      // Close the modal and reset the form
      setIsModalOpen(false);
      setNewProduct({ name: "", price: "", category_id: 1, image_url: "" });
    }
  };

  // NEW: Function to handle deleting a product
  const handleDelete = async (productId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product for good? This cannot be undone.",
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/delete?id=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // INSTANT DISAPPEAR MAGIC: Filter out the product that matches this ID
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        alert("Something went wrong trying to delete.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full border-t-8 border-blue-600"
        >
          <h2 className="text-2xl font-black mb-6 text-center text-gray-800">
            ZT TRADING
          </h2>
          <input
            type="password"
            placeholder="Enter Admin PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border-2 border-gray-200 p-3 rounded-lg mb-4 text-center text-2xl tracking-widest focus:border-blue-600 outline-none"
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
            Access Control Room
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-wider text-blue-400">
            ZT TRADING
          </h2>
          <p className="text-gray-400 text-sm mt-1">Admin Control Room</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === "products" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
          >
            📦 Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === "categories" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
          >
            📁 Categories
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === "orders" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
          >
            📱 WhatsApp Orders
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto relative">
        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Manage Inventory
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors"
              >
                + Add New Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                    <th className="p-4 border-b font-semibold">Product Name</th>
                    <th className="p-4 border-b font-semibold text-center">
                      Price (₱)
                    </th>
                    <th className="p-4 border-b font-semibold text-center">
                      Status
                    </th>
                    <th className="p-4 border-b font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {product.name}
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          defaultValue={product.price}
                          onBlur={(e) =>
                            updateProduct(
                              product.id,
                              e.target.value,
                              product.is_available,
                            )
                          }
                          className="border border-gray-300 p-2 rounded-md w-24 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            updateProduct(
                              product.id,
                              product.price,
                              !product.is_available,
                            )
                          }
                          className={`px-4 py-1.5 rounded-full text-xs font-bold w-28 uppercase tracking-wide ${product.is_available ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                        >
                          {product.is_available ? "In Stock" : "Sold Out"}
                        </button>
                      </td>

                      {/* NEW DELETE COLUMN */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Add New Product
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., S&R Beef Belly 1kg"
                />
              </div>
              {/* 2. 👉 PASTE THE NEW IMAGE URL INPUT RIGHT HERE 👈 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newProduct.image_url}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image_url: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                  placeholder="Paste image link here (e.g., https://...)"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Price (₱)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category_id: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="1">Meats</option>
                    <option value="2">S&R Items</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
