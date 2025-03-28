import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Buscador Rio",
  description: "Fale com a gente! Como podemos ajudar?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} font-sans antialiased relative bg-[#F8F8F8] bg-[url('/background-pattern.svg')] bg-center bg-[length:100%_auto] bg-fixed bg-no-repeat`}
      >
        {children}
      </body>
    </html>
  );
}
