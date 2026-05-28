import { AuthGuard } from "@/guards/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main className="p-6">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="mt-2 text-gray-600">Página en construcción.</p>
      </main>
    </AuthGuard>
  );
}

