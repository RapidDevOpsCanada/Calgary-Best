"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl border-b-4 border-black pb-2">
      <span className="material-symbols-outlined text-2xl text-gray-400 mr-3 self-center">search</span>
      <input
        className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-2xl font-bold placeholder-gray-300 uppercase tracking-tight"
        placeholder="Search articles..."
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <button
        type="submit"
        className="font-black uppercase tracking-widest text-sm hover:text-primary transition-colors"
      >
        GO
      </button>
    </form>
  );
}
