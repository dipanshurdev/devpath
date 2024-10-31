import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
// import { AuthProvider } from "@/context/AuthContext";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      {/* <AuthProvider> */}
      <div className="p-4">
        <Navbar />
        {children}
        <Footer />
      </div>
      {/* </AuthProvider> */}
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
