import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({
  children,
  className = "",
}: PageLayoutProps) {
  return (
    <main
      className={`
        mx-auto
        w-full
        max-w-7xl
        px-4
        py-6
        sm:px-6
        sm:py-8
        lg:px-8
        lg:py-10
        ${className}
      `}
    >
      {children}
    </main>
  );
}