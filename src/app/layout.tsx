import type { Metadata } from "next";
import { Montserrat, Luxurious_Script, Barrio } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const luxuriousScript = Luxurious_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luxurious",
  display: "swap",
});

const barrio = Barrio({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-barrio",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daniela Brunetto — Portfolio",
  description: "An analog dispatch from a digital hand.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${luxuriousScript.variable} ${barrio.variable}`}
    >
      <ScrollToTop />
      <body className="bg-bone text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}