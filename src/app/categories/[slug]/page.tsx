import { getDb, Article, Category } from "@/lib/db";
import Ticker from "@/components/Ticker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getCategory(slug: string) {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM categories WHERE slug = ${slug}`;
    return rows[0] as unknown as Category | undefined;
  } catch {
    return undefined;
  }
}

async function getCategoryArticles(categoryId: number) {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.category_id = ${categoryId} AND a.is_published = true
      ORDER BY a.created_at DESC
    `;
    return rows as unknown as Article[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category Not Found - Calgary Best" };
  return {
    title: `${category.name} - Calgary Best`,
    description: category.description || `Browse ${category.name} articles on Calgary Best`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const articles = await getCategoryArticles(category.id);

  return (
    <>
      <Ticker />
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="max-w-7xl mx-auto w-full px-6 py-12 lg:px-12">
          <div className="section-divider">
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-primary">{category.name}</h1>
          </div>
          {category.description && (
            <p className="text-xl text-gray-500 mb-12 max-w-2xl">{category.description}</p>
          )}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">article</span>
              <p className="text-gray-400 text-lg">No articles in this category yet.</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
