import pool from '../../lib/db';
import AdminDashboard from '../../components/AdminDashboard';

export const dynamic = 'force-dynamic'; 

export default async function Admin() {
  // 1. Fetch PRODUCTS
  const [productsData] = await pool.query(
    `SELECT * FROM products ORDER BY category_id ASC`
  );

  // 2. Fetch ORDERS (Make sure this says 'FROM orders'!)
  const [ordersData] = await pool.query(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );

  // 3. Sanitize both separately
  const safeProducts = JSON.parse(JSON.stringify(productsData));
  const safeOrders = JSON.parse(JSON.stringify(ordersData));

  // 4. Pass them to the exact right slots
  return <AdminDashboard allProducts={safeProducts} allOrders={safeOrders} />;
}