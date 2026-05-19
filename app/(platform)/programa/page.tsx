import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Clock, CheckCircle2, Lock, PlayCircle, User } from "lucide-react"
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/data"
import { formatDuration } from "@/lib/utils"
import { BunnyPlayer } from "@/components/BunnyPlayer"

export const metadata = { title: "Mi Programa — FILAR‑6" }

export default async function ProgramaPage({
  searchParams,
}: {
  searchParams: Promise<{ video?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { activeWeek } = session.user
  const { video: activeVideoId } = await searchParams

  const videos = await prisma.video.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ week: "asc" }, { order: "asc" }],
    include: {
      progress: { where: { userId: session.user.id } },
    },
  })

  const activeVideo = activeVideoId
    ? videos.find((v) => v.id === activeVideoId && v.week <= activeWeek)
    : null

  const userSubtitles = await prisma.user
    .findUnique({ where: { id: session.user.id }, select: { subtitles: true } })
    .then((u) => u?.subtitles ?? true)

  const completedCount = videos.filter((v) => v.progress[0]?.completed).length
  const weeks = Array.from({ length: 6 }, (_, i) => i + 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl text-navy mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Mi programa
        </h1>
        <p className="text-gray text-lg">6 semanas de contenido progresivo para tu bienestar</p>
      </div>

      {/* Active player */}
      {activeVideo && (
        <div className="bg-white rounded-2xl border border-gray-light shadow-sm overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-teal to-teal-light" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[activeVideo.category]}`}>
                {CATEGORY_LABELS[activeVideo.category]}
              </span>
              <span className="text-gray text-sm">{activeVideo.specialist}</span>
              <span className="text-gray text-sm flex items-center gap-1">
                <Clock size={13} /> {formatDuration(activeVideo.duration)}
              </span>
            </div>
            <h2 className="text-2xl text-navy mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              {activeVideo.title}
            </h2>
            <BunnyPlayer
              videoId={activeVideo.id}
              subtitles={userSubtitles}
            />
            <p className="text-gray text-base mt-4 leading-relaxed">{activeVideo.description}</p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-light shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-navy font-medium">Progreso general</p>
          <p className="text-teal font-semibold">{completedCount} de {videos.length} videos completados</p>
        </div>
        <div className="h-3 bg-gray-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal to-teal-light rounded-full"
            style={{ width: `${Math.round((completedCount / videos.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Weeks */}
      {weeks.map((week) => {
        const weekVideos = videos.filter((v) => v.week === week)
        const locked = week > activeWeek
        const completedCount = weekVideos.filter((v) => v.progress[0]?.completed).length

        return (
          <section key={week}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm shrink-0 ${
                locked ? "bg-gray-light text-gray" :
                completedCount === weekVideos.length ? "bg-teal text-white" : "bg-teal/10 text-teal"
              }`}>
                {locked ? <Lock size={16} /> : week}
              </div>
              <div>
                <h2 className={`text-xl ${locked ? "text-gray" : "text-navy"}`} style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  Semana {week}
                  {week === activeWeek && <span className="ml-2 text-sm text-teal font-sans font-normal">· En curso</span>}
                </h2>
                <p className="text-gray text-sm">
                  {locked ? "Completa la semana anterior para desbloquear" : `${completedCount} de ${weekVideos.length} completados`}
                </p>
              </div>
            </div>

            <div className={`space-y-3 ${locked ? "opacity-50 pointer-events-none" : ""}`}>
              {weekVideos.map((video) => {
                const progress = video.progress[0]
                const pct = progress ? Math.round((progress.secondsWatched / video.duration) * 100) : 0
                const isActive = activeVideoId === video.id

                return (
                  <div key={video.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${isActive ? "border-teal" : "border-gray-light hover:border-teal/30"}`}>
                    {progress?.completed && <div className="h-1 bg-teal" />}
                    {!progress?.completed && pct > 0 && (
                      <div className="h-1 bg-gray-light">
                        <div className="h-full bg-teal/50" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${progress?.completed ? "bg-teal" : "bg-gray-light"}`}>
                          {progress?.completed ? <CheckCircle2 size={22} className="text-white" /> : <PlayCircle size={22} className="text-gray" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[video.category]}`}>
                              {CATEGORY_LABELS[video.category]}
                            </span>
                            <span className="text-gray text-sm flex items-center gap-1"><Clock size={12} /> {formatDuration(video.duration)}</span>
                            {progress?.completed && <span className="text-xs text-teal font-medium">✓ Completado</span>}
                            {!progress?.completed && pct > 0 && <span className="text-xs text-gray">{pct}% visto</span>}
                          </div>
                          <h3 className="text-base text-navy mb-1 font-medium" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                            {video.title}
                          </h3>
                          <p className="text-gray text-sm leading-relaxed line-clamp-2">{video.description}</p>
                          <div className="flex items-center gap-1.5 mt-2 text-gray text-sm">
                            <User size={13} /> <span>{video.specialist}</span>
                          </div>
                        </div>

                        {!locked && (
                          <a
                            href={`/programa?video=${video.id}`}
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] bg-teal/10 text-teal hover:bg-teal hover:text-white"
                          >
                            {progress?.completed ? "Ver de nuevo" : pct > 0 ? "Continuar" : "Ver video"}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
