// app/layout.tsx
import './globals.css';
import Footer from '@/app/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body className="bg-gray-100">
        {children}
        <Footer />
      </body>
    </html>
  );
}
