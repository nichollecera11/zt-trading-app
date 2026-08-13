"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard({ allProducts, allOrders = [] }) {
  // ==========================================
  // 1. ALL STATES (Organized together)
  // ==========================================
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [products, setProducts] = useState(allProducts);
  const [orders, setOrders] = useState(allOrders);

  const [activeTab, setActiveTab] = useState("products");
  const [orderView, setOrderView] = useState("active");

  const [selectedImage, setSelectedImage] = useState(null);

  // --- NEW: Product Manager States (Sliding Form) ---
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category_id: 1,
    description: "",
    image_url: "",
  });

  // --- OLD: Modal States (Kept as requested) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category_id: 1,
    image_url: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // ==========================================
  // 2. EFFECTS
  // ==========================================

  // --- NEW: 4 Core Master Categories ---
  const MASTER_CATEGORIES = [
    {
      id: 1,
      name: "🛒 S&R Essentials",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: 2,
      name: "🥩 Premium Local Meats",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    {
      id: 3,
      name: "🥬 Fresh Produce",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: 4,
      name: "🏍️ Custom Pabili / Others",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  ];

  useEffect(() => {
    setOrders(allOrders);
    console.log("LIVE DATABASE ORDERS:", allOrders);
  }, [allOrders]);

  // ==========================================
  // 3. AUTHENTICATION FUNCTION
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        alert("🚨 Incorrect PIN! Access Denied.");
        setPin("");
      }
    } catch (error) {
      alert("Something went wrong checking the PIN.");
    }
  };

  // ==========================================
  // 4. ORDER MANAGEMENT FUNCTIONS
  // ==========================================
  const updateOrderStatus = async (orderId, newStatus) => {
    // 1. Instantly update the UI
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    // 2. Silently update the database
    try {
      await fetch("/api/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Uh oh! Failed to save the status to the database.");
    }
  };

  // ==========================================
  // 5. NEW PRODUCT FUNCTIONS (Sliding Form)
  // ==========================================
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setProducts(products.filter((p) => p.id !== id));
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (editingProductId) {
      // 🛠 EDIT EXISTING PRODUCT
      const updatedProduct = { ...productForm, id: editingProductId };
      setProducts(
        products.map((p) => (p.id === editingProductId ? updatedProduct : p)),
      );

      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
    } else {
      // 🟢 ADD NEW PRODUCT
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      const data = await res.json();

      if (data.success) {
        setProducts([...products, { ...productForm, id: data.id }]);
      }
    }

    setProductForm({
      name: "",
      price: "",
      category_id: 1,
      description: "",
      image_url: "",
    });
    setIsAddingProduct(false);
    setEditingProductId(null);
  };

  // ==========================================
  // 6. OLD PRODUCT FUNCTIONS (Kept as requested)
  // ==========================================
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      const data = await res.json();
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
      setIsModalOpen(false);
      setNewProduct({ name: "", price: "", category_id: 1, image_url: "" });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? editingProduct : p,
          ),
        );
        setEditingProduct(null);
      } else {
        alert("Something went wrong trying to edit the product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

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
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        alert("Something went wrong trying to delete.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ==========================================
  // 7. SECURITY GATE (Renders before dashboard)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🔒
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Control Room
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your Master PIN to access the dashboard.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full text-center text-2xl tracking-widest font-bold border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // 8. DATA FILTERS FOR RENDER
  // ==========================================
  const displayedOrders = orders.filter((order) => {
    if (orderView === "active") {
      // Only show Pending and Out for Delivery
      return order.status !== "Completed" && order.status !== "Cancelled";
    } else {
      // Only show Completed and Cancelled
      return order.status === "Completed" || order.status === "Cancelled";
    }
  });

  // 👇 Your existing `return (` starts right here 👇

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ========================================== */}
      {/* 1. SIDEBAR NAVIGATION                        */}
      {/* ========================================== */}
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
            onClick={() => setActiveTab("analytics")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === "analytics" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
          >
            📊 Earnings
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === "orders" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
          >
            📱 WhatsApp Orders
          </button>
        </nav>
      </div>

      {/* 👇 NEW: MOBILE BOTTOM NAVIGATION 👇 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === "products" ? "text-blue-600 bg-blue-50 scale-105" : "text-gray-400 hover:text-gray-600"}`}
        >
          <span className="text-xl leading-none">📦</span>
          <span className="text-[10px] font-bold">Products</span>
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === "analytics" ? "text-blue-600 bg-blue-50 scale-105" : "text-gray-400 hover:text-gray-600"}`}
        >
          <span className="text-xl leading-none">📊</span>
          <span className="text-[10px] font-bold">Earnings</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === "orders" ? "text-blue-600 bg-blue-50 scale-105" : "text-gray-400 hover:text-gray-600"}`}
        >
          <span className="text-xl leading-none relative">
            📱
            {/* Optional: Add a little red dot indicator here if you have active orders! */}
            {orders.filter((o) => o.status === "Pending").length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
              </span>
            )}
          </span>
          <span className="text-[10px] font-bold">Orders</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* 2. MAIN CONTENT AREA (Where Tabs Render)     */}
      {/* ========================================== */}
      <div className="flex-1 p-4 pb-24 sm:pb-8 sm:p-8 overflow-y-auto relative">
        {/* -------------------------------------- */}
        {/* TAB A: PRODUCTS / INVENTORY            */}
        {/* -------------------------------------- */}
        {activeTab === "products" && (
          <div className="w-full block">
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Inventory Manager
              </h1>
              <button
                onClick={() => {
                  setProductForm({
                    name: "",
                    price: "",
                    category_id: 1,
                    description: "",
                  });
                  setEditingProductId(null);
                  setIsAddingProduct(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <span>➕</span> Add Product
              </button>
            </div>

            {/* MODAL FORM: Add/Edit Product */}
            {isAddingProduct && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                    {editingProductId
                      ? "✏️ Edit Product"
                      : "📦 Add New Product"}
                  </h2>
                  <form
                    onSubmit={handleSaveProduct}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Product Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-50 focus:bg-white"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., S&R Roasted Chicken"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Price (₱)
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-bold text-green-700 bg-gray-50 focus:bg-white"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Category
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-gray-800 bg-gray-50 focus:bg-white"
                        value={productForm.category_id}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            category_id: parseInt(e.target.value),
                          })
                        }
                      >
                        {MASTER_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-50 focus:bg-white"
                        value={productForm.description || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief details about the item..."
                      />
                    </div>

                    {/* IMAGE URL FIELD WITH LIVE PREVIEW */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Image URL
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-blue-600 bg-gray-50 focus:bg-white"
                        value={productForm.image_url || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            image_url: e.target.value,
                          })
                        }
                        placeholder="https://example.com/image.jpg"
                      />

                      {/* 👇 LIVE PREVIEW BOX 👇 */}
                      {productForm.image_url && (
                        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                          <p className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wider">
                            Image Preview
                          </p>
                          <img
                            src={productForm.image_url}
                            alt="Preview"
                            className="max-h-40 rounded-lg object-contain shadow-sm border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150?text=Invalid+Image+URL";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Form Action Buttons */}
                    <div className="sm:col-span-2 flex justify-end gap-3 mt-6 border-t pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProduct(false);
                          setEditingProductId(null);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
                      >
                        {editingProductId ? "Save Changes" : "Save Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* INVENTORY TABLE */}
            <div className="w-full max-w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto block">
              <table className="w-full min-w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
                    <th className="p-4 font-semibold w-16">ID</th>
                    <th className="p-4 font-semibold w-20 text-center">
                      Image
                    </th>
                    <th className="p-4 font-semibold">Product Info</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-8 text-center text-gray-500 font-medium"
                      >
                        Your inventory is empty. Add a product to get started!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-4 font-black text-gray-900">
                          #{product.id}
                        </td>
                        {/* IMAGE THUMBNAIL */}
                        <td className="p-4 text-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm mx-auto"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl mx-auto border border-gray-200 text-gray-300">
                              📦
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-sm text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {product.description || "No description provided."}
                          </p>
                        </td>
                        <td className="p-4">
                          {(() => {
                            const cat = MASTER_CATEGORIES.find(
                              (c) => c.id === product.category_id,
                            );
                            return (
                              <span
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                  cat
                                    ? cat.color
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                {cat
                                  ? cat.name
                                  : `Unknown (ID: ${product.category_id})`}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="p-4 font-black text-lg text-green-600">
                          ₱{parseFloat(product.price).toFixed(2)}
                        </td>

                        {/* Action Buttons (Edit / Delete) */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setProductForm({
                                  name: product.name,
                                  price: product.price,
                                  category_id: product.category_id,
                                  description: product.description || "",
                                  image_url: product.image_url || "",
                                });
                                setEditingProductId(product.id);
                                setIsAddingProduct(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors border border-blue-100"
                              title="Edit Product"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors border border-red-100"
                              title="Delete Product"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------- */}
        {/* TAB B: LIVE ORDERS                     */}
        {/* -------------------------------------- */}
        {activeTab === "orders" && (
          <div className="w-full block">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {orderView === "active" ? "Active Orders" : "Order History"}
              </h1>

              <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                <button
                  onClick={() => setOrderView("active")}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    orderView === "active"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
                >
                  🟢 Active Board
                </button>
                <button
                  onClick={() => setOrderView("history")}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    orderView === "history"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
                >
                  📁 History
                </button>
              </div>
            </div>

            <div className="w-full max-w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto block">
              <table className="w-full min-w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
                    <th className="p-4 font-semibold w-16">ID</th>
                    <th className="p-4 font-semibold">Customer Details</th>
                    <th className="p-4 font-semibold">Delivery Area</th>
                    <th className="p-4 font-semibold">Grand Total</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-gray-500 font-medium"
                      >
                        {orderView === "active"
                          ? "You're all caught up! No active orders right now."
                          : "No completed orders yet."}
                      </td>
                    </tr>
                  ) : (
                    displayedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-4 font-black text-gray-900">
                          #{order.id}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-sm text-gray-900">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            📞 {order.customer_phone}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {order.customer_address}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {order.delivery_area}
                          </p>
                          <p className="text-xs text-gray-500 font-bold mt-0.5">
                            Fee: ₱{order.delivery_fee}
                          </p>
                        </td>
                        <td className="p-4 font-black text-lg text-green-600">
                          ₱{order.grand_total}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border-2 transition-colors text-center w-32 appearance-none
                                  ${
                                    order.status === "Pending"
                                      ? "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                                      : order.status === "Completed"
                                        ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                                        : "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                                  }
                                `}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Out for Delivery">
                                Out for Delivery
                              </option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <a
                              href={`https://wa.me/63${order.customer_phone.replace(/^0+/, "")}?text=${encodeURIComponent(
                                `Hi ${order.customer_name}! This is ZT Trading. Just an update regarding your order (#${order.id}): The status is now [${order.status}]. 🛵💨`,
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-gray-500 hover:text-green-600 flex items-center gap-1 transition-colors bg-gray-100 hover:bg-green-50 px-3 py-1 rounded-full border border-gray-200"
                              title="Send WhatsApp Update"
                            >
                              <span className="text-sm">💬</span> Notify
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------- */}
        {/* TAB C: EARNINGS & ANALYTICS            */}
        {/* -------------------------------------- */}
        {activeTab === "analytics" &&
          (() => {
            // 1. The Math: Calculate everything on the fly!
            const completedOrders = orders.filter(
              (o) => o.status === "Completed",
            );
            const pendingOrders = orders.filter(
              (o) => o.status === "Pending" || o.status === "Out for Delivery",
            );

            const totalRevenue = completedOrders.reduce(
              (sum, o) => sum + Number(o.grand_total || 0),
              0,
            );
            const totalDeliveryFees = completedOrders.reduce(
              (sum, o) => sum + Number(o.delivery_fee || 0),
              0,
            );
            const totalProductSales = totalRevenue - totalDeliveryFees;

            const expectedRevenue = pendingOrders.reduce(
              (sum, o) => sum + Number(o.grand_total || 0),
              0,
            );

            return (
              <div className="w-full block animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                  Financial Overview
                </h1>

                {/* Top Row: Main Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Card 1: Total Revenue */}
                  <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg border border-green-800">
                    <h3 className="text-green-100 font-bold text-sm mb-1 uppercase tracking-wider">
                      Gross Revenue
                    </h3>
                    <p className="text-4xl font-black mb-2">
                      ₱{totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-200">
                      Total money collected from completed orders.
                    </p>
                  </div>

                  {/* Card 2: Delivery Fees (Your direct profit/gas) */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <h3 className="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">
                        Delivery Earnings
                      </h3>
                      <span className="text-xl">🛵</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 mb-2">
                      ₱{totalDeliveryFees.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Total delivery & service fees collected.
                    </p>
                  </div>

                  {/* Card 3: Pending Cash */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <h3 className="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">
                        Pending / Uncollected
                      </h3>
                      <span className="text-xl">⏳</span>
                    </div>
                    <p className="text-3xl font-black text-yellow-600 mb-2">
                      ₱{expectedRevenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Expected cash from active/pending deliveries.
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                    Business Breakdown
                  </h3>
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <span className="text-gray-600 font-medium">
                      Completed Orders
                    </span>
                    <span className="font-bold text-gray-900">
                      {completedOrders.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <span className="text-gray-600 font-medium">
                      Cost of Goods Sold (approx)
                    </span>
                    <span className="font-bold text-gray-900">
                      ₱{totalProductSales.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">
                      Average Order Value
                    </span>
                    <span className="font-bold text-green-600">
                      ₱
                      {completedOrders.length > 0
                        ? (totalRevenue / completedOrders.length).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>

      {/* ========================================== */}
      {/* 3. POP-UP MODALS (Global Overlays)           */}
      {/* ========================================== */}

      {/* MODAL: ADD PRODUCT (Old Version) */}
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

      {/* MODAL: IMAGE LIGHTBOX PREVIEW */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-2xl p-4 max-w-xl w-full relative shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center mb-3 pb-2 border-b">
              <h3 className="font-bold text-gray-800 text-lg">
                {selectedImage.name}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-xl px-2 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-2 border">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-h-[65vh] max-w-full object-contain rounded-md"
              />
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="mt-4 px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT (Old Version) */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Edit Product
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingProduct.image_url || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image_url: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                />
                {editingProduct.image_url && (
                  <div className="mt-2 p-2 border rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                    <img
                      src={editingProduct.image_url}
                      alt="Preview"
                      className="max-h-32 rounded-lg object-contain shadow-sm border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/150?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Price (₱)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-gray-800 bg-gray-50 focus:bg-white"
                    value={editingProduct.category_id}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category_id: parseInt(e.target.value),
                      })
                    }
                  >
                    {MASTER_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
