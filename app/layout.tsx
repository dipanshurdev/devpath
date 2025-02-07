import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Layout from "@/layout/Layout";
import { LoginModal } from "@/components/modals/LoginModal";
import { RegisterModal } from "@/components/modals/RegisterModal";
// import { LoginModal } from "@/components/modals/LoginModal";
// import { RegisterModal } from "@/components/modals/RegisterModal";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DevPath | Developer Roadmaps",
  description:
    "DevPath helps you in your tech career with confidence and curated learning paths that guides you through the skills you need to become a proficient developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-main scrollbar`}
      >
        {/* <div> */}

        <Layout>
          <LoginModal />
          <RegisterModal />
          {children}
        </Layout>
        {/* </div> */}
      </body>
    </html>
  );
}
