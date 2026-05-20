import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  await prisma.userBadge.deleteMany()
  await prisma.videoProgress.deleteMany()
  await prisma.wellnessLog.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()
  await prisma.video.deleteMany()
  await prisma.badge.deleteMany()

  const [b1, b2, b3, b4, b5] = await Promise.all([
    prisma.badge.create({ data: { key: "week_1_done", name: "Primera semana completa", description: "Completaste todos los videos de la semana 1", emoji: "🏅" } }),
    prisma.badge.create({ data: { key: "streak_7", name: "7 días consecutivos", description: "Registraste tu bienestar 7 días seguidos", emoji: "🔥" } }),
    prisma.badge.create({ data: { key: "cocina", name: "Cocinero saludable", description: "Completaste un video de cocina", emoji: "👩‍🍳" } }),
    prisma.badge.create({ data: { key: "warrior", name: "Guerrero del movimiento", description: "Completaste 10 videos de ejercicio", emoji: "💪" } }),
    prisma.badge.create({ data: { key: "graduate", name: "Programa completo", description: "Finalizaste las 6 semanas de FILAR‑6", emoji: "🦋" } }),
  ])

  const videosSeed = [
    { title: "Introducción al movimiento consciente", description: "Aprende a moverte con intención para reducir el dolor articular. Ejercicios de bajo impacto para Fibromialgia y Artritis.", category: "EJERCICIO" as const, week: 1, specialist: "Dra. Carmen Vega", duration: 1200, bunnyUrl: "https://iframe.mediadelivery.net/embed/665122/demo-s1", status: "PUBLISHED" as const, order: 0 },
    { title: "Respiración y relajación profunda", description: "Técnicas de respiración diafragmática para reducir la tensión muscular y la percepción del dolor.", category: "BIENESTAR" as const, week: 1, specialist: "Psic. Roberto Flores", duration: 900, bunnyUrl: "https://iframe.mediadelivery.net/embed/665122/demo-s1b", status: "PUBLISHED" as const, order: 1 },
    { title: "Alimentación antiinflamatoria: bases", description: "Descubre qué alimentos reducen la inflamación crónica y cómo incorporarlos en tu día a día.", category: "NUTRICION" as const, week: 2, specialist: "Lic. Ana Torres", duration: 1500, bunnyUrl: "https://iframe.mediadelivery.net/embed/665122/demo-s2", status: "PUBLISHED" as const, order: 0 },
    { title: "Ejercicios para manos y muñecas", description: "Movimientos suaves y progresivos para mantener la flexibilidad y reducir la rigidez matutina.", category: "EJERCICIO" as const, week: 2, specialist: "Dra. Carmen Vega", duration: 1080, bunnyUrl: "https://iframe.mediadelivery.net/embed/665122/demo-s2b", status: "PUBLISHED" as const, order: 1 },
    { title: "Cocina fácil: sopas reconfortantes", description: "Recetas de sopas antiinflamatorias que puedes preparar en 20 minutos.", category: "COCINA" as const, week: 3, specialist: "Chef Laura Méndez", duration: 1800, bunnyUrl: "https://iframe.mediadelivery.net/embed/665122/demo-s3", status: "PUBLISHED" as const, order: 0 },
    { title: "Manejo del estrés y dolor crónico", description: "Técnicas de mindfulness específicas para pacientes con enfermedades reumáticas.", category: "BIENESTAR" as const, week: 4, specialist: "Psic. Roberto Flores", duration: 1350, bunnyUrl: "https://iframe.mediadelivery.net/embed/665122/demo-s4", status: "PUBLISHED" as const, order: 0 },
    { title: "Entendiendo el Lupus: lo que debes saber", description: "El Dr. Mora explica qué es el Lupus, cómo afecta el cuerpo y qué esperar en el seguimiento médico.", category: "EDUCACION" as const, week: 5, specialist: "Dr. Luis Mora", duration: 1680, bunnyUrl: "https://iframe.mediadelivery.net/embed/665122/demo-s5", status: "PUBLISHED" as const, order: 0 },
    { title: "Celebrando tu progreso: semana final", description: "Un repaso de todo lo aprendido y herramientas para mantener los hábitos adquiridos.", category: "BIENESTAR" as const, week: 6, specialist: "Dra. Carmen Vega", duration: 1260, bunnyUrl: "https://iframe.mediadelivery.net/embed/665122/demo-s6", status: "PUBLISHED" as const, order: 0 },
  ]

  const videos = await Promise.all(videosSeed.map((data) => prisma.video.create({ data })))

  const adminHash = await bcrypt.hash("Admin123!", 10)
  const patientHash = await bcrypt.hash("Demo123", 10)

  await prisma.user.create({
    data: {
      email: "admin@filar6.com",
      name: "Administrador FILAR",
      password: adminHash,
      role: "ADMIN",
      onboardingDone: true,
    },
  })

  const paciente = await prisma.user.create({
    data: {
      email: "demo@filar6.com",
      name: "María González",
      password: patientHash,
      role: "PATIENT",
      diagnosis: "FIBROMIALGIA",
      activeWeek: 2,
      fontSize: "LARGE",
      subtitles: true,
      onboardingDone: true,
      subscription: {
        create: {
          stripeCustomerId: "cus_demo_001",
          stripeSubId: "sub_demo_001",
          type: "MONTHLY",
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  })

  const videosWeek1 = videos.filter((v) => v.week <= 1)
  await Promise.all(
    videosWeek1.map((v) =>
      prisma.videoProgress.create({
        data: { userId: paciente.id, videoId: v.id, secondsWatched: v.duration, completed: true },
      })
    )
  )

  const videoWeek2First = videos.find((v) => v.week === 2)
  if (videoWeek2First) {
    await prisma.videoProgress.create({
      data: { userId: paciente.id, videoId: videoWeek2First.id, secondsWatched: 680, completed: false },
    })
  }

  const today = new Date()
  await Promise.all(
    [0, 1, 2, 5, 7, 9, 12].map((daysAgo) => {
      const date = new Date(today)
      date.setDate(today.getDate() - daysAgo)
      return prisma.wellnessLog.create({
        data: {
          userId: paciente.id,
          date,
          painLevel: 3 + (daysAgo % 5),
          energy: 7 - (daysAgo % 4),
          notes: daysAgo === 0 ? "Hoy me sentí con más energía" : null,
        },
      })
    })
  )

  await Promise.all([
    prisma.userBadge.create({ data: { userId: paciente.id, badgeId: b1.id } }),
    prisma.userBadge.create({ data: { userId: paciente.id, badgeId: b2.id } }),
  ])

  console.log("✅ Seed completado")
  console.log("   admin@filar6.com   / Admin123!")
  console.log("   demo@filar6.com    / Demo123")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
