"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const categories = [
  { name: "Culture", slug: "culture" },
  { name: "Food + Drink", slug: "food-drink" },
  { name: "City Life", slug: "city-life" },
  { name: "Nightlife", slug: "nightlife" },
];

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="flex flex-col items-center justify-between px-6 py-8 lg:px-20 border-b border-black/5 gap-6">
      <Link href="/" className="flex items-center gap-4 no-underline">
        <div className="flex flex-col items-center text-primary">
          <span className="material-symbols-outlined text-5xl font-black mb-1">rocket_launch</span>
          <h2
            className="text-[#181111] text-5xl font-black leading-none tracking-tighter uppercase"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Calgary Best
          </h2>
          <p className="text-[10px] tracking-[0.5em] font-bold text-gray-500 uppercase mt-2">
            Established 2024 &bull; The Urban Journal
          </p>
        </div>
      </Link>

      <nav className="flex w-full items-center justify-between border-y border-black/10 py-4 max-w-7xl">
        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-600">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="hover:text-primary transition-colors no-underline text-gray-600"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="flex items-center border-b border-black/20 pb-1">
            <span className="material-symbols-outlined text-lg text-gray-400">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs w-32 placeholder-gray-400 uppercase font-bold ml-2"
              placeholder="Search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center text-black"
          >
            <span className="material-symbols-outlined text-3xl">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="w-full max-w-7xl border-b border-black/10 pb-8 fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-4 text-primary">Categories</h4>
              <div className="flex flex-col gap-3">
                {["Culture", "Food + Drink", "City Life", "Nightlife", "Hidden Gems", "Lifestyle"].map(
                  (cat) => (
                    <Link
                      key={cat}
                      href={`/categories/${cat.toLowerCase().replace(/ \+ /g, "-").replace(/ /g, "-")}`}
                      className="text-sm text-gray-600 hover:text-primary transition-colors no-underline"
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  )
                )}
              </div>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-4 text-primary">Pages</h4>
              <div className="flex flex-col gap-3">
                <Link href="/admin" className="text-sm text-gray-600 hover:text-primary transition-colors no-underline" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                <Link href="/search" className="text-sm text-gray-600 hover:text-primary transition-colors no-underline" onClick={() => setMenuOpen(false)}>Search</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
