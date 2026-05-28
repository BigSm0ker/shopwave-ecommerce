interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({
  children
}: PageLayoutProps) {
  return (
    <main
      className="
        w-full
        max-w-7xl
        mx-auto
        px-6
        py-10
      "
    >
      {children}
    </main>
  )
}