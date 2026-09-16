import type { Metadata } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import { Footer } from "@/presentation/components/footer";
import { Header } from "@/presentation/components/header";
import { siteConfig } from "@/shared/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${nunitoSans.variable}`}>
      <body className="min-h-screen bg-[#f4fbf2] font-sans text-[#171d18] antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
