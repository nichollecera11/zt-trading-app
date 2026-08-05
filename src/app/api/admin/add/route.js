import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, price, category_id } = await request.json();
    
    // Insert the new product into Aiven. We default 'is_available' to true.
    const [result] = await pool.query(
      'INSERT INTO products (name, price, category_id, is_available) VALUES (?, ?, ?, ?)',
      [name, price, category_id, true]
    );
    
    // Return the new ID so the dashboard can update instantly
    return NextResponse.json({ success: true, insertId: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}