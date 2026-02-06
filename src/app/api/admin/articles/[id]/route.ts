import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title, slug, excerpt, content, image_url, category_id,
      author, is_featured, is_published, read_time, badge
    } = body;

    const sql = getDb();
    const rows = await sql`
      UPDATE articles SET
        title = ${title?.trim()},
        slug = ${slug?.trim()},
        excerpt = ${excerpt?.trim() || null},
        content = ${content?.trim()},
        image_url = ${image_url || ''},
        category_id = ${category_id ? parseInt(category_id) : null},
        author = ${author?.trim() || 'Editorial Staff'},
        is_featured = ${is_featured || false},
        is_published = ${is_published !== false},
        read_time = ${read_time || '5 min read'},
        badge = ${badge?.trim() || null},
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ article: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update article", details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const sql = getDb();
    const rows = await sql`DELETE FROM articles WHERE id = ${parseInt(id)} RETURNING id`;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete article", details: String(error) }, { status: 500 });
  }
}
