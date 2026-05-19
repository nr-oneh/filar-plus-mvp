import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail, sendPaymentFailedEmail } from "@/lib/resend"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret || !sig) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string | null
      const email = session.customer_details?.email as string
      const name = session.customer_details?.name as string ?? "Paciente"

      if (!email) break

      const tempPassword = crypto.randomBytes(8).toString("hex")
      const hashedPassword = await bcrypt.hash(tempPassword, 10)

      const user = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          name,
          password: hashedPassword,
          role: "PATIENT",
          subscription: {
            create: {
              stripeCustomerId: customerId,
              stripeSubId: subscriptionId,
              type: session.mode === "subscription" ? "MONTHLY" : "ONE_TIME",
              status: "ACTIVE",
              currentPeriodEnd: subscriptionId
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                : null,
            },
          },
        },
        update: {
          subscription: {
            upsert: {
              create: {
                stripeCustomerId: customerId,
                stripeSubId: subscriptionId,
                type: session.mode === "subscription" ? "MONTHLY" : "ONE_TIME",
                status: "ACTIVE",
              },
              update: { status: "ACTIVE" },
            },
          },
        },
      })

      await sendWelcomeEmail({ name: user.name, email: user.email })
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as any
      const customerId = invoice.customer as string

      const sub = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId },
        include: { user: true },
      })
      if (!sub) break

      const gracePeriodEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: "PAST_DUE", gracePeriodEnd },
      })

      await sendPaymentFailedEmail({ name: sub.user.name, email: sub.user.email })
      break
    }

    case "invoice.paid": {
      const invoice = event.data.object as any
      const customerId = invoice.customer as string

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId, status: "PAST_DUE" },
        data: {
          status: "ACTIVE",
          gracePeriodEnd: null,
          currentPeriodEnd: new Date(
            (invoice.lines?.data?.[0]?.period?.end ?? 0) * 1000
          ),
        },
      })
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as any
      await prisma.subscription.updateMany({
        where: { stripeSubId: sub.id },
        data: { status: "CANCELLED" },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
