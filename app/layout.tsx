import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SilhouetteDefs from "@/components/SilhouetteDefs";

export const metadata: Metadata = {
  title: "Pilot Cars — Wheels down. Drive away.",
  description:
    "A closed marketplace for verified airline crew. Verified hosts, crew rates, no rental-counter line — at 38 fields and growing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SilhouetteDefs />
        <TopNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
