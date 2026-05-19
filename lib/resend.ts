import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM ?? "FILAR-6 <hola@filar6.com>"

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "¡Bienvenida a FILAR-6! Tu programa empieza hoy",
    html: `<p>Hola ${user.name},</p>
<p>Tu acceso a FILAR-6 está listo. Inicia sesión en <a href="${process.env.NEXTAUTH_URL}/login">filar6.com</a> para comenzar tu programa de 6 semanas.</p>
<p>El equipo FILAR-6</p>`,
  })
}

export async function sendWeekUnlockedEmail(
  user: { name: string; email: string },
  week: number
) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `¡Semana ${week} desbloqueada! Nuevo contenido disponible`,
    html: `<p>Hola ${user.name},</p>
<p>¡Felicidades! Completaste la semana ${week - 1} y tu nueva semana está lista. Entra a tu programa para ver el nuevo contenido.</p>
<p>El equipo FILAR-6</p>`,
  })
}

export async function sendPaymentFailedEmail(user: {
  name: string
  email: string
}) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "Problema con tu pago — FILAR-6",
    html: `<p>Hola ${user.name},</p>
<p>Tuvimos un problema al procesar tu pago. Tienes 3 días para actualizar tu método de pago antes de que tu acceso se pause.</p>
<p>El equipo FILAR-6</p>`,
  })
}

export async function sendInactivityReminderEmail(user: {
  name: string
  email: string
}) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "Te echamos de menos, ${user.name} — FILAR-6",
    html: `<p>Hola ${user.name},</p>
<p>Llevamos 3 días sin verte por aquí. Tu programa sigue esperándote cuando quieras retomarlo.</p>
<p>El equipo FILAR-6</p>`,
  })
}

export async function sendCertificateEmail(user: {
  name: string
  email: string
}) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "¡Felicidades! Completaste FILAR-6 🦋",
    html: `<p>Hola ${user.name},</p>
<p>¡Lo lograste! Completaste las 6 semanas del programa FILAR-6. Estamos muy orgullosos de tu constancia y dedicación.</p>
<p>El equipo FILAR-6</p>`,
  })
}
