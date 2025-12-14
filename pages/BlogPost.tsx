
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BlogPost as BlogPostType } from '../types';
import { StorageService } from '../services/storageService';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Twitter, Linkedin, Copy, Check, List, ChevronRight, BookOpen } from 'lucide-react';
import { Seo } from '../components/Seo';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        setIsLoading(true);
        try {
          const allPosts = await StorageService.getPosts();
          const found = allPosts.find(p => p.slug === slug);
          
          setPost(found || null);
          
          if (found) {
            generateToC(found.content);
            const related = allPosts
                .filter(p => p.category === found.category && p.id !== found.id)
                .slice(0, 3);
            setRelatedPosts(related);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          setPost(null);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [slug]);

  // Reading Progress Handler
  useEffect(() => {
    const updateReadingProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const generateToC = (content: string) => {
    const regex = /^(#{1,3})\s+(.*)$/gm;
    const headings = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level });
    }
    setToc(headings);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-500 animate-pulse">İçerik Yükleniyor...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Seo title="Yazı Bulunamadı" description="İstenen blog yazısı bulunamadı." />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Yazı Bulunamadı</h2>
        <Link to="/blog" className="text-primary-600 hover:underline">Bloğa Dön</Link>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = post.title;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="relative">
      <Seo 
        title={post.title} 
        description={post.summary} 
        type="article"
      />
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary-600 z-[60] transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link to="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <Link to="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <span className="text-primary-600 dark:text-primary-400 font-medium">{post.category}</span>
            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <span className="truncate max-w-[200px] text-gray-800 dark:text-gray-200">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-primary-100 dark:border-primary-800">
                  {post.category}
                </span>
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1.5" />
                  {new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center">
                  <Clock size={14} className="mr-1.5" />
                  {post.readingTimeMinutes} dk okuma
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8">
                {post.title}
              </h1>

              {post.image && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-xl border border-gray-100 dark:border-gray-800">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                    loading="eager"
                  />
                </div>
              )}
            </div>

            {/* Markdown Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-a:text-primary-600 hover:prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
              prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-xl
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg
              ">
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const [copied, setCopied] = useState(false);
                    const codeString = String(children).replace(/\n$/, '');

                    const handleCopy = () => {
                      navigator.clipboard.writeText(codeString);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    };

                    return !inline && match ? (
                      <div className="relative group my-8">
                        <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={handleCopy}
                              className="p-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors border border-gray-600"
                              title="Kodu Kopyala"
                           >
                              {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
                           </button>
                        </div>
                        <div className="absolute left-4 top-0 -translate-y-1/2 px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-gray-400 border border-gray-700 uppercase">
                          {match[1]}
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, borderRadius: '0.75rem', fontSize: '0.9rem', lineHeight: '1.5' }}
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={`${className} px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-primary-700 dark:text-primary-400 font-mono text-sm border border-gray-200 dark:border-gray-700`} {...props}>
                        {children}
                      </code>
                    )
                  },
                  h1: ({children}) => <h1 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}>{children}</h1>,
                  h2: ({children}) => <h2 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}>{children}</h2>,
                  h3: ({children}) => <h3 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}>{children}</h3>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Footer / Tags & Share */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-default">
                      <Tag size={12} className="mr-1.5 text-primary-500" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                   <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                     <Share2 size={16} className="mr-2" /> Paylaş
                   </span>
                   <div className="flex space-x-2">
                    <a 
                      href={twitterShareUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all transform hover:scale-110"
                    >
                      <Twitter size={18} />
                    </a>
                    <a 
                      href={linkedinShareUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all transform hover:scale-110"
                    >
                      <Linkedin size={18} />
                    </a>
                   </div>
                </div>
              </div>
            </div>

            {/* RELATED POSTS SECTION */}
            {relatedPosts.length > 0 && (
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="w-1 h-6 bg-primary-600 rounded mr-3"></span>
                        Bunları da Beğenebilirsiniz
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                        {relatedPosts.map(rp => (
                            <Link key={rp.id} to={`/post/${rp.slug}`} className="group block bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
                                <div className="h-32 overflow-hidden">
                                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 text-sm mb-2">{rp.title}</h4>
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                        <Clock size={12} className="mr-1" /> {rp.readingTimeMinutes} dk
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

          </div>

          {/* Sidebar / Table of Contents */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* ToC Widget */}
              {toc.length > 0 && (
                <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center">
                    <List size={16} className="mr-2" /> İçindekiler
                  </h4>
                  <nav className="space-y-1">
                    {toc.map((item) => (
                      <a 
                        key={item.id} 
                        href={`#${item.id}`} 
                        className={`block text-sm py-1.5 border-l-2 pl-4 transition-colors ${
                          item.level === 1 ? 'font-semibold text-gray-900 dark:text-white border-transparent hover:border-primary-500' :
                          'text-gray-500 dark:text-gray-400 border-transparent hover:text-primary-600 hover:border-primary-300'
                        }`}
                        style={{ marginLeft: `${(item.level - 1) * 0.5}rem` }}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Author Widget */}
              <div className="bg-gradient-to-br from-primary-50 to-white dark:from-dark-card dark:to-gray-900 rounded-xl p-6 border border-primary-100 dark:border-gray-700 text-center">
                <img 
                  src="https://www.bilginomist.com/wp-content/uploads/2024/05/AI-5_Calsma_Yuzeyi_1.webp" 
                  alt="Zeynep Arslan" 
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-md"
                />
                <h3 className="font-bold text-gray-900 dark:text-white">Zeynep Arslan</h3>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-3">Full Stack Developer</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                  Kod, veri ve yapay zeka üzerine notlarımı paylaşıyorum.
                </p>
                <Link to="/about" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:hover:text-primary-400">
                   Daha fazla bilgi &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
