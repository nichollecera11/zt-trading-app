import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Create Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_address TEXT NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        delivery_area VARCHAR(255) NOT NULL,
        delivery_fee DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        grand_total DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        order_method VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create Order Items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    // 3. 👇 NEW: Upgrade Products table for Multi-Category Tags 👇
    try {
      await pool.query(`ALTER TABLE products ADD COLUMN tags JSON`);
      console.log("Successfully added 'tags' column to products table.");
    } catch (alterError) {
      // If we run this script twice, MySQL complains the column already exists.
      // We catch that specific error here so it doesn't break the whole setup.
      console.log("Tags column likely already exists. Skipping alteration.");
    }

    // 4. 👇 NEW: Add Brand/Supplier Tracking Column 👇
    try {
      await pool.query(`ALTER TABLE products ADD COLUMN brand VARCHAR(255) DEFAULT 'S&R / Unbranded'`);
      console.log("Successfully added 'brand' column to products table.");
    } catch (brandError) {
      console.log("Brand column likely already exists. Skipping alteration.");
    }


    return NextResponse.json({ message: "Tables created successfully!" }, { status: 200 });
  } catch (error) {
    console.error("DB Setup Error:", error);
    return NextResponse.json({ error: "Failed to create tables", details: error.message }, { status: 500 });
  }
}