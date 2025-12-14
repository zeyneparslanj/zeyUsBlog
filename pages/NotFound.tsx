
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Seo } from '../components/Seo';

export const NotFound: React.FC = () => {
  return (
    <>
      <Seo title="Sayfa Bulunamadı" description="Aradığınız sayfa mevcut değil veya taşınmış olabilir." />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-8 animate-bounce">
            <Search size={64} className="text-gray-400 dark:text-gray-500" />
        </div>
        
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Aradığınız sayfayı bulamadık.
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Görünüşe göre kaybolmuşsunuz. Aradığınız içerik silinmiş, taşınmış veya bağlantı hatalı olabilir.
        </p>

        <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md"
        >
            <Home size={20} className="mr-2" />
            Ana Sayfaya Dön
        </Link>
      </div>
    </>
  );
};
