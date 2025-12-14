
import React, { useState, useEffect } from 'react';
import { BlogPost, PostCategory, Subscriber } from '../types';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { Button } from '../components/Button';
import { Plus, Trash2, Edit2, Sparkles, Save, X, LogOut, FileText, BarChart2, Hash, Layers, Users, Mail, Database, Terminal } from 'lucide-react';
import { Seo } from '../components/Seo';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Main Logic
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'posts' | 'subscribers'>('posts');
  const [showDbSetup, setShowDbSetup] = useState(false);
  
  // MODAL STATE: Silinecek yazının ID'sini tutar
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      refreshData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const env = (import.meta as any).env;
    const adminPassword = env?.VITE_ADMIN_PASSWORD || '123';
    
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const refreshData = async () => {
    try {
      // Fetch Posts
      let fetchedPosts = await StorageService.getPosts();

      // OTOMATİK VERİ YÜKLEME (Seed)
      if (fetchedPosts.length === 0) {
        try {
            console.log("Veritabanı boş, otomatik içerik yükleniyor...");
            await StorageService.seedData();
            fetchedPosts = await StorageService.getPosts();
        } catch (seedError) {
            console.error("Otomatik veri yükleme hatası:", seedError);
        }
      }
      setPosts(fetchedPosts);

      // Fetch Subscribers
      try {
          const fetchedSubs = await StorageService.getSubscribers();
          setSubscribers(fetchedSubs);
      } catch (e) {
          console.error("Aboneler çekilemedi:", e);
      }

    } catch (error) {
      console.error("Refresh failed", error);
    }
  };

  // --- STATISTICS CALCULATION ---
  const stats = {
      total: posts.length,
      featured: posts.filter(p => p.isFeatured).length,
      categories: new Set(posts.map(p => p.category)).size,
      subscribers: subscribers.length,
      totalWords: posts.reduce((acc, post) => acc + (post.content ? post.content.trim().split(/\s+/).length : 0), 0)
  };

  // --- ACTIONS ---

  const handleCreateNew = () => {
    setCurrentPost({
      id: crypto.randomUUID(),
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: PostCategory.ARTICLE,
      tags: [],
      date: new Date().toISOString(),
      isFeatured: false,
      readingTimeMinutes: 0
    });
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const executeDelete = async () => {
    if (!postToDelete) return;
    const id = postToDelete;
    
    setIsSaving(true);
    try {
      await StorageService.deletePost(id);
      setPosts(current => current.filter(p => p.id !== id)); 
      setPostToDelete(null);
    } catch (error: any) {
      console.error("Silme Hatası:", error);
      setPostToDelete(null);
      // Hata durumunda yardım modalını tetiklemek yerine konsola yazıyoruz, 
      // kullanıcı manuel olarak DB Setup butonuna basabilir.
      alert(`Silme işlemi başarısız. Lütfen veritabanı kurulumunun yapıldığından emin olun (RLS Politikaları).\n\nHata: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAll = async () => {
    const confirm1 = window.confirm('DİKKAT: TÜM İÇERİK SİLİNECEK!');
    if (!confirm1) return;
    
    setIsSaving(true);
    try {
        await StorageService.deleteAllData();
        setPosts([]);
        alert("Tüm veriler temizlendi.");
    } catch (error: any) {
        alert(`HATA: ${error.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleSavePost = async () => {
    if (!currentPost.title || !currentPost.content) {
      alert('Başlık ve içerik gereklidir.');
      return;
    }

    setIsSaving(true);
    let finalSummary = currentPost.summary;

    if (!finalSummary && currentPost.content) {
      try {
        finalSummary = await GeminiService.generateSummary(currentPost.content);
      } catch (e) {
        finalSummary = currentPost.content.substring(0, 150) + '...';
      }
    }

    const slug = currentPost.slug || currentPost.title.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const postToSave: BlogPost = {
      ...currentPost as BlogPost,
      slug,
      summary: finalSummary || '',
      readingTimeMinutes: StorageService.calculateReadingTime(currentPost.content),
      updatedAt: new Date().toISOString(),
      image: currentPost.image || `https://picsum.photos/800/400?random=${Date.now()}`
    };

    try {
      await StorageService.savePost(postToSave);
      await refreshData();
      setIsEditing(false);
    } catch (error: any) {
      alert(`Kayıt Hatası: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const fixGrammarAI = async () => {
      if (!currentPost.content) return;
      setIsSaving(true);
      try {
        const fixed = await GeminiService.fixGrammar(currentPost.content);
        setCurrentPost({ ...currentPost, content: fixed });
      } catch (e) { alert("AI servisi yanıt vermedi."); } finally { setIsSaving(false); }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCurrentPost({ ...currentPost, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Seo title="Admin Girişi" description="Yönetici girişi sayfası." />
        <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Admin Girişi</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700"
              placeholder="Şifre"
              autoFocus
            />
            {loginError && <p className="text-red-500 text-sm text-center">Hatalı şifre.</p>}
            <Button type="submit" className="w-full">Giriş Yap</Button>
          </form>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Seo title={currentPost.id ? "Yazıyı Düzenle" : "Yeni Yazı"} description="Admin içerik düzenleyici." />
        <div className="flex justify-between items-center mb-6 bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm sticky top-20 z-10 border dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white">{currentPost.id ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</h2>
          <div className="flex gap-2">
             <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}><X size={18} className="mr-2"/> İptal</Button>
             <Button onClick={handleSavePost} isLoading={isSaving}><Save size={18} className="mr-2"/> Kaydet</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
             <input 
               type="text" 
               placeholder="Yazı Başlığı"
               value={currentPost.title} 
               onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
               className="w-full p-3 text-lg font-bold border rounded bg-white dark:bg-dark-card dark:text-white dark:border-gray-700"
             />
             <div className="relative">
               <textarea 
                 value={currentPost.content} 
                 onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                 rows={25}
                 placeholder="İçerik buraya (Markdown desteklenir)..."
                 className="w-full p-4 border rounded font-mono text-sm bg-white dark:bg-dark-card dark:text-white dark:border-gray-700 leading-relaxed"
               />
               <Button size="sm" variant="secondary" className="absolute top-4 right-4 opacity-75 hover:opacity-100" onClick={fixGrammarAI} disabled={isSaving}>
                  <Sparkles size={14} className="mr-1"/> AI Düzelt
               </Button>
             </div>
          </div>

          <div className="space-y-4">
             <div className="bg-white dark:bg-dark-card p-4 rounded border dark:border-gray-700">
                <h3 className="font-bold mb-3 dark:text-gray-200">Görsel</h3>
                {currentPost.image && <img src={currentPost.image} className="w-full h-40 object-cover rounded mb-3 border dark:border-gray-700" />}
                <input type="text" placeholder="Görsel URL..." value={currentPost.image || ''} onChange={e => setCurrentPost({...currentPost, image: e.target.value})} className="w-full p-2 text-sm border rounded mb-2 bg-transparent dark:text-white dark:border-gray-700" />
                <input type="file" onChange={handleImageUpload} className="text-xs dark:text-gray-400" />
             </div>
             
             <div className="bg-white dark:bg-dark-card p-4 rounded border dark:border-gray-700 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">KATEGORİ</label>
                    <select value={currentPost.category} onChange={e => setCurrentPost({...currentPost, category: e.target.value as PostCategory})} className="w-full p-2 border rounded bg-transparent dark:text-white dark:border-gray-700">
                    {Object.values(PostCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">ÖZET</label>
                    <textarea value={currentPost.summary} onChange={e => setCurrentPost({...currentPost, summary: e.target.value})} rows={4} className="w-full p-2 border rounded bg-transparent dark:text-white dark:border-gray-700 text-sm" />
                </div>
                
                <label className="flex items-center space-x-2 text-sm cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                   <input type="checkbox" checked={currentPost.isFeatured} onChange={e => setCurrentPost({...currentPost, isFeatured: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                   <span className="dark:text-white">Ana Sayfada Öne Çıkar</span>
                </label>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      <Seo title="Yönetim Paneli" description="Blog içerik yönetimi." />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
            <h1 className="text-3xl font-bold dark:text-white">Yönetim Paneli</h1>
            <p className="text-gray-500 mt-1">Hoş geldiniz, içeriklerinizi buradan yönetebilirsiniz.</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowDbSetup(true)} variant="secondary" size="sm" className="hidden sm:inline-flex">
                <Database size={16} className="mr-2" /> Veritabanı Kurulumu
            </Button>
            <Button onClick={handleDeleteAll} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
               <Trash2 size={16} className="mr-2"/> Tümünü Sil
            </Button>
             <Button onClick={handleCreateNew} size="sm">
               <Plus size={16} className="mr-2" /> Yeni Yazı
             </Button>
             <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut size={16} />
             </Button>
        </div>
      </div>

      {/* STATS DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center"><FileText size={14} className="mr-1"/> Toplam Yazı</span>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
          </div>
          <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center"><Sparkles size={14} className="mr-1"/> Öne Çıkan</span>
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.featured}</span>
          </div>
          <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setViewMode('subscribers')}>
              <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center"><Users size={14} className="mr-1"/> Aboneler</span>
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.subscribers}</span>
          </div>
          <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center"><BarChart2 size={14} className="mr-1"/> Toplam Kelime</span>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{(stats.totalWords / 1000).toFixed(1)}k</span>
          </div>
      </div>

      {/* TABS (Mobile / Desktop) */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
        <button 
            className={`px-4 py-2 font-medium text-sm transition-colors relative whitespace-nowrap ${viewMode === 'posts' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}
            onClick={() => setViewMode('posts')}
        >
            Yazılar
            {viewMode === 'posts' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400"></span>}
        </button>
        <button 
            className={`px-4 py-2 font-medium text-sm transition-colors relative whitespace-nowrap ${viewMode === 'subscribers' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}
            onClick={() => setViewMode('subscribers')}
        >
            Abone Listesi
            {viewMode === 'subscribers' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400"></span>}
        </button>
      </div>

      {viewMode === 'posts' ? (
        posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-dark-card rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500">Liste boş, örnek veriler otomatik yükleniyor...</p>
            </div>
        ) : (
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Kategori</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tarih</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {posts.map(post => (
                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                                <div className="md:hidden text-xs text-gray-500 mt-1">
                                    {post.category} • {new Date(post.date).toLocaleDateString()}
                                </div>
                                {post.isFeatured && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded md:ml-1 mt-1 inline-block">Öne Çıkan</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                {post.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                {new Date(post.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                    <button 
                                        type="button" 
                                        onClick={() => handleEdit(post)} 
                                        className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors" 
                                        title="Düzenle"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setPostToDelete(post.id)} 
                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" 
                                        title="Sil"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            </div>
        )
      ) : (
        /* SUBSCRIBERS VIEW */
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
             {subscribers.length === 0 ? (
                 <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                     <Mail size={48} className="mx-auto mb-4 opacity-50" />
                     <p>Henüz bültene abone olan kimse yok.</p>
                 </div>
             ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta Adresi</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {subscribers.map(sub => (
                            <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                                    {sub.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                    {new Date(sub.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
             )}
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Yazıyı Sil</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Bu işlemi geri alamazsınız. Bu blog yazısı kalıcı olarak silinecektir. Emin misiniz?
              </p>
              <div className="flex justify-center space-x-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setPostToDelete(null)}
                  disabled={isSaving}
                >
                  Vazgeç
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={executeDelete}
                  isLoading={isSaving}
                >
                  Evet, Sil
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERİTABANI KURULUM MODALI (HELP) */}
      {showDbSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-gray-900 text-gray-300 rounded-xl shadow-2xl w-full max-w-3xl border border-gray-700 overflow-hidden relative my-8">
                <button onClick={() => setShowDbSetup(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <Terminal className="text-primary-500 mr-3" size={24} />
                        <h2 className="text-xl font-bold text-white">Supabase Veritabanı Kurulumu</h2>
                    </div>
                    
                    <p className="mb-4 text-sm">
                        Güvenlik ve veri bütünlüğü için Supabase panelinizdeki <strong>SQL Editor</strong> kısmına gidip aşağıdaki komutları çalıştırmanız önerilir.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-white font-bold text-sm mb-2 bg-gray-800 p-2 rounded inline-block">1. Tabloları Oluşturma</h3>
                            <pre className="bg-black p-4 rounded-lg text-xs font-mono overflow-x-auto border border-gray-800 text-green-400">
{`-- Blog Yazıları Tablosu
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  image text,
  category text,
  tags text[],
  is_featured boolean default false,
  reading_time_minutes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aboneler Tablosu
create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);`}
                            </pre>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-sm mb-2 bg-gray-800 p-2 rounded inline-block">2. Güvenlik Politikaları (RLS)</h3>
                            <p className="text-xs mb-2">Bu kurallar, veritabanına kimin yazıp kimin okuyabileceğini belirler. Anonim anahtar (public key) kullanıldığı için bu ayarlar kritiktir.</p>
                            <pre className="bg-black p-4 rounded-lg text-xs font-mono overflow-x-auto border border-gray-800 text-blue-400">
{`-- RLS'i Etkinleştir
alter table posts enable row level security;
alter table subscribers enable row level security;

-- POSTS: Herkes okuyabilir (SELECT)
create policy "Public posts are viewable by everyone" on posts
  for select using (true);

-- POSTS: Herkes ekleyebilir/düzenleyebilir/silebilir (DEMO İÇİN)
-- NOT: Gerçek prodüksiyonda buraya "auth.uid() = user_id" gibi kurallar eklenmelidir.
create policy "Public posts are insertable by everyone" on posts
  for insert with check (true);
create policy "Public posts are updateable by everyone" on posts
  for update using (true);
create policy "Public posts are deletable by everyone" on posts
  for delete using (true);

-- SUBSCRIBERS: Herkes ekleyebilir (Abone olma)
create policy "Public subscribers are insertable by everyone" on subscribers
  for insert with check (true);

-- SUBSCRIBERS: Herkes okuyabilir (Admin panelinde listeleme için - DEMO)
create policy "Public subscribers are viewable by everyone" on subscribers
  for select using (true);`}
                            </pre>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 p-4 text-right">
                    <Button onClick={() => setShowDbSetup(false)}>Kapat</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
