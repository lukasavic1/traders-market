import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { FirstTimeVisitorModal } from "./components/FirstTimeVisitorModal";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MonitoringProvider } from "@/components/MonitoringProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Traders Market - Expert Advisors for MetaTrader 5",
  description: "Automate your trading with proven algorithmic trading strategies and Expert Advisors (EAs) for MetaTrader 5. Unlock 10+ battle-tested strategies trusted by traders worldwide.",
  keywords: "MetaTrader 5, Expert Advisors, EA, algorithmic trading, automated trading, trading strategies, MT5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#050816] text-white`}
      >
        <ErrorBoundary>
          <MonitoringProvider>
            <AuthProvider>
              <Navigation />
              {children}
              <Footer />
              <FirstTimeVisitorModal />
            </AuthProvider>
          </MonitoringProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
