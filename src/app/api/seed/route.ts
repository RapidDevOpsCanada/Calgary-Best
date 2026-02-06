import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SEED_SQL } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();
    
    // Split the seed SQL into individual statements and execute them
    const statements = SEED_SQL.split(";").filter((s) => s.trim().length > 0);
    
    for (const statement of statements) {
      await sql.query(statement.trim());
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully! Redirecting to homepage...",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database. Make sure DATABASE_URL is set.", details: String(error) },
      { status: 500 }
    );
  }
}
