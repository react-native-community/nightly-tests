import type { Metadata } from "next";
import { PropsWithChildren } from "react";

import "~/styles/globals.css";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "React Native Nightly Tests",
  description: "Nightly integration tests results for React Native",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-dvh antialiased font-sans text-primary bg-background">
        <ThemeProvider attribute="data-theme">
          <Header />
          <div className="min-h-[calc(100dvh-58px)] grid grid-rows-[1fr_min-content]">
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
