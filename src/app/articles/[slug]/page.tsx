import { getDb, Article, Comment } from "@/lib/db";
import Ticker from "@/components/Ticker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Comments from "@/components/Comments";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getArticle(slug: string) {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug,
        (SELECT COUNT(*) FROM comments WHERE article_id = a.id) as comments_count
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ${slug} AND a.is_published = true
    `;
    return rows[0] as unknown as Article | undefined;
  } catch {
    return undefined;
  }
}

async function getRelatedArticles(categoryId: number, excludeId: number) {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.category_id = ${categoryId} AND a.id != ${excludeId} AND a.is_published = true
      ORDER BY a.created_at DESC
      LIMIT 3
    `;
    return rows as unknown as Article[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found - Calgary Best" };
  return {
    title: `${article.title} - Calgary Best`,
    description: article.excerpt || "",
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.category_id, article.id);

  return (
    <>
      <Ticker />
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="max-w-4xl mx-auto w-full px-6 py-12 lg:px-12">
          {/* Article Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              {article.badge && (
                <span className="bg-primary text-white text-[10px] font-black px-2 py-1 uppercase">
                  {article.badge}
                </span>
              )}
              {article.category_name && (
                <a
                  href={`/categories/${article.category_slug}`}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary no-underline hover:underline"
                >
                  {article.category_name}
                </a>
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {article.read_time}
              </span>
            </div>
            <h1
              className="text-5xl lg:text-6xl font-black leading-[0.95] mb-6"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl text-gray-500 leading-relaxed border-l-2 border-primary pl-6 mb-8">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-y border-black/10 py-4">
              <span>By {article.author}</span>
              <span>&bull;</span>
              <span>{new Date(article.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span>&bull;</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">visibility</span>
                {article.views_count.toLocaleString()} views
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mb-12">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-[400px] lg:h-[500px] object-cover"
            />
          </div>

          {/* Article Content */}
          <div
            className="article-content prose max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share Bar */}
          <div className="flex items-center gap-6 border-y border-black/10 py-6 mb-12">
            <span className="font-black text-xs uppercase tracking-widest">Share this story</span>
            <div className="flex gap-3">
              {["public", "camera", "video_library", "mail"].map((icon) => (
                <div
                  key={icon}
                  className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </div>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">share</span>
              <span className="font-bold text-sm">
                {article.shares_count >= 1000
                  ? `${(article.shares_count / 1000).toFixed(article.shares_count >= 10000 ? 0 : 1)}K`
                  : article.shares_count}{" "}
                shares
              </span>
            </div>
          </div>

          {/* Comments */}
          <Comments articleId={article.id} />

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-20 border-t-4 border-black pt-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-10">
                More in {article.category_name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {related.map((r) => (
                  <ArticleCard key={r.id} article={r} />
                ))}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
