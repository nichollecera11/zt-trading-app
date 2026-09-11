import pool from '../../lib/db';
import AdminDashboard from '../../components/AdminDashboard';

export const dynamic = 'force-dynamic'; 

export default async function Admin() {
  // 1. Fetch PRODUCTS
  const [productsData] = await pool.query(
    `SELECT * FROM products ORDER BY category_id ASC`
  );

  // 2. Fetch ORDERS (Make sure this says 'FROM orders'!)
  // 2. Fetch ORDERS (Upgraded to include cart_items!)
  const [ordersData] = await pool.query(`
    SELECT 
      o.*, 
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.product_id,
            'name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ), '[]'
      ) AS cart_items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);

  // 3. Sanitize both separately
  const safeProducts = JSON.parse(JSON.stringify(productsData));
  const safeOrders = JSON.parse(JSON.stringify(ordersData));

  // 4. Pass them to the exact right slots
  return <AdminDashboard allProducts={safeProducts} allOrders={safeOrders} />;
}