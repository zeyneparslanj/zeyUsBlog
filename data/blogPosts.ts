
import { BlogPost, PostCategory } from '../types';

export const posts: BlogPost[] = [
  {
    id: '1',
    title: 'React 19: Compiler Devrimi ve Hook Karmaşasının Sonu',
    slug: 'react-19-compiler-ve-yeni-ozellikler',
    summary: 'React 19 Beta ile gelen React Compiler, useMemo ve useCallback ihtiyacını ortadan kaldırıyor. Frontend dünyasındaki bu büyük değişimi inceliyoruz.',
    content: `
# React 19 ve Derleyici (Compiler) Çağı

React ekibi uzun süredir beklenen React 19 sürümünü duyurdu. Bu sürüm, sadece yeni özellikler getirmekle kalmıyor, aynı zamanda React'in çalışma mantığında temel bir değişikliğe gidiyor: **React Compiler**.

## Manuel Optimizasyonlara Elveda

Yıllardır performans için kullandığımız \`useMemo\`, \`useCallback\` ve \`memo\` gibi hook'lar, React Compiler sayesinde tarih oluyor. Derleyici, kodunuzu analiz ediyor ve nelerin yeniden hesaplanması gerektiğini (memoization) otomatik olarak belirliyor.

### Actions API

Form yönetimi de kökten değişiyor. \`useTransition\` ve yeni \`action\` prop'u sayesinde, asenkron işlemleri yönetmek (loading state, error handling) çok daha kolaylaşıyor.

\`\`\`jsx
// React 19 Öncesi
const [isPending, setIsPending] = useState(false);
const handleSubmit = async () => {
  setIsPending(true);
  await updateDb();
  setIsPending(false);
}

// React 19 Sonrası
const [isPending, startTransition] = useTransition();
const handleSubmit = () => {
  startTransition(async () => {
    await updateDb();
  });
}
\`\`\`

React 19, geliştirici deneyimini (DX) iyileştirmek için atılmış devasa bir adım.
    `,
    image: 'https://picsum.photos/800/400?random=101',
    category: PostCategory.ARTICLE,
    tags: ['React', 'Frontend', 'Web Development'],
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: true,
    readingTimeMinutes: 6
  },
  {
    id: '2',
    title: 'Yapay Zeka Ajanları (AI Agents): LLM\'lerin Bir Sonraki Evrimi',
    slug: 'ai-ajanlari-otonom-sistemler',
    summary: 'Sadece sohbet eden botlardan, aksiyon alan otonom ajanlara geçiş. AutoGPT, BabyAGI ve Devin AI neden bu kadar önemli?',
    content: `
# Chatbotlardan Otonom Ajanlara

ChatGPT ile başlayan LLM (Büyük Dil Modeli) furyası, şimdi yerini **AI Ajanlarına** bırakıyor. Bir LLM sadece metin üretirken, bir Ajan (Agent) çevresiyle etkileşime geçebilir, plan yapabilir ve araç kullanabilir.

## Ajan Nedir?

Bir AI Ajanı şu döngüyü takip eder:
1.  **Algıla:** Hedefi anla ("Bana ucuz bir uçak bileti bul").
2.  **Planla:** Adımları belirle (Skyscanner API'sine bağlan, tarihleri tara, fiyatları karşılaştır).
3.  **Eylem:** Kodu çalıştır veya API isteği at.
4.  **Öğren:** Sonuç başarısızsa stratejiyi değiştir.

### Devin AI Örneği

Dünyanın ilk "Yazılım Mühendisi Ajanı" olarak tanıtılan Devin, sadece kod yazmakla kalmıyor; GitHub reposunu klonluyor, bug'ı tespit ediyor, fix'i uyguluyor ve testleri çalıştırıyor.

Bu teknoloji, yazılımcıların yerini almaktan ziyade, onlara "dijital stajyerler" ordusu sunmayı vaat ediyor.
    `,
    image: 'https://picsum.photos/800/400?random=102',
    category: PostCategory.ARTICLE,
    tags: ['AI', 'Agents', 'Future Tech', 'LLM'],
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: true,
    readingTimeMinutes: 8
  },
  {
    id: '3',
    title: 'DevLog: Node.js\'ten Bun\'a Geçiş Deneyimim',
    slug: 'devlog-nodejs-bun-migration',
    summary: 'Projelerimden birini Node.js\'ten Bun runtime\'ına taşıdım. Paket yükleme hızı %90 arttı, peki ya production stabilitesi?',
    content: `
# Neden Bun?

JavaScript ekosistemi uzun süredir Node.js hakimiyetindeydi. Sonra Deno geldi, şimdi ise **Bun**. Bun, hız odaklı, hepsi-bir-arada (runtime, bundler, test runner, package manager) bir araç seti.

## İlk İzlenimler

1.  **npm install**: Şaka gibi hızlı. Dakikalar süren CI/CD pipeline'ım saniyelere düştü.
2.  **TypeScript**: Doğrudan destekliyor. \`ts-node\` veya derleme adımlarıyla uğraşmak yok.
3.  **API Uyumluluğu**: Express.js uygulamam neredeyse hiç değişiklik yapmadan çalıştı.

### Karşılaştığım Sorunlar

Her şey güllük gülistanlık değil. Bazı edge-case kütüphaneler (özellikle native C++ binding kullananlar) henüz tam uyumlu değil. Ancak kişisel projeler ve mikro-servisler için Bun, Node.js'e çok ciddi bir rakip.

\`\`\`bash
# Node.js
npm install (45s)

# Bun
bun install (2s) 🚀
\`\`\`
    `,
    image: 'https://picsum.photos/800/400?random=103',
    category: PostCategory.DEVLOG,
    tags: ['JavaScript', 'Bun', 'Performance', 'Backend'],
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: false,
    readingTimeMinutes: 4
  },
  {
    id: '4',
    title: 'Proje: Gemini API ile RAG Tabanlı Doküman Asistanı',
    slug: 'proje-rag-gemini-api',
    summary: 'Kendi PDF dokümanlarınızla konuşabileceğiniz, Retrieval-Augmented Generation (RAG) mimarisine sahip bir uygulama geliştirdim.',
    content: `
# Kendi Verinle Konuş

LLM'lerin en büyük sorunu halüsinasyon ve güncel bilgi eksikliğidir. RAG (Retrieval-Augmented Generation) mimarisi, modele bağlam (context) sağlayerek bu sorunu çözer.

## Mimari

1.  **Ingestion:** PDF dosyasını yükle ve metne çevir.
2.  **Embedding:** Metni vektörlere dönüştür (Gemini Embedding Model).
3.  **Vector DB:** Vektörleri Supabase pgvector içinde sakla.
4.  **Retrieval:** Kullanıcı sorusuna en benzer metin parçalarını bul.
5.  **Generation:** Bulunan parçaları ve soruyu Gemini 1.5 Pro'ya gönder.

Bu projede **LangChain** yerine daha hafif bir yapı kurarak maliyetleri minimize ettim. Gemini 1.5'in devasa context penceresi (1M token), RAG uygulamaları için oyun değiştirici bir özellik.
    `,
    image: 'https://picsum.photos/800/400?random=104',
    category: PostCategory.PROJECT,
    tags: ['AI', 'RAG', 'Gemini', 'Supabase'],
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: true,
    readingTimeMinutes: 10
  },
  {
    id: '5',
    title: 'WebAssembly ve Tarayıcıların Geleceği',
    slug: 'webassembly-ve-tarayicilarin-gelecegi',
    summary: 'Wasm sayesinde artık C++, Rust ve Go gibi dilleri tarayıcıda native performansa yakın hızlarda çalıştırabiliyoruz.',
    content: `
# WebAssembly: Tarayıcıda Sınırları Zorlamak

WebAssembly (Wasm), modern web tarayıcılarında çalışabilen yeni bir kod türüdür. JavaScript'in yanında çalışarak, C++, Rust gibi dillerin web'de neredeyse native performansla çalışmasını sağlar.

## Neden Önemli?

1. **Performans**: Ağır hesaplama gerektiren işlemler (video işleme, oyunlar, CAD uygulamaları) artık tarayıcıda mümkün.
2. **Dil Çeşitliliği**: Sadece JS'ye bağlı kalmadan, favori backend dilinizi frontend'de kullanabilirsiniz.
3. **Güvenlik**: Sandbox ortamında güvenli bir şekilde çalışır.

Figma, Adobe Photoshop Web ve Google Earth gibi devasa uygulamalar, bu teknolojiyi kullanarak tarayıcı tabanlı araçlarını masaüstü uygulama performansına ulaştırdı.
    `,
    image: 'https://picsum.photos/800/400?random=105',
    category: PostCategory.ARTICLE,
    tags: ['WebAssembly', 'Performance', 'Rust', 'Future'],
    date: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: false,
    readingTimeMinutes: 6
  },
  {
    id: '6',
    title: 'CSS View Transitions API: Native Hissettiren Web Sayfaları',
    slug: 'css-view-transitions',
    summary: 'Sayfa geçişlerinde karmaşık JavaScript animasyonlarına son. Tarayıcı seviyesinde akıcı geçişler artık mümkün.',
    content: `
# Web Artık Daha Akıcı

Eskiden SPA (Single Page Application) yaparken sayfa geçişlerinin "native mobil uygulama" gibi hissettirmesi için \`framer-motion\` gibi kütüphanelerle karmaşık durum yönetimleri yapardık.

**View Transitions API** bunu tarayıcıya yerleşik hale getiriyor.

## Nasıl Çalışır?

Basitçe DOM'un "önceki" ve "sonraki" halinin ekran görüntüsünü alır ve bunlar arasında CSS ile animasyon (cross-fade, slide, vb.) uygular.

\`\`\`css
/* Tek satırla tüm sayfada animasyon */
@view-transition {
  navigation: auto;
}
\`\`\`

Bu özellik, web sitelerinin kullanıcı deneyimini (UX) dramatik şekilde iyileştiriyor ve "App-like" (Uygulama benzeri) hissi veriyor.
    `,
    image: 'https://picsum.photos/800/400?random=106',
    category: PostCategory.ARTICLE,
    tags: ['CSS', 'UX', 'Design', 'Web'],
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: false,
    readingTimeMinutes: 4
  },
  {
    id: '7',
    title: 'Bulut Maliyetleri ve "Cloud Exit" Akımı',
    slug: 'cloud-exit-on-premise-donus',
    summary: '37signals (Basecamp) ve X (Twitter) gibi şirketlerin buluttan çıkarak kendi sunucularına dönmesi ne anlama geliyor?',
    content: `
# Bulut Her Zaman Doğru Çözüm mü?

Son 10 yıldır "Cloud First" mantığıyla her şeyi AWS, Azure veya Google Cloud'a taşıdık. Ancak faturalar kabarmaya başladığında rüzgar tersine döndü.

## 37signals Örneği

Basecamp'in kurucusu DHH, bulut faturalarının yılda milyonlarca doları bulması üzerine "Cloud Exit" kararını açıkladı. Kendi donanımlarını satın alarak (Colocation), 5 yıllık maliyet projeksiyonunda 7 milyon dolar tasarruf etmeyi planlıyorlar.

Bu, bulutun bittiği anlamına gelmiyor. Ancak startup aşamasını geçmiş, trafiği öngörülebilir olan orta ve büyük ölçekli şirketler için "Hybrid" veya "On-Premise" çözümler tekrar masada.
    `,
    image: 'https://picsum.photos/800/400?random=107',
    category: PostCategory.ARTICLE,
    tags: ['DevOps', 'Cloud', 'Architecture', 'Business'],
    date: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: false,
    readingTimeMinutes: 7
  }
];
