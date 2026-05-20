import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email: String(credentials.email) },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              activeWeek: true,
              onboardingDone: true,
            },
          })
          if (!user) return null

          const valid = await bcrypt.compare(String(credentials.password), user.password)
          if (!valid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            activeWeek: user.activeWeek,
            onboardingDone: user.onboardingDone,
          }
        } catch (err) {
          console.error("[authorize error]", err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.activeWeek = (user as any).activeWeek
        token.onboardingDone = (user as any).onboardingDone
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as any
        session.user.activeWeek = token.activeWeek as number
        session.user.onboardingDone = token.onboardingDone as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
