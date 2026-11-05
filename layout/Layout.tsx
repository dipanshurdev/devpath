// import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import React from "react";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <section className="relative flex min-h-screen w-full flex-col overflow-x-hidden antialiased">
        <Navbar />
        <main className="flex-1 ">{children}</main>
        {/* <Footer /> */}
      </section>
      <Toaster position="bottom-right" richColors />
    </>
  );
};

export default Layout;
