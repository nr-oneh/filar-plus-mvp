import { prisma } from "@/lib/prisma"

export const metadata = { title: "Admin — Usuarios" }

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = "", page = "1" } = await searchParams
  const skip = (Number(page) - 1) * 20

  const where = q
    ? { OR: [{ email: { contains: q, mode: "insensitive" as const } }, { name: { contains: q, mode: "insensitive" as const } }], role: "PATIENT" as const }
    : { role: "PATIENT" as const }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { subscription: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      skip,
    }),
    prisma.user.count({ where }),
  ])

  const DIAG: Record<string, string> = { FIBROMIALGIA: "Fibromialgia", LUPUS: "Lupus", ARTRITIS: "Artritis", OTRO: "Otro" }
  const STATUS_COLOR: Record<string, string> = { ACTIVE: "bg-teal/10 text-teal-dark", PAST_DUE: "bg-gold/20 text-navy", CANCELLED: "bg-gray-light text-gray" }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-navy" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Usuarios
        </h1>
        <span className="text-gray text-sm">{total} pacientes</span>
      </div>

      <form className="flex gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o correo..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-light bg-white focus:outline-none focus:border-teal text-navy"
        />
        <button type="submit" className="px-5 py-3 bg-teal text-white rounded-xl hover:bg-teal-dark transition-colors">
          Buscar
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-light shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-light/50 border-b border-gray-light">
            <tr>
              {["Nombre", "Correo", "Diagnóstico", "Semana", "Estado"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-light/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-4 py-3 text-navy font-medium text-sm">{user.name}</td>
                <td className="px-4 py-3 text-gray text-sm">{user.email}</td>
                <td className="px-4 py-3 text-gray text-sm">{user.diagnosis ? DIAG[user.diagnosis] : "—"}</td>
                <td className="px-4 py-3 text-navy text-sm font-medium">{user.activeWeek}/6</td>
                <td className="px-4 py-3">
                  {user.subscription ? (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[user.subscription.status] ?? "bg-gray-light text-gray"}`}>
                      {user.subscription.status}
                    </span>
                  ) : (
                    <span className="text-xs text-gray">Sin suscripción</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center py-8 text-gray">No se encontraron usuarios.</p>
        )}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / 20) }).map((_, i) => (
            <a key={i} href={`?q=${q}&page=${i + 1}`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${Number(page) === i + 1 ? "bg-teal text-white" : "bg-white border border-gray-light text-navy hover:border-teal"}`}>
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
