
export enum PostCategory {
  DEVLOG = 'DevLog',
  ARTICLE = 'Makale',
  PROJECT = 'Proje'
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image?: string;
  date: string;
  category: PostCategory;
  tags: string[];
  updatedAt: string;
  isFeatured: boolean;
  readingTimeMinutes: number;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
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
