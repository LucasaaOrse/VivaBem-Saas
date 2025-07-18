import NextAuth, { User } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma  from "./prisma"
import { Adapter } from "next-auth/adapters"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./zod"
import { getUserFromDb } from "./get-user"
import { ZodError } from "zod" 




export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [GitHub({
    clientId: process.env.AUTH_GITHUB_ID!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!
  }), Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!
  }),
  Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = signInSchema.parse(credentials);
          const user = await getUserFromDb(parsed.email, parsed.password);
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.flatten().fieldErrors);
          } else {
            console.error("Authorize error:", error);
          }
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
  // Primeiro login: user e account existem
  if (user && account) {
    // Se for login via Google ou GitHub, buscar manualmente o user no banco
    if (account.provider === "google" || account.provider === "github") {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! }
      })

      if (dbUser) {
        token.id = dbUser.id
        token.name = dbUser.name
        token.email = dbUser.email
        token.createdAt = dbUser.createdAt.toISOString()
      }
    }

    // Se for login via credentials (já está com os dados certos)
    if (account.provider === "credentials") {
      token.id = user.id
      token.name = user.name
      token.email = user.email
      token.createdAt = user.createdAt as string
    }
  }

  return token
},
    async session({ session, token }) {
  if (session.user) {
    const typedToken = token as {
      id: string
      name: string
      email: string
      createdAt?: string
    }

    session.user.id = typedToken.id
    session.user.name = typedToken.name
    session.user.email = typedToken.email

    if (typedToken.createdAt) {
      session.user.createdAt = typedToken.createdAt
    }
  }

  return session
},
    async signIn({ user, account }) {
      // Bloquear se for login com credenciais e email não confirmado
      if (account?.provider === "credentials") {
        if (!user.emailVerified) {
          throw new Error("Email não verificado. Verifique sua caixa de entrada.")
        }
      }

      // Permitir login via Google SEM bloqueio de verificação
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});