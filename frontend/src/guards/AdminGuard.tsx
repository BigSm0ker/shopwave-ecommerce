"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    // 1. Creamos un estado para saber si ya estamos en el navegador
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // 2. Solo redirigimos si ya estamos en el navegador y terminó de cargar
        if (mounted && !isLoading && (!isAuthenticated || user?.role !== "ROLE_ADMIN")) {
            router.push("/");
        }
    }, [isLoading, isAuthenticated, router, user?.role, mounted]);

    // 3. REGLA DE ORO: Si aún no se monta en el cliente, no dibujamos NADA para evitar el choque de Next.js
    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
                <div className="flex flex-col items-center space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="relative h-12 w-12">
                        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-400"></div>
                    </div>
                    <p className="text-sm font-medium text-slate-300 animate-pulse">
                        Verificando acceso de administrador...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== "ROLE_ADMIN") {
        return null;
    }

    return <>{children}</>;
};

export function withAdmin<P extends object>(Component: React.ComponentType<P>) {
    return function WithAdminComponent(props: P) {
        return (
            <AdminGuard>
                <Component {...props} />
            </AdminGuard>
        );
    };
}