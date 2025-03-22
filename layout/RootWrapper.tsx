"use client";

import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const backgroundClass =
    pathname === "/" ? "bg-gradient-main " : "bg-gradient-page";

  return (
    <AuthProvider>
      <body
        className={`${backgroundClass} min-h-screen flex justify-center items-center mx-auto text-primaryWhite scrollbar`}
      >
        {children}
      </body>
    </AuthProvider>
  );
}
