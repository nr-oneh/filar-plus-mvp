import { create } from "zustand"

type BadgeNotification = {
  key: string
  name: string
  emoji: string
}

type AccessibilityStore = {
  fontSize: "NORMAL" | "LARGE" | "XLARGE"
  subtitles: boolean
  pendingBadge: BadgeNotification | null
  setFontSize: (size: "NORMAL" | "LARGE" | "XLARGE") => void
  setSubtitles: (value: boolean) => void
  showBadge: (badge: BadgeNotification) => void
  clearBadge: () => void
}

export const useAccessibility = create<AccessibilityStore>((set) => ({
  fontSize: "LARGE",
  subtitles: true,
  pendingBadge: null,
  setFontSize: (fontSize) => set({ fontSize }),
  setSubtitles: (subtitles) => set({ subtitles }),
  showBadge: (pendingBadge) => set({ pendingBadge }),
  clearBadge: () => set({ pendingBadge: null }),
}))
