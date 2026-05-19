import { LoginForm } from "@/components/LoginForm";
import { Leaf } from "lucide-react";

export const metadata = {
  title: "Entrar — FILAR‑6",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <h1
              className="text-4xl text-navy"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              FILAR‑6
            </h1>
          </div>
          <p className="text-gray text-lg leading-relaxed">
            Programa de bienestar para
            <br />
            enfermedades reumáticas
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-light/60">
          <h2
            className="text-2xl text-navy mb-1"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Bienvenida de nuevo
          </h2>
          <p className="text-gray mb-7 text-base">
            Ingresa para continuar con tu programa
          </p>

          <LoginForm />
        </div>

        {/* Demo hint */}
        <p className="text-center text-gray text-sm mt-6 opacity-70">
          Acceso demo: demo@filar6.com · Demo123
        </p>
      </div>
    </main>
  );
}
