// 👇 CHANGED: Only 3 sets of '../' here!
import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

// 🟢 ADD PRODUCT
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Convert tags array to JSON string safely
    const tagsJson = data.tags ? JSON.stringify(data.tags) : JSON.stringify([]);

    // 👇 NEW (Step 2.1): Added 'brand' to the INSERT command and 'data.brand' to the values array.
    // We use a fallback of 'S&R / Unbranded' just in case the field is left empty.
    const [result] = await pool.query(
      `INSERT INTO products (name, price, category_id, description, image_url, tags, brand) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.price, 1, data.description || '', data.image_url || '', tagsJson, data.brand || 'S&R / Unbranded']
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 200 });
  } catch (error) {
    console.error("Add error:", error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// 🛠 EDIT PRODUCT
export async function PUT(request) {
  try {
    const data = await request.json();
    
    // Convert tags array to JSON string safely
    const tagsJson = data.tags ? JSON.stringify(data.tags) : JSON.stringify([]);

    // 👇 NEW (Step 2.2): Added 'brand = ?' to the SET command. 
    // We also added 'data.brand' to the values array RIGHT BEFORE 'data.id'.
    await pool.query(
      `UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, tags = ?, brand = ? WHERE id = ?`,
      [data.name, data.price, data.description || '', data.image_url || '', tagsJson, data.brand || 'S&R / Unbranded', data.id]
    );

    return NextResponse.json({ success: true, message: 'Product updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// 🗑 DELETE PRODUCT
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}