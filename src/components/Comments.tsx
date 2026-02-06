"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export default function Comments({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    fetch(`/api/comments?article_id=${articleId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []);
        setLoadingComments(false);
      })
      .catch(() => setLoadingComments(false));
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: articleId,
          author_name: authorName.trim(),
          content: content.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        setAuthorName("");
        setContent("");
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-16 border-t-4 border-black pt-8">
      <h3 className="text-2xl font-black uppercase tracking-tight mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-12 space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full border-b-2 border-black/20 bg-transparent py-2 text-sm font-bold uppercase tracking-wider placeholder-gray-300 focus:outline-none focus:border-primary"
        />
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full border-b-2 border-black/20 bg-transparent py-2 text-sm placeholder-gray-300 focus:outline-none focus:border-primary resize-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-primary text-white font-black text-xs uppercase tracking-widest px-6 py-3 hover:bg-black transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Posting..." : "Post Comment"}
        </button>
        {status === "error" && (
          <p className="text-primary text-xs font-bold uppercase">Error posting comment. Please try again.</p>
        )}
      </form>

      {loadingComments ? (
        <p className="text-gray-400 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm italic">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-black/5 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-black text-xs">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-bold text-sm">{comment.author_name}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed ml-11">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
