import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
// import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Sari-Track",
  description:
    "A Web Application for Smarter, Faster, and Effortless Inventory Management",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "Sari-Track",
    description:
      "A Web Application for Smarter, Faster, and Effortless Inventory Management",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sari-Track",
    description:
      "A Web Application for Smarter, Faster, and Effortless Inventory Management"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        {/* <AuthProvider> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
