import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { DbProvider } from '@/lib/db';
import Pwa from '@/components/Pwa';

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AutoDziennik — kompletna historia samochodu',
  description:
    'Prywatny, inteligentny organizer samochodu: naprawy, terminy, koszty, tankowania, dokumenty i harmonogram wymian — wszystko w jednym miejscu.',
  applicationName: 'AutoDziennik',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'AutoDziennik',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#121417',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={`${archivo.variable} ${plexMono.variable}`}>
        <DbProvider>{children}</DbProvider>
        <Pwa />
      </body>
    </html>
  );
}
