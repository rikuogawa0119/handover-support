import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "授業引継ぎ支援",
  description: "個別指導塾における授業引継ぎ支援システム"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
