"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || user?.role !== "ROLE_ADMIN")) {
			router.push("/");
		}
	}, [isLoading, isAuthenticated, router, user?.role]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
				Verificando acceso de administrador...
			</div>
		);
	}

	if (!isAuthenticated || user?.role !== "ROLE_ADMIN") {
		return null;
	}

	return <>{children}</>;
};
