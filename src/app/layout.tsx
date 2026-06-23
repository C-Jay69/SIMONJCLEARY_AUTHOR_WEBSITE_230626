import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/site/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Grain } from "@/components/site/grain";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fontSerif = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteDescription =
  "Simon J. Cleary is an Irish-born writer and the author of Ghosts in the Ash — the debut novel in the Duke Savage trilogy, a literary crime series about how power learns to be invisible.";

export const metadata: Metadata = {
  metadataBase: new URL("https://simonjcleary.com"),
  title: {
    default: "Simon J Cleary — Author",
    template: "%s — Simon J Cleary",
  },
  description: siteDescription,
  keywords: [
    "Simon J Cleary",
    "literary crime",
    "institutional thriller",
    "Duke Savage",
    "Ghosts in the Ash",
    "noir fiction",
    "literary thriller",
    "debut novel",
  ],
  authors: [{ name: "Simon J Cleary" }],
  creator: "Simon J Cleary",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://simonjcleary.com",
    siteName: "Simon J Cleary — Author",
    title: "Simon J Cleary — Author",
    description: siteDescription,
    images: [
      {
        url: "/images/books/ghosts-in-the-ash.jpg",
        width: 1200,
        height: 1800,
        alt: "Ghosts in the Ash — A Duke Savage Novel by Simon J Cleary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simon J Cleary — Author",
    description: siteDescription,
    images: ["/images/books/ghosts-in-the-ash.jpg"],
  },
  // Favicons are handled by Next.js file-based convention:
  // src/app/favicon.ico, src/app/icon.png, src/app/apple-icon.png
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Grain />
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
