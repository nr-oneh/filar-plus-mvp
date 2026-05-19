import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WellnessForm } from "@/components/WellnessForm"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

export const metadata = { title: "Seguimiento — FILAR‑6" }

export default async function SeguimientoPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const logs = await prisma.wellnessLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 30,
  })

  const avgPain =
    logs.length > 0
      ? (logs.slice(0, 7).reduce((a, b) => a + b.painLevel, 0) / Math.min(logs.length, 7)).toFixed(1)
      : null

  const avgEnergy =
    logs.length > 0
      ? (logs.slice(0, 7).reduce((a, b) => a + b.energy, 0) / Math.min(logs.length, 7)).toFixed(1)
      : null

  function trend(key: "painLevel" | "energy") {
    if (logs.length < 4) return "stable"
    const recent = logs.slice(0, 3).reduce((a, b) => a + b[key], 0) / 3
    const older = logs.slice(3, 7).reduce((a, b) => a + b[key], 0) / Math.min(4, logs.length - 3)
    if (Math.abs(recent - older) < 0.5) return "stable"
    if (key === "painLevel") return recent < older ? "improving" : "worsening"
    return recent > older ? "improving" : "worsening"
  }

  const painTrend = trend("painLevel")
  const energyTrend = trend("energy")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl text-navy mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Seguimiento
        </h1>
        <p className="text-gray text-lg">Registra cómo te sientes cada día</p>
      </div>

      {avgPain && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Dolor promedio (7 días)", value: avgPain, suffix: "/10", t: painTrend, low: true },
            { label: "Energía promedio (7 días)", value: avgEnergy, suffix: "/10", t: energyTrend, low: false },
          ].map(({ label, value, suffix, t, low }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-light shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray text-sm font-medium">{label}</p>
                {t === "improving" ? (
                  low ? <TrendingDown size={18} className="text-teal" /> : <TrendingUp size={18} className="text-teal" />
                ) : t === "worsening" ? (
                  low ? <TrendingUp size={18} className="text-coral" /> : <TrendingDown size={18} className="text-coral" />
                ) : (
                  <Minus size={18} className="text-gray" />
                )}
              </div>
              <p className="text-3xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {value}<span className="text-base text-gray">{suffix}</span>
              </p>
              <p className={`text-sm mt-1 font-medium ${t === "improving" ? "text-teal" : t === "worsening" ? "text-coral" : "text-gray"}`}>
                {t === "improving" ? "Mejorando esta semana" : t === "worsening" ? "Empeoró esta semana" : "Sin cambios significativos"}
              </p>
            </div>
          ))}
        </div>
      )}

      <WellnessForm />

      {logs.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-light shadow-sm">
          <h2 className="text-xl text-navy mb-5" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Historial reciente
          </h2>
          <div className="divide-y divide-gray-light/50">
            {logs.map((log) => (
              <div key={log.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="w-20 shrink-0">
                    <p className="text-navy font-medium text-sm">
                      {new Date(log.date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </p>
                    <p className="text-gray text-xs">
                      {new Date(log.date).toLocaleDateString("es-MX", { weekday: "long" })}
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray w-12">Dolor</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full ${
                            i < log.painLevel
                              ? log.painLevel <= 3 ? "bg-teal" : log.painLevel <= 6 ? "bg-gold" : "bg-coral"
                              : "bg-gray-light"
                          }`} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-navy ml-1">{log.painLevel}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray w-12">Energía</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full ${i < log.energy ? "bg-teal" : "bg-gray-light"}`} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-navy ml-1">{log.energy}/10</span>
                    </div>
                    {log.notes && <p className="text-gray text-sm italic">"{log.notes}"</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
