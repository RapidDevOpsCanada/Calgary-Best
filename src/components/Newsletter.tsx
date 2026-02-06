"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Welcome to the crew! Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section className="border-y-8 border-black py-16 flex flex-col items-center text-center">
      <h2
        className="text-6xl font-black uppercase mb-4 italic"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        DON&apos;T MISS THE BUZZ
      </h2>
      <p className="text-lg max-w-xl mb-10 font-medium text-gray-600 uppercase tracking-tight">
        Join 50k+ Calgarians who get the hottest trends delivered straight to their inbox daily.
      </p>
      <form onSubmit={handleSubmit} className="flex w-full max-w-lg border-b-2 border-black pb-2">
        <input
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-xl placeholder-gray-300 italic"
          style={{ fontFamily: '"Playfair Display", serif' }}
          placeholder="your@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="font-black uppercase tracking-widest text-sm hover:text-primary transition-colors disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "..." : "SUBSCRIBE"}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm font-bold uppercase tracking-wider ${status === "success" ? "text-green-600" : "text-primary"}`}>
          {message}
        </p>
      )}
    </section>
  );
}
