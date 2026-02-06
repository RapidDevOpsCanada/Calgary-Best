import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug,
        (SELECT COUNT(*) FROM comments WHERE article_id = a.id) as comments_count
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_published = true
      ORDER BY a.is_featured DESC, a.created_at DESC
    `;
    return NextResponse.json({ articles: rows });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles", details: String(error) }, { status: 500 });
  }
}
