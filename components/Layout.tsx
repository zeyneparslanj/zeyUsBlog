
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Terminal, Lock, Github, Twitter, Linkedin, Heart, ArrowUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Scroll Listener
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Hakkımda', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-dark-bg/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-primary-600 to-indigo-600 text-white p-1.5 rounded-lg group-hover:shadow-lg transition-all duration-300">
                <Terminal size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Zey<span className="text-primary-500">'US</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive(link.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-fadeIn" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all transform hover:rotate-12"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg animate-fadeIn">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
               <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-3 mt-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
              >
                {isDark ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                {isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow relative">
        {children}
      </main>

      <footer className="bg-gray-50 dark:bg-[#0B1120] border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
            
            {/* Column 1: Brand & Bio */}
            <div className="space-y-4">
               <div className="flex items-center space-x-2">
                  <div className="bg-primary-600 text-white p-1 rounded-md">
                    <Terminal size={16} />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    Zey<span className="text-primary-500">'US</span>
                  </span>
               </div>
               <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                 Kodlayan zihinler için dijital bahçe. Web teknolojileri, yapay zeka ve veri bilimi üzerine notlar, projeler ve deneyimler.
               </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Menü
              </h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Social & Contact */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Bağlantıda Kal
              </h3>
              <div className="flex space-x-4 mb-6">
                <a href="https://github.com/zeyneparslanj" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:-translate-y-1 transform duration-200">
                  <Github size={20} />
                </a>
                <a href="https://x.com/zeynep_arslanj" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors hover:-translate-y-1 transform duration-200">
                  <Twitter size={20} />
                </a>
                <a href="https://www.linkedin.com/in/zeynep-arslanj/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors hover:-translate-y-1 transform duration-200">
                  <Linkedin size={20} />
                </a>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                E-posta: <a href="mailto:zynp.arsln274@gmail.com" className="hover:text-primary-500 transition-colors">zynp.arsln274@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} Zeynep Arslan. Tüm hakları saklıdır.
            </p>
            
            <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-600">
               <span>React & Tailwind ile</span>
               <Heart size={10} className="text-red-500 fill-red-500 mx-1" />
               <span>tasarlandı.</span>
               <Link 
                 to="/admin" 
                 className="ml-3 text-gray-300 dark:text-gray-700 hover:text-gray-500 dark:hover:text-gray-500 transition-colors"
                 title="Yönetici Girişi"
               >
                 <Lock size={12} />
               </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/30 transition-all duration-300 z-50 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Yukarı Çık"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};
