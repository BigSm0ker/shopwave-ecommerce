import type { ReactNode } from "react";

interface AuthPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  sideTitle: string;
  sideDescription: string;
  sideNote: string;
  children: ReactNode;
}

export function AuthPageShell({
  eyebrow,
  title,
  description,
  sideTitle,
  sideDescription,
  sideNote,
  children,
}: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-transparent px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-border bg-surface/50 shadow-[0_25px_50px_var(--shadow-color)] backdrop-blur lg:grid-cols-2">
          <aside className="hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
                ShopWave
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
                {sideTitle}
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/80">
                {sideDescription}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 p-5 text-sm text-white/85">
              {sideNote}
            </div>
          </aside>

          <section className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </p>

              <h2 className="mt-4 text-3xl font-bold text-foreground-bright">{title}</h2>

              <p className="mt-3 text-sm leading-6 text-foreground-muted">
                {description}
              </p>

              {children}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
