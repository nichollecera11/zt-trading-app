import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, name, price, category_id, image_url } = await request.json();

    const query = 'UPDATE products SET name = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?';
    
    await pool.query(query, [name, price, category_id, image_url || null, id]);

    return NextResponse.json({ success: true, message: 'Product updated successfully' }, { status: 200 });
    
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}