import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Grab the new image_url from the frontend
    const { name, price, category_id, image_url } = await request.json();

    // Add image_url to the query with 4 question marks
    const query = 'INSERT INTO products (name, price, category_id, image_url) VALUES (?, ?, ?, ?)';
    
    // Pass the image_url to MySQL
    const [result] = await pool.query(query, [name, price, category_id, image_url || null]);

    return NextResponse.json({ insertId: result.insertId, message: 'Product added successfully' }, { status: 200 });
    
  } catch (error) {
    console.error("Add error:", error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}