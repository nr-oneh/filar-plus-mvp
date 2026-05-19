"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const OnboardingSchema = z.object({
  name: z.string().min(2).max(100),
  diagnosis: z.enum(["FIBROMIALGIA", "LUPUS", "ARTRITIS", "OTRO"]),
  fontSize: z.enum(["NORMAL", "LARGE", "XLARGE"]).default("LARGE"),
})

export async function completeOnboarding(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const parsed = OnboardingSchema.safeParse({
    name: formData.get("name"),
    diagnosis: formData.get("diagnosis"),
    fontSize: formData.get("fontSize") ?? "LARGE",
  })

  if (!parsed.success) return

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      diagnosis: parsed.data.diagnosis,
      fontSize: parsed.data.fontSize,
      onboardingDone: true,
    },
  })

  redirect("/dashboard")
}

export async function updateAccessibility(
  fontSize: "NORMAL" | "LARGE" | "XLARGE",
  subtitles: boolean
) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.user.update({
    where: { id: session.user.id },
    data: { fontSize, subtitles },
  })

  revalidatePath("/perfil")
}
