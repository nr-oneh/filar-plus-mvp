import { prisma } from "./prisma"
import { sendCertificateEmail } from "./resend"

export async function evaluateBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      progress: { include: { video: true } },
      wellnessLogs: { orderBy: { date: "asc" } },
      badges: { include: { badge: true } },
    },
  })
  if (!user) return []

  const allBadges = await prisma.badge.findMany()
  const earnedKeys = new Set(user.badges.map((ub) => ub.badge.key))
  const newBadges: string[] = []

  async function award(key: string) {
    if (earnedKeys.has(key)) return
    const badge = allBadges.find((b) => b.key === key)
    if (!badge) return
    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } })
    earnedKeys.add(key)
    newBadges.push(key)
  }

  // week_1_done
  const week1Videos = user.progress.filter((p) => p.video.week === 1)
  const allWeek1Done = week1Videos.length > 0 && week1Videos.every((p) => p.completed)
  if (allWeek1Done) await award("week_1_done")

  // streak_7
  const logs = user.wellnessLogs
  if (logs.length >= 7) {
    const dates = logs.map((l) => new Date(l.date).toDateString())
    let streak = 1
    let maxStreak = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(logs[i - 1].date)
      const curr = new Date(logs[i].date)
      const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000)
      streak = diff === 1 ? streak + 1 : 1
      maxStreak = Math.max(maxStreak, streak)
    }
    if (maxStreak >= 7) await award("streak_7")
  }

  // cocina
  const cookingDone = user.progress.some(
    (p) => p.video.category === "COCINA" && p.completed
  )
  if (cookingDone) await award("cocina")

  // warrior — 10 ejercicio videos
  const ejercicioCount = user.progress.filter(
    (p) => p.video.category === "EJERCICIO" && p.completed
  ).length
  if (ejercicioCount >= 10) await award("warrior")

  // graduate
  if (user.activeWeek > 6) {
    await award("graduate")
    if (newBadges.includes("graduate")) {
      await sendCertificateEmail({ name: user.name, email: user.email })
    }
  }

  return newBadges
}
