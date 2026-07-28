import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, is_available, price } = await request.json();
    
    // Update the database with the new status and price
    await pool.query(
      'UPDATE products SET is_available = ?, price = ? WHERE id = ?',
      [is_available, price, id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}