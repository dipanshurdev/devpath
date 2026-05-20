// import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <section className="relative flex min-h-screen w-full flex-col overflow-x-hidden antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        {/* <Footer /> */}
      </section>
      <ToastContainer
        autoClose={2000}
        position="bottom-right"
        theme="dark"
        hideProgressBar
        // closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Layout;
