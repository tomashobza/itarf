import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";

const montserratSans = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Is That a Red Flag? | Dating Behavior Judgement Community",
  description:
    "Ever wondered if that behavior your date showed was actually a red flag? Submit dating behaviors and let the crowd decide if they're red flags, green flags, or just neutral. Get thousands of opinions on dating behaviors!",
  keywords:
    "red flag, dating, relationships, dating advice, green flag, dating behaviors, relationship advice, dating community, dating tips",
  authors: [{ name: "Tomáš Hobza", url: "https://tomashobza.eu" }],
  creator: "Tomáš Hobza",
  publisher: "Tomáš Hobza",
  robots: "index, follow",
  openGraph: {
    title: "Is That a Red Flag? | Dating Behavior Judgement Community",
    description:
      "Submit dating behaviors and let the crowd decide if they're red flags, green flags, or neutral. Community-driven dating advice!",
    url: "https://is-that-a-red-flag.vercel.app/", // Replace with your actual domain
    siteName: "Is That a Red Flag?",
    images: [
      {
        url: "/preview.png", // You'll want to create this
        width: 1200,
        height: 630,
        alt: "Is That a Red Flag? - Dating Behavior Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is That a Red Flag? | Dating Behavior Judgement Community",
    description:
      "Submit dating behaviors and let the crowd decide if they're red flags, green flags, or neutral!",
    images: ["/preview.png"], // Same image as OpenGraph
    creator: "@tom_hobza", // Replace with your Twitter handle if you have one
  },
  alternates: {
    canonical: "https://is-that-a-red-flag.vercel.app/", // Replace with your actual domain
  },
  category: "lifestyle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserratSans.variable} font-sans ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
