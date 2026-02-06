import { getDb, Article } from "@/lib/db";
import Ticker from "@/components/Ticker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string }>;

async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) return [];
  try {
    const sql = getDb();
    const searchTerm = `%${query}%`;
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
    return rows as unknown as Article[];
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? await searchArticles(query) : [];

  return (
    <>
      <Ticker />
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="max-w-7xl mx-auto w-full px-6 py-12 lg:px-12">
          <div className="mb-16">
            <h1
              className="text-5xl font-black uppercase mb-8"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Search
            </h1>
            <SearchBar initialQuery={query} />
          </div>

          {query && (
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
              <p className="text-gray-400 text-lg">No articles found. Try a different search term.</p>
            </div>
          ) : null}
        </main>
        <Footer />
      </div>
    </>
  );
}
