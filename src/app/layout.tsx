import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import PageTransition from "@/components/ui/page-transition";
import SiteHeader from "@/components/site-header";
import MadeWithBadge from "@/components/made-with-badge";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "하승범 | AI Agent Engineer",
  description:
    "프로덕션 LLM 에이전트, 평가 체계, 관측성, HITL 워크플로를 설계하고 운영하는 AI Agent Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 dark:bg-black">
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
        <MadeWithBadge />
      </body>
    </html>
  );
}
