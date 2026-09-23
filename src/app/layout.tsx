import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto } from "next/font/google";
import { Footer } from "@/presentation/components/footer";
import { Header } from "@/presentation/components/header";
import { CartDrawer } from "@/presentation/components/cart-drawer";
import { CartProvider } from "@/presentation/context/cart-context";
import { siteConfig } from "@/shared/config/site";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap"
});

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  icons: {
    icon: [
      { url: "/images/logo.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${roboto.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans text-[#171d18] antialiased" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
