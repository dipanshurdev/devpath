"use client";

import { Providers } from "@/lib/providers";
import { usePathname } from "next/navigation";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const backgroundClass = pathname === "/" ? "bg-foreground/80" : "bg-secondry";

  return (
    <Providers>
      <body
        className={`${backgroundClass}  min-h-screen flex justify-center items-center mx-auto text-primaryWhite scrollbar `}
      >
        {children}
      </body>
    </Providers>
  );
}
