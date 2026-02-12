import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';
import { LocaleProvider } from '@/components/providers/locale-provider';
import { LanguageToggle } from '@/components/language-toggle';

export const metadata: Metadata = {
  title: "Logan Williams",
  description: "Personal site of Logan Williams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LocaleProvider>
          <header className="flex h-16 flex-wrap items-center justify-between gap-4 p-4 border-b border-border">
            <Link
              href="/"
              className="text-base font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/90"
              aria-label="Logan Williams home"
            >
              Logan Williams
            </Link>
            <div className="flex items-center gap-4">
              <LanguageToggle />
            </div>
          </header>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
