"use server"

import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"

export type LoginState = { error: string } | null

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Correo o contraseña incorrectos. Intenta de nuevo." }
      }
      return { error: "Error al iniciar sesión. Intenta más tarde." }
    }
    throw error
  }
  return null
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}
