import { Suspense } from "react";
import { AuthView } from "@/presentation/features/auth-view";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-24 text-slate-500 font-semibold text-sm">Memuat...</div>}>
      <AuthView initialMode="register" />
    </Suspense>
  );
}

