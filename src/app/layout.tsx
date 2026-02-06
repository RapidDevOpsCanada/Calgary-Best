import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calgary Best - The Urban Journal",
  description: "The definitive guide to city culture, hidden gems, and the viral moments that define modern Calgary.",
  keywords: ["Calgary", "city guide", "restaurants", "nightlife", "culture", "events"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white font-sans text-[#181111] transition-colors duration-300" style={{ fontFamily: '"Inter", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
