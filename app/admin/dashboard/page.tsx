import { prisma } from "@/lib/prisma"
import { Users, PlayCircle, CreditCard, TrendingUp } from "lucide-react"

export const metadata = { title: "Admin — Métricas" }

export default async function AdminDashboardPage() {
  const [totalUsers, activeSubs, totalVideos, recentLogs] = await Promise.all([
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.video.count({ where: { status: "PUBLISHED" } }),
    prisma.wellnessLog.count({
      where: { date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ])

  const weekDistribution = await prisma.user.groupBy({
    by: ["activeWeek"],
    where: { role: "PATIENT" },
    _count: { activeWeek: true },
    orderBy: { activeWeek: "asc" },
  })

  const stats = [
    { label: "Pacientes activos", value: totalUsers, icon: Users, color: "bg-teal/10 text-teal" },
    { label: "Suscripciones activas", value: activeSubs, icon: CreditCard, color: "bg-gold/20 text-navy" },
    { label: "Videos publicados", value: totalVideos, icon: PlayCircle, color: "bg-teal-light/20 text-teal-dark" },
    { label: "Registros bienestar (7d)", value: recentLogs, icon: TrendingUp, color: "bg-coral/10 text-coral" },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
        Métricas
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-light shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-3xl text-navy font-semibold" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              {value}
            </p>
            <p className="text-gray text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-light shadow-sm">
        <h2 className="text-lg text-navy mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Distribución por semana
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => {
            const week = i + 1
            const count = weekDistribution.find((d) => d.activeWeek === week)?._count.activeWeek ?? 0
            const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
            return (
              <div key={week} className="flex items-center gap-3">
                <span className="text-sm text-navy w-16 shrink-0">Semana {week}</span>
                <div className="flex-1 h-2.5 bg-gray-light rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray w-16 shrink-0">{count} usuarios ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
