import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

/**
 * Auth.js edge-compatible configuration.
 * This file does NOT import Prisma directly so it can be used in middleware.
 */

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Actual user lookup happens in auth.ts via the adapter
        // This is a placeholder — the real logic is in auth.ts callbacks
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage =
        nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
      const isOnboarding = nextUrl.pathname === "/onboarding";
      const isAppRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/history") ||
        nextUrl.pathname.startsWith("/log");

      // Allow access to auth pages when not logged in
      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protect app routes
      if (isAppRoute || isOnboarding) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
