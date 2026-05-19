import { prisma } from "@/lib/prisma"

export const metadata = { title: "Admin — Pagos" }

export default async function AdminPagosPage() {
  const subs = await prisma.subscription.findMany({
    include: { user: { select: { name: true, email: true, diagnosis: true } } },
    orderBy: { createdAt: "desc" },
  })

  const STATUS_COLOR: Record<string, string> = {
    ACTIVE: "bg-teal/10 text-teal-dark",
    PAST_DUE: "bg-gold/20 text-navy",
    CANCELLED: "bg-gray-light text-gray",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
        Pagos y suscripciones
      </h1>

      <div className="bg-white rounded-2xl border border-gray-light shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-light/50 border-b border-gray-light">
            <tr>
              {["Paciente", "Tipo", "Estado", "Renovación", "Customer ID"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-light/50">
            {subs.map((sub) => (
              <tr key={sub.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-navy text-sm font-medium">{sub.user.name}</p>
                  <p className="text-gray text-xs">{sub.user.email}</p>
                </td>
                <td className="px-4 py-3 text-gray text-sm">{sub.type === "MONTHLY" ? "Mensual" : "Único"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[sub.status] ?? "bg-gray-light text-gray"}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray text-sm">
                  {sub.currentPeriodEnd
                    ? new Date(sub.currentPeriodEnd).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-gray text-xs font-mono">{sub.stripeCustomerId}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && (
          <p className="text-center py-8 text-gray">Sin suscripciones.</p>
        )}
      </div>
    </div>
  )
}
