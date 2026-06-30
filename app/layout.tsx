import type { Metadata, Viewport } from "next";
import { League_Spartan, Poppins, DM_Mono } from "next/font/google";
import "./globals.css";

/* Headings — matches EazyGrad's h1 font (League Spartan 700-900) */
const leagueSpartan = League_Spartan({
  variable: "--font-league",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

/* Body text — matches EazyGrad's paragraph font (Poppins 400-700) */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* Monospace — fee and duration data rows */
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "EazyGrad — Find Your Degree",
  description:
    "Describe your background and goals. Our AI matches you to the right online degree program.",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${poppins.variable} ${dmMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
