import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { Home, ClipboardList, Dumbbell } from 'lucide-react';
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "AnaySwap - Find Healthier Indian Food Swaps",
  description: "Identify healthier, lower-calorie, high-protein, and fiber-rich alternatives to junk foods, snacks, and sweet cravings instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-app text-text-app" suppressHydrationWarning>
        <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden relative">
          <Header />
          <main className="flex-grow flex flex-col pb-16 sm:pb-0 w-full">
            {children}
          </main>
          
          {/* Mobile Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-app bg-card-app/90 backdrop-blur-md py-2.5 px-6 sm:hidden flex justify-around items-center shadow-lg">
            <Link href="/" className="flex flex-col items-center gap-0.5 text-text-app hover:text-brand-primary">
              <Home className="h-5.5 w-5.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Cravings</span>
            </Link>
            <Link href="/diet-chart" className="flex flex-col items-center gap-0.5 text-text-app hover:text-brand-primary">
              <ClipboardList className="h-5.5 w-5.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Diet Planner</span>
            </Link>
            <Link href="/gyms-supplements" className="flex flex-col items-center gap-0.5 text-text-app hover:text-brand-primary">
              <Dumbbell className="h-5.5 w-5.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Gyms & Supps</span>
            </Link>
          </div>

          <footer className="border-t border-border-app bg-card-app/30 py-6 text-center text-xs text-text-muted mt-auto mb-16 sm:mb-0">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <p className="font-semibold">&copy; {new Date().getFullYear()} AnaySwap. Promoting cleaner eating in India.</p>
              <p className="mt-1 text-[10px] opacity-75">
                Nutrition comparison values are per 100g or standard restaurant serving size references.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
