import { NextRequest, NextResponse } from "next/server";
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
      ORDER BY a.created_at DESC
    `;
    return NextResponse.json({ articles: rows });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles", details: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title, slug, excerpt, content, image_url, category_id,
      author, is_featured, is_published, read_time, badge
    } = body;

    if (!title?.trim() || !slug?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "title, slug, and content are required" }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO articles (title, slug, excerpt, content, image_url, category_id, author, is_featured, is_published, read_time, badge)
      VALUES (
        ${title.trim()},
        ${slug.trim()},
        ${excerpt?.trim() || null},
        ${content.trim()},
        ${image_url || ''},
        ${category_id ? parseInt(category_id) : null},
        ${author?.trim() || 'Editorial Staff'},
        ${is_featured || false},
        ${is_published !== false},
        ${read_time || '5 min read'},
        ${badge?.trim() || null}
      )
      RETURNING *
    `;
    return NextResponse.json({ article: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create article", details: String(error) }, { status: 500 });
  }
}
