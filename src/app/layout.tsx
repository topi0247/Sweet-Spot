import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Headers from "@/components/Header";
import Footers from "@/components/Footer";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sweet Spot!",
  description: "チョコやお菓子を紹介し合うサイトです",
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
            <main className="flex-grow container mx-auto p-4">{children}</main>
          </Suspense>
          <Footers />
        </div>
      </body>
    </html>
  );
}
