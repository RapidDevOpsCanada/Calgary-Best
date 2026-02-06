import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const sql = getDb();
    
    // Check if already subscribed
    const existing = await sql`SELECT id FROM newsletter_subscribers WHERE email = ${email.trim().toLowerCase()}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "You're already subscribed!" }, { status: 409 });
    }

    await sql`INSERT INTO newsletter_subscribers (email) VALUES (${email.trim().toLowerCase()})`;
    return NextResponse.json({ success: true, message: "Successfully subscribed!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe", details: String(error) }, { status: 500 });
  }
}
