import React from 'react';
import { Github, Twitter, Linkedin, Mail, Download, Brain, Database, Code } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="md:flex">
          {/* Sidebar / Image */}
          <div className="md:w-1/3 bg-gray-50 dark:bg-gray-800/50 p-8 flex flex-col items-center text-center border-r border-gray-100 dark:border-gray-800">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 ring-4 ring-white dark:ring-gray-700 shadow-lg">
              <img 
                src="https://www.bilginomist.com/wp-content/uploads/2024/05/AI-5_Calsma_Yuzeyi_1.webp"
                 
                alt="Zeynep Arslan" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Zeynep Arslan</h2>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-4">Full Stack | Veri Analiz & Yapay Zeka</p>
            
          <div className="flex space-x-4 mb-8">
  <a 
    href="https://github.com/zeyneparslanj" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
  >
    <Github size={20} />
  </a>
  <a 
    href="https://x.com/zeynep_arslanj" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-400 hover:text-blue-400 transition-colors"
  >
    <Twitter size={20} />
  </a>
  <a 
    href="https://www.linkedin.com/in/zeynep-arslanj/" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-400 hover:text-blue-700 transition-colors"
  >
    <Linkedin size={20} />
  </a>
</div>

            {/* <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Download size={16} className="mr-2" /> Özgeçmiş (PDF)
            </button> */}
          </div>

          {/* Content */}
          <div className="md:w-2/3 p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Merhaba! 👋</h1>
            
            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
              <p>
                Ben <strong>Zeynep</strong>. Teknoloji yolculuğuma  yerel işletmelere dijital çözümler üreterek başladım. Şimdi ise kodların ve verilerin derinliklerine iniyorum.
              </p>
              <p className="mt-4">
                <strong>Full Stack, Veri Analizi ve Yapay Zeka</strong> alanlarında kendimi geliştirmeye devam ederken; edindiğim bu teknik becerileri, ilgi duymaya başladığım <strong>Hesaplamalı Sosyal Bilimler</strong> disipliniyle birleştirmeye odaklanıyorum. Amacım, öğrendiğim her yeni araçla veriyi daha anlamlı çözümlere dönüştürmek. 
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Teknik Yetkinlikler ve Teknoloji Yığını</h3>
<ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
  {/* Programlama Dilleri */}
  <li className="flex items-center truncate">
    <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
    Python / R / JavaScript / SQL
  </li>

  {/* Web Geliştirme */}
  <li className="flex items-center truncate">
    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
    React / Django / REST API / HTML5
  </li>

  {/* Veri Analizi & Bilimsel Hesaplama */}
  <li className="flex items-center truncate">
    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mr-2"></span>
    Pandas / SPSS / R Studio / NumPy
  </li>

  {/* Hesaplamalı Sosyal Bilimler */}
  <li className="flex items-center truncate">
    <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
    Gephi / Ağ Analizi / ArcGIS / QGIS
  </li>

  {/* Yapay Zeka & NLP */}
  <li className="flex items-center truncate">
    <span className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
    NLP / LLM / İstatistiksel Modelleme
  </li>

  {/* Araçlar & Metodolojiler */}
  <li className="flex items-center truncate">
    <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
    Git / Linux / Jira / SDLC / OOP
  </li>
</ul>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Zey'Us Blog Hakkında</h3>
              <p>
                Bu blogda sadece kod satırlarını değil; <strong>icatların tarihini, mekanizmalarını</strong> ve verinin bize anlattığı hikayeleri bulacaksınız. Öğrendiğim her yeni bilgiyi, aldığım ders notlarını ve projelerimi burada şeffaf bir şekilde paylaşıyorum.
              </p>
              
              <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800 flex items-start">
                 <Mail className="text-primary-600 dark:text-primary-400 mt-1 mr-3 flex-shrink-0" size={20} />
                 <div>
                   <h4 className="font-semibold text-gray-900 dark:text-white">İletişime Geçin</h4>
                   <h4 className="font-semibold text-gray-900 dark:text-white">Mail: zynp.arsln274@gmail.com</h4>
<p className="text-sm mt-1">
  Projeler, fikir alışverişi veya sadece merhaba demek için <a href="mailto:zynp.arsln274@gmail.com" className="text-primary-600 hover:underline">bana yazabilirsiniz</a>.
</p>

<footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 pb-8">
        <p>© {new Date().getFullYear()} Zeynep Arslan. Tüm hakları saklıdır.</p>
        <p className="mt-2">
          Kod ve Veri  <span className="text-red-500">✨</span> ile tasarlandı.
        </p>
      </footer>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};