import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, selectedDistance, subtotal, grandTotal, items, orderMethod } = body;

    // 1. Insert the main order record into the `orders` table
    const orderQuery = `
      INSERT INTO orders 
      (customer_name, customer_address, customer_phone, delivery_area, delivery_fee, subtotal, grand_total, notes, order_method) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [orderResult] = await pool.query(orderQuery, [
      formData.name,
      formData.address,
      formData.phone,
      selectedDistance.name,
      selectedDistance.fee,
      subtotal,
      grandTotal,
      formData.notes || '',
      orderMethod
    ]);

    const newOrderId = orderResult.insertId;

    // 2. Insert all the individual cart items into the `order_items` table
    // We map through the items and create an array of promises to insert them all
    const itemPromises = items.map(item => {
      return pool.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)`,
        [newOrderId, item.id, item.name, item.quantity, item.price]
      );
    });

    // Wait for all items to finish saving
    await Promise.all(itemPromises);

    // 3. Tell the frontend it was a success!
    return NextResponse.json({ success: true, orderId: newOrderId }, { status: 200 });

  } catch (error) {
    console.error("Failed to save order to database:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}