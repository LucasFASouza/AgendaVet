import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProfileBadge } from "@/components/ProfileBadge";
import { Suspense } from "react";
import { AppProviders } from "@/app/_providers";
import { Skeleton } from "@/components/ui/skeleton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agenda Vet",
  description: "Agenda Vet is a veterinary appointment scheduling app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProviders>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
            <ProfileBadge />
          </Suspense>

          <main className="px-6 pb-24 flex-grow">{children}</main>
        </body>
      </AppProviders>
    </html>
  );
}
