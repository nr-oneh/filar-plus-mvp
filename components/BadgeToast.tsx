"use client"

import { useEffect } from "react"
import { useAccessibility } from "@/store/accessibility"
import { toast } from "sonner"

export function BadgeToast() {
  const { pendingBadge, clearBadge } = useAccessibility()

  useEffect(() => {
    if (!pendingBadge) return
    toast(
      <div className="flex items-center gap-3">
        <span className="text-3xl">{pendingBadge.emoji}</span>
        <div>
          <p className="font-semibold text-navy">¡Nuevo logro desbloqueado!</p>
          <p className="text-gray text-sm">{pendingBadge.name}</p>
        </div>
      </div>,
      { duration: 5000 }
    )
    clearBadge()
  }, [pendingBadge, clearBadge])

  return null
}
