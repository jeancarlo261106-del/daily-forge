"use client";

import { useActionState, useEffect } from "react";
import { loginAction, googleLoginAction } from "@/actions/auth";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #0A84FF, transparent)" }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #30D158, transparent)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            🔥
          </motion.div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            DailyForge
          </h1>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Forje sua disciplina, uma refeição por vez.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Google Login */}
          <form action={googleLoginAction}>
            <button type="submit" className="btn-google">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Entrar com Google
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="divider flex-1" />
            <span
              className="text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              ou
            </span>
            <div className="divider flex-1" />
          </div>

          {/* Credentials Form */}
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2 font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="input-glass"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-2 font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                minLength={6}
                className="input-glass"
              />
            </div>

            {state?.error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-center py-2 px-3 rounded-lg"
                style={{
                  color: "var(--accent-red)",
                  background: "rgba(255, 69, 58, 0.1)",
                }}
              >
                {state.error}
              </motion.p>
            )}

            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Register link */}
          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Não tem conta?{" "}
            <Link
              href="/register"
              className="font-medium hover:underline"
              style={{ color: "var(--accent-blue)" }}
            >
              Criar conta
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
