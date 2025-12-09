import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BlogPost as BlogPostType } from '../types';
import { StorageService } from '../services/storageService';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);

  useEffect(() => {
    if (slug) {
      const found = StorageService.getPostBySlug(slug);
      setPost(found || null);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Yazı Bulunamadı</h2>
        <Link to="/blog" className="text-primary-600 hover:underline">Bloğa Dön</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <Link to="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Tüm Yazılar
        </Link>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full font-medium">
            {post.category}
          </span>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1.5" />
            {new Date(post.publishedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1.5" />
            {post.readingTimeMinutes} dk okuma
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8">
          {post.title}
        </h1>

        {post.coverImage && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-lg">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none prose-pre:bg-[#1e1e1e] prose-headings:font-bold prose-a:text-primary-600">
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer / Tags */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <Tag size={12} className="mr-1.5" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};