import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

// ADD A NEW PRODUCT (POST)
export async function POST(request) {
  try {
    const data = await request.json();
    const [result] = await pool.query(
      `INSERT INTO products (category_id, name, price, description) VALUES (?, ?, ?, ?)`,
      [data.category_id, data.name, data.price, data.description || '']
    );
    return NextResponse.json({ success: true, id: result.insertId }, { status: 200 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// EDIT AN EXISTING PRODUCT (PUT)
export async function PUT(request) {
  try {
    const data = await request.json();
    await pool.query(
      `UPDATE products SET category_id = ?, name = ?, price = ?, description = ? WHERE id = ?`,
      [data.category_id, data.name, data.price, data.description || '', data.id]
    );
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// DELETE A PRODUCT (DELETE)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}