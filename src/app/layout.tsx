import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AOX SecureVault | SayanOX Private Limited',
  description: 'Client-side encrypted vault with 3D UI. Zero-knowledge security.',
  other: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-aox-accent/30">{children}</body>
    </html>
  );
}
