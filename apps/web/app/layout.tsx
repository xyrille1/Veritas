import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "VERITAS - Supply Chain Settlement on SUI",
  description:
    "VERITAS: Atomic supply chain verification and programmatic payment settlement powered by SUI blockchain. From verified to paid in under 3 seconds.",
  keywords: [
    "supply chain",
    "blockchain",
    "SUI",
    "payment settlement",
    "provenance",
  ],
  creator: "ARIA / Product Strategy",
  openGraph: {
    title: "VERITAS - Supply Chain Settlement on SUI",
    description:
      "Collapse the 30-90 day payment lag with atomic on-chain settlement",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <Providers>
          <div className="min-h-screen bg-[#0A1628]">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
