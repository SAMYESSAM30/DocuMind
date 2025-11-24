import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/components/i18n-provider";
import { ReduxProvider } from "@/components/redux-provider";
import { GlobalLoader } from "@/components/loader";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "DocuMind - Extract Technical Requirements",
  description: "Analyze Business Requirements Documents and extract technical requirements automatically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          <ReduxProvider>
            {children}
            <Toaster />
            <GlobalLoader />
          </ReduxProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

