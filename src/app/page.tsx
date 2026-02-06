import { getDb, Article } from "@/lib/db";
import Ticker from "@/components/Ticker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getArticles(): Promise<Article[]> {
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
    return rows as unknown as Article[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();
  const featured = articles.find((a) => a.is_featured);
  const trending = articles.filter((a) => !a.is_featured).slice(0, 4);
  const spotlight = articles.find((a) => a.badge === "Culture Spotlight");

  return (
    <>
      <Ticker />
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="max-w-7xl mx-auto w-full px-6 py-12 lg:px-12 space-y-24">
          {/* Featured Article */}
          {featured && (
            <section>
              <ArticleCard article={featured} variant="featured" />
            </section>
          )}

          {/* Trending Now */}
          {trending.length > 0 && (
            <section>
              <div className="section-divider">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
                {trending.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Newsletter */}
          <Newsletter />

          {/* Culture Spotlight */}
          {spotlight && (
            <Link href={`/articles/${spotlight.slug}`} className="group cursor-pointer no-underline text-inherit block">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 overflow-hidden">
                  <img
                    alt={spotlight.title}
                    className="w-full h-[400px] object-cover"
                    src={spotlight.image_url}
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col justify-center">
                  <span className="text-primary font-black text-xs uppercase mb-4 tracking-widest">
                    {spotlight.badge}
                  </span>
                  <h3
                    className="text-4xl font-black mb-4 group-hover:text-primary transition-colors text-[#181111]"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {spotlight.title}
                  </h3>
                  {spotlight.excerpt && (
                    <p className="text-gray-500 mb-6 italic">{spotlight.excerpt}</p>
                  )}
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-gray-400">share</span>
                    <span className="material-symbols-outlined text-gray-400">thumb_up</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* No articles fallback */}
          {articles.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">database</span>
              <h2 className="text-3xl font-black mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
                Database Not Connected
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Set up your Vercel Postgres (Neon) database and seed it to see articles here.
              </p>
              <a
                href="/api/seed"
                className="inline-block bg-primary text-white font-black text-xs uppercase tracking-widest px-8 py-4 hover:bg-black transition-colors no-underline"
              >
                Seed Database
              </a>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
