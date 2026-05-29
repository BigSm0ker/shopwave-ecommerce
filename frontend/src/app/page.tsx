import Link from "next/link";

const highlights = [
  "Login funcional con JWT",
  "Registro funcional conectado al backend",
  "Productos y detalle desde API",
  "Rutas protegidas para usuario y admin",
];

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-10rem)] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_34%),linear-gradient(180deg,_#07111f_0%,_#0f172a_100%)] px-6 py-16 text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            ShopWave Fusion
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Tu tienda online con autenticación, catálogo y perfil real.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Navega productos, inicia sesión con JWT, protege rutas y administra
            tu experiencia desde un frontend conectado al backend Spring Boot.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Ver catálogo
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>

        <aside className="grid w-full max-w-xl gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold">Cobertura de la entrega</h2>
          <ul className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
