import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren, Suspense } from 'react';

import Footer from '~/components/Footer';
import Header from '~/components/Header';
import { SearchProvider } from '~/context/SearchContext';
import getAssetPath from '~/utils/getAssetPath';

import '~/styles/globals.css';

const optimisticDisplay = localFont({
  src: [
    {
      path: '../public/fonts/Optimistic-Display-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Optimistic-Display-Regular.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Optimistic-Display-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-optimistic-display',
});

const metadataBase = process.env.REPOSITORY_NAME
  ? new URL('https://react-native-community.github.io/')
  : new URL('http://localhost:3000');

export const metadata: Metadata = {
  title: 'React Native Nightly Tests',
  description: 'Nightly integration tests results for React Native',
  metadataBase,
  icons: {
    icon: [
      {
        url: getAssetPath('favicon-32x32.png'),
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: getAssetPath('favicon-16x16.png'),
        type: 'image/png',
        sizes: '16x16',
      },
    ],
    shortcut: getAssetPath('favicon-32x32.png'),
  },
  openGraph: {
    images: getAssetPath('opengraph-image.png'),
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={optimisticDisplay.className}>
      <body className="relative min-h-dvh antialiased font-sans text-primary bg-background">
        <ThemeProvider attribute="data-theme">
          <Suspense>
            <SearchProvider>
              <Header />
              <div className="min-h-[calc(100dvh-58px)] grid grid-rows-[1fr_min-content]">
                {children}
                <Footer />
              </div>
            </SearchProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
