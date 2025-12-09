import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { StorageService } from '../services/storageService';
import { ArrowRight, Clock, Calendar, Hash } from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const allPosts = StorageService.getPosts();
    // Sort by date desc
    const sorted = [...allPosts].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    setFeaturedPosts(sorted.filter(p => p.isFeatured).slice(0, 3));
    setRecentPosts(sorted.slice(0, 5));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-dark-bg pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6">
            <span className="block">Kodlayan Zihinler İçin</span>
            <span className="block text-primary-600">Dijital Bahçe</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Modern web teknolojileri, veri ve yapay zeka dünyasında gezinirken heybeme attıklarım: Teknik ipuçları, meraklı analizler ve öğrenme serüvenimden samimi notlar oluşturup sunuyorum.
          </p>
          <div className="mt-10 flex justify-center gap-4">
             <Link to="/blog" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-all">
               Yazıları Keşfet
               <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
             </Link>
             <Link to="/about" className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
               Hakkımda
             </Link>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 opacity-30 pointer-events-none">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-100 blur-3xl dark:bg-primary-900/20"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-100 blur-3xl dark:bg-purple-900/20"></div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Öne Çıkanlar</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/post/${post.slug}`}
                className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800"
              >
                <div className="flex-shrink-0 h-48 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                   <img 
                    className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500" 
                    src={post.coverImage} 
                    alt={post.title} 
                   />
                   <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded uppercase tracking-wide text-primary-600 dark:text-primary-400">
                     {post.category}
                   </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-sm text-gray-400">
                    <Calendar size={14} className="mr-1.5" />
                    <span className="mr-4">{formatDate(post.publishedAt)}</span>
                    <Clock size={14} className="mr-1.5" />
                    <span>{post.readingTimeMinutes} dk okuma</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent List */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Son Yazılar</h2>
          <Link to="/blog" className="text-primary-600 hover:text-primary-500 font-medium text-sm">Tümünü Gör &rarr;</Link>
        </div>
        <div className="space-y-10">
          {recentPosts.map((post) => (
            <article key={post.id} className="relative group">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="font-medium text-primary-600 dark:text-primary-400">{post.category}</span>
                    <span>•</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors mb-2">
                    <Link to={`/post/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                        <Hash size={10} className="mr-0.5" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};