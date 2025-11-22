import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ToastProvider } from "@/components/ui/toast";
import Sidebar from "@/components/Sidebar";
import MainContentWrapper from "@/components/MainContentWrapper";
import SkipToContent from "@/components/SkipToContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NewsHub - Your Source for Trusted Global News",
  description: "Experience news from around the world in a beautiful, broadcast-style format. Curated articles from trusted sources with a modern adaptive theme.",
  keywords: [
    "news",
    "global news",
    "world news",
    "current events",
    "breaking news",
    "technology",
    "business",
    "sports",
    "trusted sources",
  ],
  openGraph: {
    title: "NewsHub - Global News Aggregator",
    description: "Your source for trusted news from around the world",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipToContent />
        <ThemeProvider>
          <ToastProvider>
            <SidebarProvider>
              {/* Sidebar Navigation */}
              <Sidebar />

              {/* Main Content Area - Shifts with sidebar */}
              <MainContentWrapper>
                {children}
              </MainContentWrapper>
            </SidebarProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
