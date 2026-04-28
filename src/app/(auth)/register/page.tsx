"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, {});

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #BF5AF2, transparent)" }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #0A84FF, transparent)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
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
            Criar Conta
          </h1>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Comece a controlar sua proteína hoje.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm mb-2 font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Seu nome"
                minLength={2}
                className="input-glass"
              />
            </div>

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
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
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
                "Criar conta"
              )}
            </button>
          </form>

          {/* Login link */}
          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-medium hover:underline"
              style={{ color: "var(--accent-blue)" }}
            >
              Fazer login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
