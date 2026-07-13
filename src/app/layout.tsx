import type { Metadata } from "next";
import { NavigationProgress } from "@/components/navigation-progress";
import { AppProviders } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Union",
  description: "Asset Union",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProviders>
          <NavigationProgress />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
