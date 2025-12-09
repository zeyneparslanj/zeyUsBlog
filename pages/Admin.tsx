import React, { useState, useEffect } from 'react';
import { BlogPost, PostCategory } from '../types';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { Button } from '../components/Button';
import { Plus, Trash2, Edit2, Sparkles, Save, X, LayoutList } from 'lucide-react';

export const Admin: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    refreshPosts();
  }, []);

  const refreshPosts = () => {
    setPosts(StorageService.getPosts());
  };

  const handleCreateNew = () => {
    setCurrentPost({
      id: Date.now().toString(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: PostCategory.ARTICLE,
      tags: [],
      publishedAt: new Date().toISOString(),
      isFeatured: false,
      readingTimeMinutes: 0
    });
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      StorageService.deletePost(id);
      refreshPosts();
    }
  };

  const handleSave = () => {
    if (!currentPost.title || !currentPost.content) {
      alert('Başlık ve içerik zorunludur.');
      return;
    }

    const slug = currentPost.slug || currentPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const readingTime = StorageService.calculateReadingTime(currentPost.content);

    const postToSave: BlogPost = {
      ...currentPost as BlogPost,
      slug,
      readingTimeMinutes: readingTime,
      updatedAt: new Date().toISOString(),
      coverImage: currentPost.coverImage || `https://picsum.photos/800/400?random=${Date.now()}`
    };

    StorageService.savePost(postToSave);
    setIsEditing(false);
    refreshPosts();
  };

  const generateSummaryAI = async () => {
    if (!currentPost.content) return;
    setLoadingAI(true);
    try {
      const summary = await GeminiService.generateSummary(currentPost.content);
      setCurrentPost({ ...currentPost, excerpt: summary });
    } catch (e) {
      alert("AI servisi şu an kullanılamıyor veya API Key eksik.");
    } finally {
      setLoadingAI(false);
    }
  };

  const fixGrammarAI = async () => {
      if (!currentPost.content) return;
      setLoadingAI(true);
      try {
        const fixed = await GeminiService.fixGrammar(currentPost.content);
        setCurrentPost({ ...currentPost, content: fixed });
      } catch (e) {
          alert("AI servisi şu an kullanılamıyor.");
      } finally {
          setLoadingAI(false);
      }
  }

  // Tags input handler helper
  const handleTagsChange = (val: string) => {
    const tags = val.split(',').map(t => t.trim()).filter(Boolean);
    setCurrentPost({ ...currentPost, tags });
  };

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentPost.id ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
          </h2>
          <div className="flex space-x-2">
             <Button variant="ghost" onClick={() => setIsEditing(false)}>
                <X size={18} className="mr-2" /> İptal
             </Button>
             <Button onClick={handleSave}>
                <Save size={18} className="mr-2" /> Kaydet
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Başlık</label>
               <input 
                 type="text" 
                 value={currentPost.title} 
                 onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                 className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-dark-card text-gray-900 dark:text-white"
               />
             </div>
             <div>
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">İçerik (Markdown)</label>
                   <Button size="sm" variant="secondary" onClick={fixGrammarAI} isLoading={loadingAI} disabled={!currentPost.content}>
                      <Sparkles size={14} className="mr-1 text-purple-500" /> Düzelt (AI)
                   </Button>
                </div>
               <textarea 
                 value={currentPost.content} 
                 onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                 rows={20}
                 className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-white"
               />
             </div>
          </div>

          <div className="space-y-4">
             <div className="bg-white dark:bg-dark-card p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Ayarlar</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Kategori</label>
                    <select 
                      value={currentPost.category}
                      onChange={e => setCurrentPost({...currentPost, category: e.target.value as PostCategory})}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent dark:text-white"
                    >
                      {Object.values(PostCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                     <div className="flex justify-between mb-1">
                        <label className="block text-xs font-medium text-gray-500">Özet</label>
                        <button onClick={generateSummaryAI} disabled={loadingAI || !currentPost.content} className="text-xs text-purple-500 hover:text-purple-600 flex items-center">
                           <Sparkles size={10} className="mr-0.5" /> Oluştur
                        </button>
                     </div>
                     <textarea 
                        value={currentPost.excerpt}
                        onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                        rows={4}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent dark:text-white"
                     />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Etiketler (virgül ile)</label>
                    <input 
                      type="text" 
                      value={currentPost.tags?.join(', ')}
                      onChange={e => handleTagsChange(e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent dark:text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={currentPost.isFeatured}
                      onChange={e => setCurrentPost({...currentPost, isFeatured: e.target.checked})}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Öne Çıkar</label>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İçerik Yönetimi</h1>
          <p className="text-gray-500 mt-1">Blog yazılarını ekle, düzenle veya sil.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus size={20} className="mr-2" /> Yeni Yazı
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-card shadow overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {posts.length === 0 ? (
            <li className="p-8 text-center text-gray-500">Henüz hiç yazı yok.</li>
          ) : (
            posts.map(post => (
              <li key={post.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                     {post.coverImage && <img src={post.coverImage} className="h-full w-full object-cover" alt="" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-600 truncate">{post.category}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">{post.title}</p>
                    <div className="flex items-center text-xs text-gray-500">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${post.isFeatured ? 'bg-yellow-400' : 'bg-gray-300'}`}></span>
                        {post.isFeatured ? 'Öne Çıkan' : 'Standart'}
                        <span className="mx-2">•</span>
                        {new Date(post.updatedAt).toLocaleDateString()} tarihinde güncellendi
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(post)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};