import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Mail, Stethoscope, Calendar, Award } from "lucide-react"
import { logout } from "@/actions/auth"

export const metadata = { title: "Mi Perfil — FILAR‑6" }

const DIAGNOSIS_LABELS: Record<string, string> = {
  FIBROMIALGIA: "Fibromialgia",
  LUPUS: "Lupus",
  ARTRITIS: "Artritis Reumatoide",
  OTRO: "Otro",
}

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      badges: { include: { badge: true }, orderBy: { earnedAt: "desc" } },
      subscription: true,
    },
  })

  if (!user) redirect("/login")

  const allBadges = await prisma.badge.findMany()
  const earnedKeys = new Set(user.badges.map((ub) => ub.badge.key))

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl text-navy mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Mi perfil
        </h1>
        <p className="text-gray text-lg">Tu información y preferencias</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-light shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-teal to-teal-light" />
        <div className="p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center text-teal font-bold text-xl shrink-0">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {user.name}
              </h2>
              <p className="text-gray mt-1">Semana {user.activeWeek} de 6</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: Mail, label: "Correo", value: user.email },
              { icon: Stethoscope, label: "Diagnóstico", value: user.diagnosis ? DIAGNOSIS_LABELS[user.diagnosis] : "—" },
              { icon: Calendar, label: "Inicio del programa", value: new Date(user.startDate).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) },
              { icon: Award, label: "Logros", value: `${user.badges.length} de ${allBadges.length}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 py-3 border-b border-gray-light/50 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-teal" />
                </div>
                <div>
                  <p className="text-gray text-sm">{label}</p>
                  <p className="text-navy font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-light shadow-sm">
        <h2 className="text-xl text-navy mb-5" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Mis logros
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {allBadges.map((badge) => {
            const earned = earnedKeys.has(badge.key)
            return (
              <div key={badge.key} className={`rounded-xl p-4 text-center transition-all ${earned ? "bg-gold/15 border border-gold/30" : "bg-gray-light/50 border border-gray-light opacity-50"}`}>
                <span className="text-3xl block mb-2">{badge.emoji}</span>
                <p className={`text-sm font-semibold mb-1 ${earned ? "text-navy" : "text-gray"}`} style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {badge.name}
                </p>
                <p className="text-xs text-gray leading-tight">{badge.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      <form action={logout}>
        <button type="submit" className="w-full border-2 border-coral/30 text-coral hover:bg-coral/5 font-medium text-base py-4 rounded-xl transition-colors min-h-[56px]">
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
