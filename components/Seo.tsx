
import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  type?: string;
  name?: string;
}

export const Seo: React.FC<SeoProps> = ({ 
  title, 
  description, 
  type = 'article',
  name = "Zey'US Blog" 
}) => {
  useEffect(() => {
    // Update Title
    document.title = `${title} | ${name}`;

    // Helper to update or create meta tags
    const updateMeta = (keyAttr: 'name' | 'property', keyValue: string, content: string) => {
      let element = document.querySelector(`meta[${keyAttr}="${keyValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(keyAttr, keyValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    updateMeta('name', 'description', description);

    // Open Graph
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);

    // Twitter
    updateMeta('name', 'twitter:creator', name);
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);

  }, [title, description, type, name]);

  return null;
};
