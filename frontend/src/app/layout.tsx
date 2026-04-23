import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev 8ersonality — 당신의 코딩 스타일은?",
  description: "GitHub 활동을 분석해 당신의 개발자 유형을 알아보세요.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Dev 8ersonality — 당신의 코딩 스타일은?",
    description: "GitHub 활동을 분석해 당신의 개발자 유형을 알아보세요.",
    images: [{ url: "/og_img.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} h-full`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "#0d1117", color: "#e6edf3" }}>
        {children}
      </body>
    </html>
  );
}
