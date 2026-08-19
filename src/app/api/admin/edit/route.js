import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Grab the 'tags' array along with the other fields
    const { id, name, price, category_id, image_url, tags } = await request.json();

    // 2. Convert the array to a JSON string for MySQL
    const tagsJson = tags ? JSON.stringify(tags) : JSON.stringify([]);

    // 3. Update the query to include the tags column (now we have 6 question marks)
    const query = 'UPDATE products SET name = ?, price = ?, category_id = ?, image_url = ?, tags = ? WHERE id = ?';
    
    // 4. Pass the variables to MySQL in the exact order as the query
    await pool.query(query, [name, price, category_id, image_url || null, tagsJson, id]);

    return NextResponse.json({ success: true, message: 'Product updated successfully' }, { status: 200 });
    
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}