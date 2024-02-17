import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Headers from "@/components/Header";
import Footers from "@/components/Footer";
import { Suspense } from "react";
import Loading from "./loading";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sweet Spot!",
  description: "チョコやお菓子を紹介し合うサイトです",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://sweet-spot-topi.vercel.app/",
    siteName: "Sweet Spot!",
    images: ["https://sweet-spot-topi.vercel.app/Sweet Spot!.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Headers />
          <Suspense fallback={<Loading />}>
            <main className="flex-grow container mx-auto p-4">
              <p className="text-center p-2 py-4 bg-red-200 rounded-2xl border-red-600 border-solid border">
                現在サービス改良中です。利用はできますが内容が変更されることがあります。
                <br />
                あらかじめご了承くださいませ。
              </p>
              {children}
            </main>
          </Suspense>
          <Footers />
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
