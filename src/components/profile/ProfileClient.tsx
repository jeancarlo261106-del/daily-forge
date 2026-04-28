"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { updateProfile } from "@/actions/profile";
import { logoutAction } from "@/actions/auth";
import {
  DIET_GOAL_LABELS,
  DIET_GOAL_ICONS,
  ACTIVITY_LEVEL_LABELS,
  ACTIVITY_LEVEL_ICONS,
  type DietGoal,
  type ActivityLevel,
} from "@/lib/protein";

interface ProfileClientProps {
  profile: {
    weight: number;
    height: number;
    age: number;
    sex: string | null;
    activityLevel: string;
    dietGoal: string;
    proteinTarget: number;
  };
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export default function ProfileClient({ profile, user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [weight, setWeight] = useState(profile.weight);
  const [height, setHeight] = useState(profile.height);
  const [age, setAge] = useState(profile.age);
  const [sex, setSex] = useState(profile.sex);
  const [activityLevel, setActivityLevel] = useState(
    profile.activityLevel as ActivityLevel
  );
  const [dietGoal, setDietGoal] = useState(profile.dietGoal as DietGoal);
  const [target, setTarget] = useState(profile.proteinTarget);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateProfile({
        weight,
        height,
        age,
        sex,
        activityLevel,
        dietGoal,
      });
      setTarget(result.proteinTarget);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Perfil
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Gerencie seus dados e meta de proteína
        </p>
      </motion.div>

      {/* User Info */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background: "rgba(10, 132, 255, 0.2)",
              color: "var(--accent-blue)",
            }}
          >
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p
              className="font-semibold text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              {user.name ?? "Usuário"}
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {user.email}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Protein Target */}
      <motion.div variants={itemVariants} className="glass-card p-6 text-center">
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Meta diária de proteína
        </p>
        <motion.p
          key={target}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold mt-2"
          style={{ color: "var(--accent-green)" }}
        >
          {target}g
        </motion.p>
        <p
          className="text-xs mt-2"
          style={{ color: "var(--text-tertiary)" }}
        >
          {DIET_GOAL_ICONS[dietGoal]} {DIET_GOAL_LABELS[dietGoal]} ·{" "}
          {ACTIVITY_LEVEL_ICONS[activityLevel]}{" "}
          {ACTIVITY_LEVEL_LABELS[activityLevel]}
        </p>
      </motion.div>

      {/* Success Banner */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl text-center text-sm font-medium"
          style={{
            background: "rgba(48, 209, 88, 0.1)",
            color: "var(--accent-green)",
            border: "1px solid rgba(48, 209, 88, 0.3)",
          }}
        >
          ✅ Perfil atualizado! Meta recalculada.
        </motion.div>
      )}

      {/* Body Data */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
            Dados Corporais
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm px-3 py-1 rounded-lg"
            style={{
              background: isEditing
                ? "rgba(255, 69, 58, 0.1)"
                : "rgba(10, 132, 255, 0.1)",
              color: isEditing ? "var(--accent-red)" : "var(--accent-blue)",
            }}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="input-glass text-sm"
                />
              </div>
              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="input-glass text-sm"
                />
              </div>
              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Idade
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="input-glass text-sm"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Atividade
              </label>
              <div className="flex gap-2">
                {(
                  Object.keys(ACTIVITY_LEVEL_LABELS) as ActivityLevel[]
                ).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setActivityLevel(level)}
                    className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background:
                        activityLevel === level
                          ? "rgba(10, 132, 255, 0.15)"
                          : "var(--bg-input)",
                      border: `1px solid ${activityLevel === level ? "var(--accent-blue)" : "var(--glass-border)"}`,
                      color: "var(--text-primary)",
                    }}
                  >
                    {ACTIVITY_LEVEL_ICONS[level]}{" "}
                    {ACTIVITY_LEVEL_LABELS[level]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="block text-xs mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Objetivo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(DIET_GOAL_LABELS) as DietGoal[]).map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setDietGoal(goal)}
                    className="py-2 px-3 rounded-xl text-xs font-medium transition-all text-left"
                    style={{
                      background:
                        dietGoal === goal
                          ? "rgba(10, 132, 255, 0.15)"
                          : "var(--bg-input)",
                      border: `1px solid ${dietGoal === goal ? "var(--accent-blue)" : "var(--glass-border)"}`,
                      color: "var(--text-primary)",
                    }}
                  >
                    {DIET_GOAL_ICONS[goal]} {DIET_GOAL_LABELS[goal]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="btn-primary"
            >
              {isPending ? "Salvando..." : "Salvar e Recalcular Meta"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <DataCard label="Peso" value={`${weight}kg`} />
            <DataCard label="Altura" value={`${height}cm`} />
            <DataCard label="Idade" value={`${age} anos`} />
          </div>
        )}
      </motion.div>

      {/* Logout */}
      <motion.div variants={itemVariants}>
        <form action={logoutAction}>
          <button type="submit" className="btn-secondary w-full">
            Sair da conta
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DataCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="p-3 rounded-xl"
      style={{ background: "var(--bg-input)" }}
    >
      <p
        className="text-lg font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>
      <p
        className="text-xs mt-0.5"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </p>
    </div>
  );
}
