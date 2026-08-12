"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard({ allProducts, allOrders = [] }) {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState(allProducts);
  const [orders, setOrders] = useState(allOrders);
  const [activeTab, setActiveTab] = useState("products");
  const [orderView, setOrderView] = useState("active");
  const [selectedImage, setSelectedImage] = useState(null); // Stores image URL to view full size

  useEffect(() => {
    setOrders(allOrders);
    console.log("LIVE DATABASE ORDERS:", allOrders);
  }, [allOrders]);

  // NEW: State for our Add Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category_id: 1,
    image_url: "",
  });
  const [editingProduct, setEditingProduct] = useState(null); // NEW: State for our Edit Product Modal

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
  // 👇 NEW: Function to change the order status
  const updateOrderStatus = async (orderId, newStatus) => {
    // 1. Instantly update the UI so it feels lightning fast
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    // 2. Silently update the database in the background
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

  // NEW: Function to handle saving the edited product
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        // INSTANT UI MAGIC: Find the old product in the list and replace it with the new edited one
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? editingProduct : p,
          ),
        );

        // Close the modal
        setEditingProduct(null);
      } else {
        alert("Something went wrong trying to edit the product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
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
  // Live orders
  const displayedOrders = orders.filter((order) => {
    if (orderView === "active") {
      // Only show Pending and Out for Delivery
      return order.status !== "Completed" && order.status !== "Cancelled";
    } else {
      // Only show Completed and Cancelled
      return order.status === "Completed" || order.status === "Cancelled";
    }
  });

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
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
                    <th className="p-4 text-left font-semibold w-1/2">
                      Product
                    </th>
                    <th className="p-4 text-center font-semibold">Price (₱)</th>
                    <th className="p-4 text-center font-semibold">Status</th>
                    <th className="p-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          {/* The Image Lightbox */}
                          {product.image_url ? (
                            <div
                              onClick={() =>
                                setSelectedImage({
                                  url: product.image_url,
                                  name: product.name,
                                })
                              }
                              className="cursor-pointer group relative shrink-0"
                              title="Click to view full image"
                            >
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200 transition-transform group-hover:scale-105 shadow-sm"
                              />
                              <span className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                View
                              </span>
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 shrink-0 border border-gray-200">
                              No Img
                            </div>
                          )}

                          {/* The Product Name */}
                          <span className="font-semibold text-gray-800 text-sm">
                            {product.name}
                          </span>
                        </div>
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

                      {/* Existing Actions Column */}
                      <td className="p-4 text-right align-middle">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- LIVE ORDERS TAB --- */}
      {activeTab === "orders" && (
        <div className="w-full block">
          {/* 👇 UPGRADED HEADER WITH TOGGLES 👇 */}
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
                {/* 👇 CHANGE: Map through displayedOrders instead of orders 👇 */}
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
      {/* --- FULL IMAGE LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] backdrop-blur-sm"
          onClick={() => setSelectedImage(null)} // Click outside to close
        >
          <div
            className="bg-white rounded-2xl p-4 max-w-xl w-full relative shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing
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

            {/* Full Uncropped Image */}
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
      {/* --- EDIT PRODUCT MODAL --- */}
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
                {/* Live Preview Box */}
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
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category_id}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category_id: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="1">S&R Food Service</option>
                    <option value="2">Bakery & Pastries</option>
                    <option value="3">Fresh Meat & Seafood</option>
                    <option value="4">Imported Snacks</option>
                    <option value="5">Frozen Goods</option>
                    <option value="6">Beverages & Alcohol</option>
                    <option value="7">Household Essentials</option>
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
