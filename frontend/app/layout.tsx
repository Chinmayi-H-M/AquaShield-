import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'AquaShield',
  description: 'Water Quality Prediction System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {/* 🔥 THIS IS THE FIX */}
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  );
}