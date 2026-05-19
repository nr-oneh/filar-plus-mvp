import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { LayoutDashboard, Users, PlayCircle, CreditCard, Leaf } from "lucide-react"

const adminNav = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Métricas" },
  { href: "/admin/usuarios", icon: Users, label: "Usuarios" },
  { href: "/admin/contenido", icon: PlayCircle, label: "Contenido" },
  { href: "/admin/pagos", icon: CreditCard, label: "Pagos" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard")

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 bg-navy flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center shrink-0">
              <Leaf size={13} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>FILAR‑6</p>
              <p className="text-white/50 text-xs">Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm">
              <Icon size={18} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white text-xs transition-colors">
            ← Volver a la plataforma
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-cream">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
