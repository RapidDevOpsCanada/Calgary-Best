import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    if (!q?.trim()) {
      return NextResponse.json({ articles: [] });
    }

    const sql = getDb();
    const searchTerm = `%${q}%`;
    const rows = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_published = true
        AND (
          a.title ILIKE ${searchTerm}
          OR a.excerpt ILIKE ${searchTerm}
          OR a.content ILIKE ${searchTerm}
        )
      ORDER BY a.created_at DESC
    `;
    return NextResponse.json({ articles: rows });
  } catch (error) {
    return NextResponse.json({ error: "Search failed", details: String(error) }, { status: 500 });
  }
}
