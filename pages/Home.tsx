
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { StorageService } from '../services/storageService';
import { ArrowRight, Clock, Calendar, Hash, Coffee, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Seo } from '../components/Seo';

export const Home: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subMessage, setSubMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const allPosts = await StorageService.getPosts();
        
        // Data is already sorted by date desc from service
        const sorted = [...allPosts].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setFeaturedPosts(sorted.filter(p => p.isFeatured).slice(0, 3));
        setRecentPosts(sorted.slice(0, 5));
      } catch (error) {
        console.error("Failed to load home posts", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubStatus('loading');
    setSubMessage('');

    try {
        await StorageService.addSubscriber(email);
        setSubStatus('success');
        setEmail('');
    } catch (error: any) {
        console.error(error);
        setSubStatus('error');
        if (error.message?.includes('relation "subscribers" does not exist')) {
             setSubMessage('Sistem güncellemesi yapılıyor. Lütfen daha sonra tekrar deneyin.');
        } else {
             setSubMessage('Bir hata oluştu. Lütfen e-posta adresinizi kontrol edin.');
        }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // --- EMPTY STATE HANDLING ---
  if (!isLoading && featuredPosts.length === 0 && recentPosts.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
              <Seo title="Ana Sayfa" description="Zey'US Geliştirici Bloğu - Yazılım, Teknoloji ve Yapay Zeka." />
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                  <Coffee size={48} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Henüz Yazı Yok</h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                  Veritabanı sıfırlanmış veya henüz hiç içerik eklenmemiş. Yazıları görmek için Yönetici paneline gidip örnek verileri yükleyin.
              </p>
              <Link 
                  to="/admin" 
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md"
              >
                  Yönetici Paneline Git
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      <Seo 
        title="Ana Sayfa" 
        description="Zeynep'in dijital bahçesi. Web teknolojileri, yapay zeka ve veri bilimi üzerine profesyonel notlar. Ve biraz da kahve, Zey'ce notlar tabii ki." 
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-dark-bg pt-12 pb-16 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
            Zey'us Blog Yayında
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-gray-900 dark:text-white mb-6">
            <span className="block">Kodlayan Zihinler İçin</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 mt-2">Dijital Bahçe</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-300 px-2 leading-relaxed">
            Modern web teknolojileri, veri bilimi ve yapay zeka dünyasında gezinirken edindiğim teknik ipuçları ve deneyimler.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
             <Link to="/blog" className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg shadow-lg shadow-primary-500/30 text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-1">
               Yazıları Keşfet
               <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
             </Link>
             <Link to="/about" className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border border-gray-200 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-md">
               Hakkımda
             </Link>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 opacity-40 pointer-events-none overflow-hidden">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-primary-200 blur-3xl dark:bg-primary-900/30"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-indigo-200 blur-3xl dark:bg-indigo-900/30"></div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="w-1.5 h-8 bg-primary-500 rounded-full mr-3"></span>
              Öne Çıkanlar
            </h2>
          </div>
          <div className="grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/post/${post.slug}`}
                className="group flex flex-col h-full bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <div className="h-56 w-full overflow-hidden relative">
                   <img 
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    src={post.image} 
                    alt={post.title}
                    loading="lazy"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                   <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide text-primary-600 dark:text-primary-400">
                     {post.category}
                   </div>
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {post.summary}
                  </p>
                  <div className="flex items-center text-xs font-medium text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                    <Calendar size={14} className="mr-1.5" />
                    <span className="mr-4">{formatDate(post.date)}</span>
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
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Son Yazılar</h2>
          <Link to="/blog" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center transition-colors">
            Tümünü Gör <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="space-y-8">
          {recentPosts.map((post) => (
            <article key={post.id} className="relative group bg-white dark:bg-dark-card p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
              <div className="flex flex-col sm:flex-row gap-6">
                 {/* Thumbnail for recent posts on desktop */}
                 <div className="hidden sm:block w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <span className="text-primary-600 dark:text-primary-400">{post.category}</span>
                    <span>•</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors mb-2">
                    <Link to={`/post/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base line-clamp-2 mb-4">
                    {post.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 relative z-10">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
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

      {/* Newsletter Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-primary-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left shadow-2xl">
            {/* Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary-700 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-800 opacity-50 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
               <div className="max-w-xl">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Bültene Abone Ol</h2>
                  <p className="text-primary-100 text-lg">
                    Yeni yazılardan, projelerden ve teknoloji dünyasındaki gelişmelerden ilk senin haberin olsun. Spam yok, sadece bilgi.
                  </p>
               </div>
               
               <div className="w-full md:w-auto flex-shrink-0">
                  {subStatus === 'success' ? (
                      <div className="bg-white/10 backdrop-blur-md border border-green-400/50 rounded-xl p-6 text-center animate-fadeIn w-full md:w-80">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white mb-3 shadow-lg">
                              <CheckCircle size={24} />
                          </div>
                          <h3 className="text-white font-bold text-lg mb-1">Abonelik Başarılı!</h3>
                          <p className="text-primary-100 text-sm">Aramıza hoş geldin. E-posta adresin güvenle kaydedildi.</p>
                          <button onClick={() => setSubStatus('idle')} className="mt-4 text-xs text-white underline hover:text-green-200">Tekrar abone ol</button>
                      </div>
                  ) : (
                    <form className="flex flex-col gap-3 w-full md:w-80" onSubmit={handleSubscribe}>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                            type="email" 
                            placeholder="E-posta adresin" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 pr-4 py-3.5 rounded-xl w-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all shadow-lg"
                            required
                            disabled={subStatus === 'loading'}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={subStatus === 'loading'}
                            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center"
                        >
                            {subStatus === 'loading' ? <Loader2 size={20} className="animate-spin" /> : 'Abone Ol'}
                        </button>
                        {subStatus === 'error' && (
                            <div className="flex items-center text-red-200 text-sm mt-1 bg-red-900/30 p-2 rounded">
                                <AlertCircle size={14} className="mr-1.5 flex-shrink-0" />
                                <span>{subMessage}</span>
                            </div>
                        )}
                    </form>
                  )}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
