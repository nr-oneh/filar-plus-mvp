import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "PATIENT" | "SPECIALIST" | "ADMIN"
      activeWeek: number
      onboardingDone: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "PATIENT" | "SPECIALIST" | "ADMIN"
    activeWeek: number
    onboardingDone: boolean
  }
}
