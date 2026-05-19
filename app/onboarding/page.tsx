import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { completeOnboarding } from "@/actions/profile"
import { Leaf } from "lucide-react"

export const metadata = { title: "Configurar perfil — FILAR‑6" }

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  if (session.user.onboardingDone) redirect("/dashboard")

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
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
          <p className="text-gray text-lg">Cuéntanos un poco sobre ti</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-light shadow-sm">
          <h2
            className="text-2xl text-navy mb-1"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Configura tu perfil
          </h2>
          <p className="text-gray mb-7">Solo tomará un momento</p>

          <form action={completeOnboarding} className="space-y-5">
            <div>
              <label className="block text-navy font-medium mb-2">
                ¿Cómo te llamas?
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Tu nombre completo"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-light bg-cream focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 text-navy"
              />
            </div>

            <div>
              <label className="block text-navy font-medium mb-2">
                Tu diagnóstico principal
              </label>
              <select
                name="diagnosis"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-light bg-cream focus:outline-none focus:border-teal text-navy"
              >
                <option value="">Selecciona...</option>
                <option value="FIBROMIALGIA">Fibromialgia</option>
                <option value="LUPUS">Lupus</option>
                <option value="ARTRITIS">Artritis Reumatoide</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-navy font-medium mb-3">
                Tamaño de letra preferido
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "NORMAL", label: "Normal", size: "text-base" },
                  { value: "LARGE", label: "Grande", size: "text-lg" },
                  { value: "XLARGE", label: "Muy grande", size: "text-xl" },
                ].map(({ value, label, size }) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="fontSize"
                      value={value}
                      defaultChecked={value === "LARGE"}
                      className="sr-only peer"
                    />
                    <div className="border-2 border-gray-light rounded-xl p-3 text-center peer-checked:border-teal peer-checked:bg-teal/5 transition-all">
                      <span className={`${size} text-navy font-medium`}>{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-teal hover:bg-teal-dark text-white font-semibold text-lg py-4 rounded-xl transition-all shadow-sm shadow-teal/30 min-h-[56px] mt-2"
            >
              Comenzar mi programa
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
