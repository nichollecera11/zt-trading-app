import pool from '../../lib/db';
import AdminDashboard from '../../components/AdminDashboard';

export const dynamic = 'force-dynamic'; // 👈 ADD THIS EXACT LINE

export default async function Admin() {
  // Notice there is NO "WHERE is_available = true" here.
  // The admin needs to see absolutely everything in the database!
  const [allProducts] = await pool.query(
    `SELECT * FROM products ORDER BY category_id ASC`
  );

  return <AdminDashboard allProducts={allProducts} />;
}