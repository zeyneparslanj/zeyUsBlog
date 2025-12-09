import { BlogPost, PostCategory } from '../types';

const STORAGE_KEY = 'zeyus_posts';
const PROFILE_KEY = 'zeyus_profile';

// Initial Seed Data
const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Modern Frontend Mimarisi: Komponent Tabanlı Düşünmek',
    slug: 'modern-frontend-mimarisi',
    excerpt: 'React ve modern frameworkler ile ölçeklenebilir uygulamalar geliştirirken dikkat edilmesi gereken tasarım desenleri.',
    content: `
# Modern Frontend Mimarisi

Frontend dünyası son yıllarda büyük bir değişim geçirdi. JQuery günlerinden bugünün SPA (Single Page Application) dünyasına geçiş, sadece araçlarımızı değil, düşünce yapımızı da değiştirdi.

## Atomik Tasarım Nedir?

Atomik tasarım, Brad Frost tarafından ortaya atılan, kullanıcı arayüzlerini en küçük yapı taşlarından (atomlar) başlayarak karmaşık yapılara (sayfalar) doğru inşa etmeyi öneren bir metodolojidir.

\`\`\`typescript
// Örnek bir Atomik Bileşen (Button)
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, children }) => {
  const baseClass = "px-4 py-2 rounded font-medium transition";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };
  
  return <button className={\`\${baseClass} \${variants[variant]}\`}>{children}</button>;
}
\`\`\`

## Neden TypeScript?

Büyük ekiplerde çalışırken tip güvenliği bir lüks değil, bir ihtiyaçtır.
    `,
    coverImage: 'https://picsum.photos/800/400?random=1',
    category: PostCategory.ARTICLE,
    tags: ['React', 'Architecture', 'TypeScript'],
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString(),
    isFeatured: true,
    readingTimeMinutes: 5
  },
  {
    id: '2',
    title: 'DevLog #1: Blog Sistemini Yeniden Yazıyorum',
    slug: 'devlog-1-blog-sistemini-yeniden-yaziyorum',
    excerpt: 'Bu hafta sonu kişisel blog sitemi Next.js ve Tailwind CSS kullanarak sıfırdan inşa etmeye başladım.',
    content: `
# Yeni Başlangıçlar

Uzun zamandır aklımda olan projeyi nihayet hayata geçiriyorum. Eski WordPress sitem hantal ve yönetimi zordu.

## Teknoloji Yığını

- **React 18**: En güncel özellikler için.
- **Tailwind CSS**: Hızlı stil geliştirme.
- **Gemini API**: İçerik üretimine yardımcı olması için.

Beni takipte kalın!
    `,
    coverImage: 'https://picsum.photos/800/400?random=2',
    category: PostCategory.DEVLOG,
    tags: ['Personal', 'DevLog', 'Refactor'],
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: false,
    readingTimeMinutes: 2
  },
  {
    id: '3',
    title: 'Proje: AI Tabanlı Kod Asistanı',
    slug: 'proje-ai-kod-asistani',
    excerpt: 'Gemini API kullanarak geliştirdiğim VS Code eklentisi hakkında teknik detaylar.',
    content: `
# AI Kod Asistanı

Yapay zeka araçlarının gelişimi ile birlikte, geliştirici deneyimini (DX) iyileştirmek için yeni fırsatlar doğdu.

## Nasıl Çalışır?

Eklenti, seçili kodu alıp Gemini API'ye gönderiyor ve optimizasyon önerileri istiyor.

> "Gelecek, kod yazmayı bıraktığımız değil, daha akıllı kod yazdığımız bir yer olacak."

### Zorluklar

1. **Latency**: API yanıt süreleri.
2. **Context**: Kodun bağlamını modele doğru aktarmak.

Projeye GitHub üzerinden erişebilirsiniz.
    `,
    coverImage: 'https://picsum.photos/800/400?random=3',
    category: PostCategory.PROJECT,
    tags: ['AI', 'Gemini', 'VS Code'],
    publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: true,
    readingTimeMinutes: 8
  }
];

export const StorageService = {
  getPosts: (): BlogPost[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(data);
  },

  getPostBySlug: (slug: string): BlogPost | undefined => {
    const posts = StorageService.getPosts();
    return posts.find(p => p.slug === slug);
  },

  savePost: (post: BlogPost): void => {
    const posts = StorageService.getPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.unshift(post);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  },

  deletePost: (id: string): void => {
    const posts = StorageService.getPosts();
    const newPosts = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
  },

  calculateReadingTime: (text: string): number => {
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  }
};