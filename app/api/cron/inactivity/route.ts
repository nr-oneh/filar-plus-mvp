import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendInactivityReminderEmail } from "@/lib/resend"

export async function GET() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  const inactiveUsers = await prisma.user.findMany({
    where: {
      role: "PATIENT",
      subscription: { status: { in: ["ACTIVE", "PAST_DUE"] } },
      wellnessLogs: { none: { date: { gte: threeDaysAgo } } },
    },
  })

  for (const user of inactiveUsers) {
    await sendInactivityReminderEmail({ name: user.name, email: user.email })
  }

  return NextResponse.json({ processed: inactiveUsers.length })
}
