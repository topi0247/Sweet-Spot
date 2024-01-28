import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Headers from "@/components/header";
import Footers from "@/components/footer";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "バレチョコ！",
  description: "バレンタインのチョコなどお菓子をオススメし合うアプリです",
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
          <main className="flex-grow container mx-auto">{children}</main>
          <Footers />
        </div>
      </body>
    </html>
  );
}
