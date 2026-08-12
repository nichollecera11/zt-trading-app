import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Grab the exact order ID and the new status from the frontend
    const { orderId, newStatus } = await request.json();

    // 2. Update the Aiven database!
    const [result] = await pool.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [newStatus, orderId]
    );

    // 3. Tell the frontend it was a success
    return NextResponse.json({ success: true, message: "Status updated!" }, { status: 200 });

  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}