"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { evaluateBadges } from "@/lib/badges"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const WellnessSchema = z.object({
  painLevel: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10),
  notes: z.string().max(500).optional(),
})

export type WellnessState = { error?: string; success?: boolean } | null

export async function saveWellnessLog(
  _prevState: WellnessState,
  formData: FormData
): Promise<WellnessState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autenticado" }

  const parsed = WellnessSchema.safeParse({
    painLevel: Number(formData.get("painLevel")),
    energy: Number(formData.get("energy")),
    notes: formData.get("notes") || undefined,
  })

  if (!parsed.success) return { error: "Datos inválidos" }

  await prisma.wellnessLog.create({
    data: {
      userId: session.user.id,
      painLevel: parsed.data.painLevel,
      energy: parsed.data.energy,
      notes: parsed.data.notes,
    },
  })

  await evaluateBadges(session.user.id)
  revalidatePath("/seguimiento")
  revalidatePath("/dashboard")

  return { success: true }
}
