// app/layout.tsx
import './globals.css';
import AppLayout from './dashboard/components/AppLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your App',
  description: 'App description here',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
