"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    category_id: "",
    author: "Editorial Staff",
    is_featured: false,
    is_published: true,
    read_time: "5 min read",
    badge: "",
  });

  useEffect(() => {
    fetch("/api/seed")
      .catch(() => {});
    // We don't have a categories API, so we'll hardcode them
    setCategories([
      { id: 1, name: "Culture", slug: "culture" },
      { id: 2, name: "Food + Drink", slug: "food-drink" },
      { id: 3, name: "City Life", slug: "city-life" },
      { id: 4, name: "Nightlife", slug: "nightlife" },
      { id: 5, name: "Hidden Gems", slug: "hidden-gems" },
      { id: 6, name: "Lifestyle", slug: "lifestyle" },
    ]);
  }, []);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create article");
      }
    } catch {
      setError("Network error");
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white no-underline">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
              New Article
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm font-bold">{error}</div>
        )}

        <div className="bg-white border border-black/5 p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border-b-2 border-black/20 bg-transparent py-2 text-2xl font-bold focus:outline-none focus:border-primary"
              style={{ fontFamily: '"Playfair Display", serif' }}
              placeholder="Article title..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full border-b border-black/10 bg-transparent py-2 text-sm font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
              className="w-full border border-black/10 bg-transparent p-3 text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Content (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={12}
              className="w-full border border-black/10 bg-transparent p-3 text-sm font-mono focus:outline-none focus:border-primary resize-y"
              placeholder="<p>Article content here...</p>"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
              className="w-full border-b border-black/10 bg-transparent py-2 text-sm focus:outline-none focus:border-primary"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                className="w-full border border-black/10 bg-transparent p-2 text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full border-b border-black/10 bg-transparent py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Read Time</label>
              <input
                type="text"
                value={form.read_time}
                onChange={(e) => setForm((prev) => ({ ...prev, read_time: e.target.value }))}
                className="w-full border-b border-black/10 bg-transparent py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Badge</label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                className="w-full border-b border-black/10 bg-transparent py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="e.g. Feature Story, Foodie Alert"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                className="accent-primary"
              />
              <span className="text-xs font-bold uppercase tracking-wider">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="accent-primary"
              />
              <span className="text-xs font-bold uppercase tracking-wider">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white font-black text-xs uppercase tracking-widest px-8 py-3 hover:bg-black transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Publish Article"}
          </button>
          <Link
            href="/admin"
            className="border border-black/20 text-black font-black text-xs uppercase tracking-widest px-8 py-3 hover:bg-black hover:text-white transition-colors no-underline"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
