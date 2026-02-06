import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://florelle.ma';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Florelle | Boutique Officielle Maroc",
    template: "%s | Florelle Maroc"
  },
  description: "Découvrez l'excellence de la beauté italienne au Maroc. Maquillage de luxe pour les yeux, les lèvres et le visage. Livraison partout au Maroc.",
  keywords: ["Maquillage Maroc", "Cosmétiques Luxe", "Florelle Beauty", "Maquillage Italien", "Rouge à lèvres", "Fond de teint", "Mascara", "Beauté Maroc"],
  authors: [{ name: "Florelle Beauty Maroc" }],
  creator: "Florelle Beauty",
  publisher: "Florelle Beauty",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: baseUrl,
    title: "Florelle | Boutique Officielle Maroc",
    description: "L'excellence de la beauté italienne désormais au Maroc. Découvrez notre gamme complète de maquillage.",
    siteName: "Florelle Beauty Maroc",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Florelle Beauty Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Florelle | Boutique Officielle Maroc",
    description: "L'excellence de la beauté italienne désormais au Maroc.",
    images: ["/og-image.jpg"],
    creator: "@florelle_maroc",
  },
  alternates: {
    canonical: baseUrl,
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Florelle Beauty Maroc",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.png`,
  "sameAs": [
    "https://www.instagram.com/florelle_maroc/",
    "https://www.tiktok.com/@florelle.maroc",
    "https://www.facebook.com/florelle.maroc"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+212-000-000000",
    "contactType": "customer service",
    "areaServed": "MA",
    "availableLanguage": ["French", "Arabic"]
  }
};

import { Providers } from "@/components/providers/Providers";

// ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased overflow-x-hidden">
        <Providers>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
