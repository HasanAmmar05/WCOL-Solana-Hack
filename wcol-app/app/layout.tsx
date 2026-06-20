import type { Metadata } from "next";
import { Providers } from "./providers";
import { Nav } from "./nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "WCOL — WorldCup Oracle League",
  description: "Predictions are screenshots. Ours are on-chain.",
  keywords: "World Cup 2026, Solana, oracle predictions, blockchain, FIFA",
  openGraph: {
    title: "WCOL — WorldCup Oracle League",
    description: "Predictions are screenshots. Ours are on-chain.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-neutral-100 font-sans antialiased selection:bg-neutral-800 selection:text-white">
        <Providers>
          <Nav />
          <main className="min-h-screen pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
