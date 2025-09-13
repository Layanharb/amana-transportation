import './globals.css';
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" >
      <body>
        <div className="min-h-screen bg-gray-100 ">
          <Header />
          <main className="container mx-auto mt-6 p-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
