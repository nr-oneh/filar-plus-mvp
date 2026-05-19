"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";
import { AlertCircle, Loader2 } from "lucide-react";

const initialState: LoginState = null;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-start gap-3 bg-coral/10 border border-coral/20 text-coral rounded-xl p-4 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-navy font-medium mb-2 text-base"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue="demo@filar6.com"
          className="w-full px-4 py-3.5 rounded-xl border border-gray-light bg-cream focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 text-navy placeholder:text-gray transition-colors"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-navy font-medium mb-2 text-base"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          defaultValue="Demo123"
          className="w-full px-4 py-3.5 rounded-xl border border-gray-light bg-cream focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 text-navy placeholder:text-gray transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-teal hover:bg-teal-dark text-white font-semibold text-lg py-4 rounded-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 min-h-[56px] shadow-sm shadow-teal/30 hover:shadow-teal/40 hover:shadow-md"
      >
        {isPending ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar a mi programa"
        )}
      </button>

      <p className="text-center text-gray text-sm">
        ¿Necesitas ayuda?{" "}
        <span className="text-teal cursor-default">
          hola@filar6.com
        </span>
      </p>
    </form>
  );
}
