import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stella - Making Data Management Simple",
  description: "Document OCR SaaS platform for processing mixed documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
