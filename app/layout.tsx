import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "FILAR‑6 | Programa de Bienestar",
  description: "Plataforma de bienestar para pacientes con enfermedades reumáticas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "white", border: "1px solid #F0EDE8", borderRadius: "12px" },
          }}
        />
      </body>
    </html>
  )
}
