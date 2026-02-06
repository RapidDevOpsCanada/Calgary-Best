import { neon } from "@neondatabase/serverless";

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(process.env.DATABASE_URL);
}

// Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  author: string;
  is_featured: boolean;
  is_published: boolean;
  shares_count: number;
  views_count: number;
  comments_count?: number;
  read_time: string;
  badge: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  article_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}
