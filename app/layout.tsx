import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "./ui/lang";
import { ConfirmProvider } from "./ui/Confirm";
import InstallBar from "./Components/PWAinstall";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CommittieApp — BC made simple",
  description: "Run your family BC (committee) on your phone: members, monthly payments, receipts and payouts in one place.",
  manifest: "/manifest.json",
  icons: { icon: "/images/logo.jpg", apple: "/images/logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <LanguageProvider>
          <ConfirmProvider>
            {children}
            <InstallBar />
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop />
          </ConfirmProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
