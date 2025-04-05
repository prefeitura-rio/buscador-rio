import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import NetworkStatusProvider from "./components/NetworkStatusProvider";
import { Toaster } from "@/components/ui/sonner";
import ReCaptchaProvider from "./components/ReCaptchaProvider";
import { SearchProvider } from "@/context/SearchContext";

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
  const token = process.env.GOOGLE_ANALYTICS_ID || "";
  return (
    <html lang="en">
      <GoogleAnalytics gaId={token} />
      <body
        className={`${dmSans.variable} font-sans antialiased relative bg-[#F8F8F8] bg-[url('/background-pattern.svg')] bg-center bg-[length:100%_auto] bg-fixed bg-no-repeat`}
      >
        <NetworkStatusProvider>
          <ReCaptchaProvider>
            <SearchProvider>
            {children}
            </SearchProvider>
          </ReCaptchaProvider>
        </NetworkStatusProvider>
        <Toaster />
      </body>
    </html>
  );
}
