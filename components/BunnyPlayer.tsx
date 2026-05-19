"use client"

import { useEffect, useRef, useState } from "react"
import { updateVideoProgress } from "@/actions/progress"

interface BunnyPlayerProps {
  videoId: string
  subtitles?: boolean
  onComplete?: () => void
}

export function BunnyPlayer({ videoId, subtitles = true, onComplete }: BunnyPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const secondsRef = useRef(0)

  useEffect(() => {
    fetch(`/api/bunny/signed-url?videoId=${videoId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.url) setEmbedUrl(d.url)
        else setError(true)
      })
      .catch(() => setError(true))
  }, [videoId])

  useEffect(() => {
    if (!embedUrl) return

    intervalRef.current = setInterval(async () => {
      secondsRef.current += 30
      await updateVideoProgress(videoId, secondsRef.current)
    }, 30000)

    return () => clearInterval(intervalRef.current)
  }, [embedUrl, videoId])

  if (error) {
    return (
      <div className="aspect-video bg-gray-light rounded-2xl flex items-center justify-center">
        <p className="text-gray">No se pudo cargar el video. Intenta más tarde.</p>
      </div>
    )
  }

  if (!embedUrl) {
    return (
      <div className="aspect-video bg-gray-light rounded-2xl flex items-center justify-center animate-pulse">
        <p className="text-gray">Cargando video...</p>
      </div>
    )
  }

  return (
    <div className="aspect-video rounded-2xl overflow-hidden shadow-md">
      <iframe
        ref={iframeRef}
        src={`${embedUrl}&captions=${subtitles ? "true" : "false"}`}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      />
    </div>
  )
}
