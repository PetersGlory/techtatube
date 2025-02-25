import './globals.css';
import { Inter } from 'next/font/google';
import { RootLayoutClient } from './layout-client';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'AI Content Generator',
//   description: 'Generate high-quality content with AI',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}