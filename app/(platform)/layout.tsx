import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/Sidebar"
import { BadgeToast } from "@/components/BadgeToast"

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  if (!session.user.onboardingDone) redirect("/onboarding")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, diagnosis: true, activeWeek: true, subscription: true },
  })

  if (!user) redirect("/login")

  const sub = user.subscription
  const now = new Date()
  const hasAccess =
    sub?.status === "ACTIVE" ||
    (sub?.status === "PAST_DUE" && sub.gracePeriodEnd && sub.gracePeriodEnd > now)

  if (!hasAccess) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        user={{
          name: user.name,
          diagnosis: user.diagnosis,
          activeWeek: user.activeWeek,
        }}
      />
      <main className="flex-1 overflow-y-auto bg-cream">
        <div className="max-w-4xl mx-auto px-8 py-8">{children}</div>
      </main>
      <BadgeToast />
    </div>
  )
}
