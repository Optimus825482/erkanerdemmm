import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Erkan Erdem — Full-Stack Developer & Veteriner Hekim",
  description: "2005'te Excel formülleriyle başlayan yazılım tutkusu, bugün full-stack uygulamalarla devam ediyor. 17+ yıllık deneyim. Veteriner Hekim, Web Geliştirici, Full-Stack & AI.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
