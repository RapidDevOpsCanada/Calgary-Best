"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  category_name: string;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  comments_count: number;
  created_at: string;
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [seedStatus, setSeedStatus] = useState<string>("");

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      setArticles([]);
    }
    setLoading(false);
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete article");
    }
  }

  async function handleSeed() {
    setSeedStatus("Seeding...");
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      if (res.ok) {
        setSeedStatus("Database seeded! Refreshing...");
        setTimeout(() => {
          fetchArticles();
          setSeedStatus("");
        }, 1000);
      } else {
        setSeedStatus(`Error: ${data.error}`);
      }
    } catch {
      setSeedStatus("Network error during seed.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-primary no-underline">
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                Admin Panel
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Calgary Best CMS</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSeed}
              className="bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-primary transition-colors"
            >
              Seed DB
            </button>
            <Link
              href="/admin/articles/new"
              className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-black transition-colors no-underline"
            >
              + New Article
            </Link>
          </div>
        </div>
      </div>

      {seedStatus && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 text-center">
          <p className="text-sm font-bold text-yellow-800">{seedStatus}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Articles", value: articles.length, icon: "article" },
            { label: "Published", value: articles.filter((a) => a.is_published).length, icon: "check_circle" },
            { label: "Featured", value: articles.filter((a) => a.is_featured).length, icon: "star" },
            { label: "Total Views", value: articles.reduce((sum, a) => sum + (a.views_count || 0), 0).toLocaleString(), icon: "visibility" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-black/5 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">{stat.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</span>
              </div>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Articles Table */}
        <div className="bg-white border border-black/5">
          <div className="border-b border-black/5 px-6 py-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">All Articles</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">database</span>
              <p className="text-gray-400 mb-4">No articles found. Seed the database to get started.</p>
              <button
                onClick={handleSeed}
                className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-black transition-colors"
              >
                Seed Database
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Title</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Views</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-black/5 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <Link href={`/articles/${article.slug}`} className="font-bold text-sm hover:text-primary transition-colors no-underline text-[#181111]">
                          {article.title}
                        </Link>
                        {article.is_featured && (
                          <span className="ml-2 text-[9px] bg-primary/10 text-primary font-black px-1.5 py-0.5 uppercase">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{article.category_name || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 uppercase ${article.is_published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {article.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{(article.views_count || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary transition-colors no-underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
