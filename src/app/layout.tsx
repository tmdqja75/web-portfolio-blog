import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import PageTransition from "@/components/ui/page-transition";
import SiteHeader from "@/components/site-header";
import MadeWithBadge from "@/components/made-with-badge";
import PersistentOceanBackground from "@/components/persistent-ocean-background";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 dark:bg-black">
        <PersistentOceanBackground />
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
        <MadeWithBadge />
        <Analytics />
      </body>
    </html>
  );
}
