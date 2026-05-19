"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { evaluateBadges } from "@/lib/badges"
import { sendWeekUnlockedEmail } from "@/lib/resend"
import { revalidatePath } from "next/cache"

export async function updateVideoProgress(videoId: string, secondsWatched: number) {
  const session = await auth()
  if (!session?.user?.id) return

  const video = await prisma.video.findUnique({ where: { id: videoId } })
  if (!video) return

  const completed = secondsWatched / video.duration >= 0.9

  await prisma.videoProgress.upsert({
    where: { userId_videoId: { userId: session.user.id, videoId } },
    create: { userId: session.user.id, videoId, secondsWatched, completed },
    update: { secondsWatched, completed },
  })

  if (completed) {
    await checkWeekCompletion(session.user.id, video.week)
    await evaluateBadges(session.user.id)
  }

  revalidatePath("/dashboard")
  revalidatePath("/programa")
}

async function checkWeekCompletion(userId: string, completedWeek: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })
  if (!user || user.activeWeek !== completedWeek) return

  const weekVideos = await prisma.video.findMany({
    where: { week: completedWeek, status: "PUBLISHED" },
  })

  const completedProgress = await prisma.videoProgress.findMany({
    where: {
      userId,
      videoId: { in: weekVideos.map((v) => v.id) },
      completed: true,
    },
  })

  if (completedProgress.length < weekVideos.length) return

  const newWeek = completedWeek + 1
  await prisma.user.update({
    where: { id: userId },
    data: { activeWeek: newWeek },
  })

  await sendWeekUnlockedEmail({ name: user.name, email: user.email }, newWeek)
}
