import { prisma } from "@/lib/prisma"
import { Clock, Lock, CheckCircle2 } from "lucide-react"
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/data"
import { formatDuration } from "@/lib/utils"

export const metadata = { title: "Admin — Contenido" }

export default async function AdminContenidoPage() {
  const videos = await prisma.video.findMany({
    orderBy: [{ week: "asc" }, { order: "asc" }],
    include: { _count: { select: { progress: { where: { completed: true } } } } },
  })

  const weeks = Array.from({ length: 6 }, (_, i) => i + 1)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Contenido
        </h1>
        <span className="text-gray text-sm">{videos.length} videos</span>
      </div>

      {weeks.map((week) => {
        const weekVideos = videos.filter((v) => v.week === week)
        if (!weekVideos.length) return null
        return (
          <div key={week}>
            <h2 className="text-lg text-navy mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Semana {week}
            </h2>
            <div className="space-y-2">
              {weekVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-xl border border-gray-light p-4 flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${video.status === "PUBLISHED" ? "bg-teal/10" : "bg-gray-light"}`}>
                    {video.status === "PUBLISHED" ? <CheckCircle2 size={16} className="text-teal" /> : <Lock size={16} className="text-gray" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[video.category]}`}>
                        {CATEGORY_LABELS[video.category]}
                      </span>
                      <span className="text-gray text-xs flex items-center gap-1"><Clock size={11} /> {formatDuration(video.duration)}</span>
                    </div>
                    <p className="text-navy text-sm font-medium truncate">{video.title}</p>
                    <p className="text-gray text-xs">{video.specialist}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-navy text-sm font-semibold">{video._count.progress}</p>
                    <p className="text-gray text-xs">completados</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${video.status === "PUBLISHED" ? "bg-teal/10 text-teal-dark" : "bg-gray-light text-gray"}`}>
                    {video.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
