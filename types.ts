export enum PostCategory {
  DEVLOG = 'DevLog',
  ARTICLE = 'Makale',
  PROJECT = 'Proje'
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown content
  coverImage?: string;
  category: PostCategory;
  tags: string[];
  publishedAt: string; // ISO Date string
  updatedAt: string;
  isFeatured: boolean;
  readingTimeMinutes: number;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  socialLinks: {
    github: string;
    twitter: string;
    linkedin: string;
  };
}