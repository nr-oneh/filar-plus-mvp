import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  PlayCircle, TrendingUp, Award, Clock, ChevronRight,
  CheckCircle2, Lock,
} from "lucide-react"
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/data"
import { formatDuration } from "@/lib/utils"

export const metadata = { title: "Inicio — FILAR‑6" }

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Buenos días"
  if (h < 18) return "Buenas tardes"
  return "Buenas noches"
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [user, allVideos, earnedBadges, recentLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, diagnosis: true, activeWeek: true },
    }),
    prisma.video.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ week: "asc" }, { order: "asc" }],
      include: {
        progress: { where: { userId: session.user.id } },
      },
    }),
    prisma.userBadge.findMany({
      where: { userId: session.user.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    }),
    prisma.wellnessLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ])

  if (!user) redirect("/login")

  const { name, diagnosis, activeWeek } = user
  const firstName = name.split(" ")[0]

  const todayVideo = allVideos.find(
    (v) => v.week === activeWeek && !v.progress[0]?.completed
  ) ?? allVideos.find((v) => v.week === activeWeek)

  const completedCount = allVideos.filter((v) => v.progress[0]?.completed).length

  // Week progress per week
  function weekPct(week: number) {
    const vids = allVideos.filter((v) => v.week === week)
    if (!vids.length) return 0
    const done = vids.filter((v) => v.progress[0]?.completed).length
    return Math.round((done / vids.length) * 100)
  }

  const lastLog = recentLogs[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray text-base mb-1">
            {greeting()},{" "}
            <span className="text-teal font-medium">{diagnosis}</span>
          </p>
          <h1
            className="text-4xl text-navy"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {greeting()}, {firstName}
          </h1>
        </div>

        <div className="bg-white rounded-2xl px-5 py-3 border border-gray-light text-right shadow-sm">
          <p className="text-gray text-sm mb-1">Tu semana actual</p>
          <div className="flex items-center gap-2 justify-end">
            <span
              className="text-2xl text-navy"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {activeWeek}
            </span>
            <span className="text-gray">de 6</span>
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-5 rounded-full ${i < activeWeek ? "bg-teal" : "bg-gray-light"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-light shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-teal" />
            </div>
            <p className="text-gray text-sm font-medium">Videos completados</p>
          </div>
          <p className="text-3xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            {completedCount}
          </p>
          <p className="text-gray text-sm mt-1">de {allVideos.length} videos</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-light shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center">
              <Award size={18} className="text-navy" />
            </div>
            <p className="text-gray text-sm font-medium">Logros obtenidos</p>
          </div>
          <p className="text-3xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            {earnedBadges.length}
          </p>
          <p className="text-gray text-sm mt-1">de 5 logros</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-light shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-coral/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-coral" />
            </div>
            <p className="text-gray text-sm font-medium">Dolor (hoy)</p>
          </div>
          {lastLog ? (
            <>
              <p className="text-3xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {lastLog.painLevel}<span className="text-base text-gray">/10</span>
              </p>
              <p className="text-gray text-sm mt-1">Energía: {lastLog.energy}/10</p>
            </>
          ) : (
            <p className="text-gray text-sm mt-1">Sin registros aún</p>
          )}
        </div>
      </div>

      {/* Today's video */}
      {todayVideo && (
        <div>
          <h2 className="text-xl text-navy mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Tu siguiente video
          </h2>
          <div className="bg-white rounded-2xl border border-gray-light shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-teal to-teal-light" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
                  <PlayCircle size={28} className="text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[todayVideo.category]}`}>
                      {CATEGORY_LABELS[todayVideo.category]}
                    </span>
                    <span className="text-gray text-sm flex items-center gap-1">
                      <Clock size={13} /> {formatDuration(todayVideo.duration)}
                    </span>
                  </div>
                  <h3 className="text-lg text-navy mb-1" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                    {todayVideo.title}
                  </h3>
                  <p className="text-gray text-sm line-clamp-2">{todayVideo.description}</p>
                  <p className="text-gray text-sm mt-2 font-medium">{todayVideo.specialist}</p>

                  {(() => {
                    const p = todayVideo.progress[0]
                    if (p && !p.completed && p.secondsWatched > 0) {
                      const pct = Math.round((p.secondsWatched / todayVideo.duration) * 100)
                      return (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray mb-1">
                            <span>Continuando...</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-light rounded-full overflow-hidden">
                            <div className="h-full bg-teal rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    }
                  })()}
                </div>

                <Link
                  href="/programa"
                  className="flex items-center gap-2 bg-teal text-white px-5 py-3 rounded-xl font-medium hover:bg-teal-dark transition-colors shrink-0 shadow-sm shadow-teal/30 min-h-[48px]"
                >
                  Ver video <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week progress + Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-light shadow-sm">
          <h2 className="text-lg text-navy mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Progreso por semana
          </h2>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => {
              const week = i + 1
              const locked = week > activeWeek
              const pct = locked ? 0 : weekPct(week)
              return (
                <div key={week} className="flex items-center gap-3">
                  <span className={`text-sm w-16 shrink-0 ${locked ? "text-gray" : "text-navy font-medium"}`}>
                    {locked ? (
                      <span className="flex items-center gap-1"><Lock size={12} /> Sem {week}</span>
                    ) : `Semana ${week}`}
                  </span>
                  <div className="flex-1 h-2 bg-gray-light rounded-full overflow-hidden">
                    {!locked && <div className="h-full bg-teal rounded-full" style={{ width: `${pct}%` }} />}
                  </div>
                  <span className="text-xs text-gray w-8 text-right shrink-0">
                    {locked ? "—" : `${pct}%`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-light shadow-sm">
          <h2 className="text-lg text-navy mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Mis logros recientes
          </h2>
          {earnedBadges.length === 0 ? (
            <p className="text-gray text-sm">Completa videos para desbloquear logros.</p>
          ) : (
            <div className="space-y-3">
              {earnedBadges.slice(0, 4).map(({ badge, earnedAt }) => (
                <div key={badge.id} className="flex items-center gap-3 py-2 border-b border-gray-light/50 last:border-0">
                  <span className="text-2xl">{badge.emoji}</span>
                  <div>
                    <p className="text-navy text-sm font-medium">{badge.name}</p>
                    <p className="text-gray text-xs">
                      {new Date(earnedAt).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent wellness */}
      {recentLogs.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-light shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Últimos registros de bienestar
            </h2>
            <Link href="/seguimiento" className="text-teal text-sm font-medium hover:text-teal-dark flex items-center gap-1">
              Registrar hoy <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-0 divide-y divide-gray-light/50">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <p className="text-gray text-sm w-20 shrink-0">
                  {new Date(log.date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray">Dolor</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < log.painLevel ? "bg-coral" : "bg-gray-light"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-navy w-6">{log.painLevel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray">Energía</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < log.energy ? "bg-teal" : "bg-gray-light"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-navy w-6">{log.energy}</span>
                </div>
                {log.notes && (
                  <p className="text-gray text-xs truncate flex-1 hidden lg:block">"{log.notes}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
