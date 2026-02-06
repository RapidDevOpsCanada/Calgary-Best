import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("article_id");
    if (!articleId) {
      return NextResponse.json({ error: "article_id is required" }, { status: 400 });
    }
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM comments WHERE article_id = ${parseInt(articleId)} ORDER BY created_at DESC
    `;
    return NextResponse.json({ comments: rows });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments", details: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { article_id, author_name, content } = body;

    if (!article_id || !author_name?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "article_id, author_name, and content are required" }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO comments (article_id, author_name, content)
      VALUES (${parseInt(article_id)}, ${author_name.trim()}, ${content.trim()})
      RETURNING *
    `;
    return NextResponse.json({ comment: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment", details: String(error) }, { status: 500 });
  }
}
