import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, PostCategory } from '../types';
import { StorageService } from '../services/storageService';
import { Search, Filter } from 'lucide-react';

export const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const allPosts = StorageService.getPosts();
    // Sort desc date
    allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  }, []);

  useEffect(() => {
    let result = posts;

    // Filter by Category
    if (activeCategory !== 'Tümü') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    setFilteredPosts(result);
  }, [activeCategory, searchQuery, posts]);

  const categories = ['Tümü', ...Object.values(PostCategory)];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Yazılım geliştirme, ipuçları ve proje deneyimleri üzerine düşüncelerim.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(post => (
          <Link 
            key={post.id}
            to={`/post/${post.slug}`}
            className="flex flex-col bg-white dark:bg-dark-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden group"
          >
             <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
               <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             </div>
             <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                   <span className="font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">{post.category}</span>
                   <span>{post.readingTimeMinutes} dk okuma</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="text-sm text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                  {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                </div>
             </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <Filter size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sonuç bulunamadı</h3>
          <p className="mt-1 text-gray-500">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
        </div>
      )}
    </div>
  );
};