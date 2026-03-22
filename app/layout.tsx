import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://possiblecentre.com/"),
  title: {
    default: "PCHR&R | Know Your Rights & Duties",
    template: "%s | PCHR&R"
  },
  description: "PCHR&R is a premier NGO in India dedicated to promoting human rights, responsibilities, and social awareness through education, legal aid, and community services.",
  keywords: [
    "PCHR&R", "Possible Centre", "Possible Centre for Human Rights and Responsibilities", 
    "Top NGO in India", "Best NGO in Delhi", "NGO Delhi", "Human Rights NGO",
    "Free Education NGO", "Child Education Charity", "Donate for child education",
    "Environmental NGO India", "Health Camp NGO", "Legal Awareness NGO", "Civil Rights",
    "CSR NGO partner", "Volunteer for NGO in India", "Donate to charity", 
    "Social Awareness", "Community Services", "Women Empowerment NGO",
    "मानवाधिकार संगठन", "शिक्षा एनजीओ", "भारत का सर्वश्रेष्ठ एनजीओ", "समाज सेवा",
    "PCHRR NGO", "Non-Governmental Organization India"
  ],
  authors: [{ name: "PCHR&R Team" }],
  creator: "PCHR&R",
  publisher: "PCHR&R",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PCHR&R | Know Your Rights & Duties",
    description: "Empowering communities through human rights awareness and education.",
    url: "/",
    siteName: "PCHR&R",
    images: [
      {
        url: "/logo.svg", 
        width: 1200,
        height: 630,
        alt: "PCHR&R Logo and Mission",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PCHR&R | Know Your Rights & Duties",
    description: "Empowering communities through human rights awareness and education.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "WbO01xyFPNftP2FmBPvsB35yEEyWNf7e9dNMFDn9OzQ",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/language-context";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased text-slate-900 bg-white`}
      >
        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Primary Domain Redirect */}
        <Script id="primary-domain-redirect" strategy="afterInteractive">
          {`
            if (window.location.hostname === 'possible-center-ngo.web.app' || window.location.hostname === 'possible-center-ngo.firebaseapp.com') {
              window.location.replace('https://possiblecentre.com' + window.location.pathname + window.location.search);
            }
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PCHR&R",
              "alternateName": "Possible Center for Human Rights and Responsibilities",
              "url": "https://possiblecentre.com/",
              "logo": "https://possiblecentre.com/logo.svg",
              "sameAs": [
                "https://www.facebook.com/possiblecentreforhumanrightsandreponsibilities",
                "https://www.instagram.com/possible.centre",
                "https://whatsapp.com/channel/0029Vb6s0VN0VycDd96j6R2e"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8882211155",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["en", "hi"]
              },
              "description": "An NGO dedicated to promoting human rights, responsibilities, and social awareness through education and community services."
            })
          }}
        />
        <LanguageProvider>
          <div className="flex flex-col min-h-[100dvh]">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <LanguageSwitcher />
          {/* WhatsApp Floating Button */}
          <a
            href="https://wa.me/918882211155?text=Hello%20PCHR%26R%2C%20I%20would%20like%20to%20know%20more%20about%20your%20work."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat with us on WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl shadow-green-900/40 hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <svg viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8">
              <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.84 6.653L2.667 29.333l6.88-1.813A13.28 13.28 0 0016.004 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.004 2.667zm0 24c-2.16 0-4.267-.587-6.107-1.68l-.44-.267-4.08 1.08 1.093-4-.28-.453A10.627 10.627 0 015.333 16c0-5.88 4.787-10.667 10.667-10.667S26.667 10.12 26.667 16 21.88 26.667 16 26.667zm5.867-8c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.987 1.253-.187.213-.347.24-.667.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.267-.64-.533-.547-.72-.56-.187-.013-.4-.013-.613-.013-.213 0-.56.08-.853.373-.293.293-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.467 4.827.76.333 1.36.533 1.827.68.773.24 1.467.213 2.013.133.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
            </svg>
          </a>
        </LanguageProvider>
      </body>
    </html>
  );
}
