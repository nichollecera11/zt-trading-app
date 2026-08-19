import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Grab the new 'tags' array from the frontend request
    const { name, price, category_id, image_url, tags } = await request.json();

    // 2. Convert the JavaScript array into a JSON string for MySQL. 
    // If no tags are provided, we default to an empty JSON array "[]"
    const tagsJson = tags ? JSON.stringify(tags) : JSON.stringify([]);

    // 3. Add 'tags' to the query (now we have 5 question marks)
    const query = 'INSERT INTO products (name, price, category_id, image_url, tags) VALUES (?, ?, ?, ?, ?)';
    
    // 4. Pass the stringified tagsJson to the query
    const [result] = await pool.query(query, [name, price, category_id, image_url || null, tagsJson]);

    return NextResponse.json({ insertId: result.insertId, message: 'Product added successfully' }, { status: 200 });
    
  } catch (error) {
    console.error("Add error:", error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}