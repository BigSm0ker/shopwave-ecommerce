// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-5xl font-bold mb-6">Bienvenido a ShopWave Fusion</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Descubre los mejores productos tecnológicos al mejor precio. 
      </p>
      {/* Asumiendo que la Persona 4 hará un componente Button luego, por ahora usa HTML normal con Tailwind */}
      <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
        Ver Catálogo
      </Link>
    </main>
  );
}
