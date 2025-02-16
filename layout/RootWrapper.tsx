"use client";

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
    <body
      className={`${backgroundClass} min-h-screen flex justify-center items-center mx-auto text-primaryWhite`}
    >
      {children}
    </body>
  );
}
