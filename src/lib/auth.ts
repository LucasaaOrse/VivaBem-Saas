import NextAuth, { User } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma  from "./prisma"
import { Adapter } from "next-auth/adapters"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./zod"
import { getUserFromDb } from "./get-user"
import { comparePassword, hashPassword } from "@/utils/password"
import { ZodError } from "zod" 
import { Awaitable } from "@auth/core/types"



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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
    // Faz um "cast" para informar que token tem essas propriedades
    const typedToken = token as { id: string; name: string; email: string };

    session.user.id = typedToken.id;
    session.user.name = typedToken.name;
    session.user.email = typedToken.email;
  }
  return session;
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