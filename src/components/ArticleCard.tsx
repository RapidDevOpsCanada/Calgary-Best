import Link from "next/link";
import type { Article } from "@/lib/db";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/articles/${article.slug}`} className="group cursor-pointer no-underline text-inherit block">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 overflow-hidden">
            <img
              alt={article.title}
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              src={article.image_url}
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              {article.badge && (
                <span className="bg-primary text-white text-[10px] font-black px-2 py-1 uppercase">
                  {article.badge}
                </span>
              )}
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                {formatTimeAgo(article.created_at)}
              </span>
            </div>
            <h1
              className="text-6xl lg:text-7xl editorial-title mb-6 group-hover:text-primary transition-colors text-[#181111]"
            >
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-lg text-gray-600 mb-8 leading-relaxed border-l-2 border-primary pl-6">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">share</span>
                <span className="font-bold text-sm tracking-tighter">
                  {formatCount(article.shares_count)} SHARES
                </span>
              </div>
              {article.comments_count !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">chat_bubble</span>
                  <span className="font-bold text-sm tracking-tighter">
                    {article.comments_count} COMMENTS
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/articles/${article.slug}`} className="article-card flex gap-4 group cursor-pointer no-underline text-inherit">
        <div className="w-24 h-24 overflow-hidden shrink-0">
          <img alt={article.title} className="w-full h-full object-cover" src={article.image_url} />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-[#181111]">
            {article.title}
          </h4>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            {article.category_name}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.slug}`} className="article-card flex flex-col group cursor-pointer no-underline text-inherit">
      <div className="aspect-[16/10] overflow-hidden mb-6 relative">
        {article.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black text-white text-[10px] font-black px-2 py-1 uppercase">
              {article.badge}
            </span>
          </div>
        )}
        <img alt={article.title} className="w-full h-full object-cover" src={article.image_url} />
      </div>
      <h3
        className="text-3xl font-black leading-tight mb-4 group-hover:text-primary transition-colors text-[#181111]"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
      )}
      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {article.category_name && <span className="text-primary">{article.category_name}</span>}
        <span>&bull;</span>
        <span>{article.read_time}</span>
        {article.shares_count > 0 && (
          <>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">favorite</span>
              {formatCount(article.shares_count)}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toString();
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
