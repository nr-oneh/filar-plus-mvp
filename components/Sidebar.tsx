"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PlayCircle,
  Heart,
  User,
  LogOut,
  Leaf,
} from "lucide-react"
import { logout } from "@/actions/auth"
import { cn } from "@/lib/utils"

interface SidebarProps {
  user: {
    name: string
    diagnosis: string | null
    activeWeek: number
  }
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/programa", icon: PlayCircle, label: "Mi programa" },
  { href: "/seguimiento", icon: Heart, label: "Seguimiento" },
  { href: "/perfil", icon: User, label: "Mi perfil" },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <aside className="w-64 bg-white border-r border-gray-light flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-gray-light">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center shrink-0">
            <Leaf size={15} className="text-white" />
          </div>
          <div>
            <h1
              className="text-xl text-navy leading-none"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              FILAR‑6
            </h1>
            <p className="text-xs text-gray mt-0.5">Programa de Bienestar</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-150",
                active
                  ? "bg-teal text-white shadow-sm shadow-teal/30"
                  : "text-navy hover:bg-gray-light"
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-light">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center text-teal font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-navy font-medium text-sm truncate">{user.name}</p>
            <p className="text-gray text-xs truncate">
              {user.diagnosis} · Semana {user.activeWeek}
            </p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray hover:bg-gray-light hover:text-navy transition-colors text-base"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
