import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BMP SHOP Dashboard',
    short_name: 'BMP SHOP',
    description: 'An AI-powered E-Commerce management platform built for the "The Living App" Hackathon',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F0FA',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
