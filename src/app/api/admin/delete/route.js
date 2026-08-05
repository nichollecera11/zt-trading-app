import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    // 1. Grab the product ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 2. Tell PostgreSQL to delete the row matching this ID
    // Note: Change 'products' if your actual table name is different!
    const query = 'DELETE FROM products WHERE id = ?';
    await pool.query(query, [id]);

    // 3. Send a success message back to the frontend
    return NextResponse.json({ message: 'Product deleted permanently' }, { status: 200 });
    
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}