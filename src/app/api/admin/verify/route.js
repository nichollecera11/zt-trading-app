import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    
    // 👇 NEW: Securely pull the PIN from your environment variables!
    const SECRET_PIN = process.env.ADMIN_PIN; 

    if (pin === SECRET_PIN) {
      // The Bouncer lets them in
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // The Bouncer kicks them out
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}