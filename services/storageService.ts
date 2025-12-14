
import { BlogPost, PostCategory, Subscriber } from '../types';
import { supabase } from './supabaseClient';
import { posts as samplePosts } from '../data/blogPosts';

const mapPostFromDB = (data: any): BlogPost => ({
  id: data.id,
  title: data.title,
  slug: data.slug,
  summary: data.summary,
  content: data.content,
  image: data.image,
  date: data.created_at || data.date || new Date().toISOString(),
  category: (data.category as PostCategory) || PostCategory.ARTICLE,
  tags: Array.isArray(data.tags) ? data.tags : [],
  updatedAt: data.updated_at || new Date().toISOString(),
  isFeatured: !!data.is_featured,
  readingTimeMinutes: data.reading_time_minutes || 0
});

export const StorageService = {
  testConnection: async (): Promise<boolean> => {
      try {
          const { error } = await supabase.from('posts').select('id').limit(1);
          return !error;
      } catch (e) {
          return false;
      }
  },

  getPosts: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
        console.error("Veri çekme hatası:", error.message);
        return [];
    }
    if (!data) return [];
    return data.map(mapPostFromDB);
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return undefined;
    return mapPostFromDB(data);
  },

  savePost: async (post: BlogPost): Promise<void> => {
    const dbPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      image: post.image,
      created_at: post.date,
      category: post.category,
      tags: post.tags,
      updated_at: new Date().toISOString(),
      is_featured: post.isFeatured,
      reading_time_minutes: post.readingTimeMinutes
    };

    const { error } = await supabase.from('posts').upsert(dbPost, { onConflict: 'id' });
    if (error) throw error;
  },

  deletePost: async (id: string): Promise<void> => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  },

  deleteAllData: async (): Promise<void> => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); 

    if (error) {
        throw error;
    }
  },

  // --- SUBSCRIBER METHODS ---

  addSubscriber: async (email: string): Promise<void> => {
    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Geçersiz e-posta adresi.");
    }

    const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);
    
    // Eğer duplicate key hatası varsa (zaten kayıtlıysa) hata fırlatma, başarılı say
    if (error && error.code !== '23505') { 
        throw error;
    }
  },

  getSubscribers: async (): Promise<Subscriber[]> => {
    const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Aboneler çekilemedi (Tablo yok olabilir):", error);
        return [];
    }
    return data as Subscriber[];
  },

  seedData: async (): Promise<void> => {
    const dbPosts = samplePosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      image: post.image,
      created_at: post.date,
      category: post.category,
      tags: post.tags,
      updated_at: post.updatedAt,
      is_featured: post.isFeatured,
      reading_time_minutes: post.readingTimeMinutes
    }));

    const { error } = await supabase.from('posts').upsert(dbPosts, { onConflict: 'id' });
    
    if (error) {
       console.error("Seed Insert Error:", error);
       throw error;
    }
  },

  calculateReadingTime: (text: string): number => {
    if (!text) return 0;
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  }
};
