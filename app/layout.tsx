import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image"; // 👈 Import Image for the logo
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amana Transportation",
  description: "Proudly Servicing Malaysian Bus Riders Since 2019!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}
      >
        {/* ✅ Navigation Bar */}
        <header className="bg-green-600 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center p-4">
            {/* Left side: Logo */}
            <a href="#home" className="flex items-center gap-2">
              <Image
                src="/amana_bootcamp_logo.jpeg" // 👈 Place logo in /public/amana-logo.png
                alt="Amana Transportation Logo"
                width={40}
                height={40}
              />
              <span className="font-bold text-lg">Amana Transportation</span>
            </a>

            {/* Right side: Menu */}
            <nav>
              <ul className="flex gap-6">
                <li>
                  <a href="#home" className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#map" className="hover:underline">
                    Active Bus Map
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="hover:underline">
                    Bus Schedule
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* ✅ Main Page Content */}
        <main className="container mx-auto p-6">{children}</main>

        {/* ✅ Footer */}
        <footer className="bg-gray-800 text-white text-center p-4 mt-10">
          © {new Date().getFullYear()} Amana Transportation
        </footer>
      </body>
    </html>
  );
}
