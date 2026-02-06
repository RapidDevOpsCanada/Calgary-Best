import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const sql = getDb();
    const rows = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ${parseInt(id)}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ article: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch article", details: String(error) }, { status: 500 });
  }
}
