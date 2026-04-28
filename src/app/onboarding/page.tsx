"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveOnboarding } from "@/actions/onboarding";
import {
  calculateProteinTarget,
  DIET_GOAL_LABELS,
  DIET_GOAL_DESCRIPTIONS,
  DIET_GOAL_ICONS,
  ACTIVITY_LEVEL_LABELS,
  ACTIVITY_LEVEL_DESCRIPTIONS,
  ACTIVITY_LEVEL_ICONS,
  type DietGoal,
  type ActivityLevel,
} from "@/lib/protein";

const STEPS = ["Dados Pessoais", "Atividade Física", "Objetivo"];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [age, setAge] = useState<number>(25);
  const [sex, setSex] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    null
  );
  const [dietGoal, setDietGoal] = useState<DietGoal | null>(null);

  const canProceed = () => {
    if (step === 0) return weight > 0 && height > 0 && age > 0;
    if (step === 1) return activityLevel !== null;
    if (step === 2) return dietGoal !== null;
    return false;
  };

  const nextStep = () => {
    if (step < 2) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    if (!activityLevel || !dietGoal) return;
    startTransition(async () => {
      await saveOnboarding({
        weight,
        height,
        age,
        sex,
        activityLevel,
        dietGoal,
      });
    });
  };

  const calculatedTarget =
    activityLevel && dietGoal
      ? calculateProteinTarget(weight, dietGoal, activityLevel)
      : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full opacity-10 blur-[150px]"
        style={{ background: "radial-gradient(circle, #30D158, transparent)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Stepper */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                  style={{
                    background:
                      i <= step
                        ? "var(--accent-blue)"
                        : "var(--bg-card)",
                    color: i <= step ? "white" : "var(--text-tertiary)",
                    border: `1px solid ${i <= step ? "transparent" : "var(--glass-border)"}`,
                  }}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className="text-xs mt-1.5 hidden sm:block"
                  style={{
                    color:
                      i <= step
                        ? "var(--text-primary)"
                        : "var(--text-tertiary)",
                  }}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-12 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i < step
                        ? "var(--accent-blue)"
                        : "var(--glass-border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content Card */}
        <div className="glass-card p-8 min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1"
            >
              {/* Step 1: Personal Data */}
              {step === 0 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Seus Dados
                    </h2>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Precisamos de algumas informações para calcular sua meta.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm mb-1.5 font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Peso (kg)
                      </label>
                      <input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="input-glass"
                        min={20}
                        max={300}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="height"
                        className="block text-sm mb-1.5 font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Altura (cm)
                      </label>
                      <input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="input-glass"
                        min={100}
                        max={250}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm mb-1.5 font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Idade
                      </label>
                      <input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="input-glass"
                        min={12}
                        max={120}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm mb-1.5 font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Sexo (opcional)
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: "male", label: "♂" },
                          { value: "female", label: "♀" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setSex(sex === opt.value ? null : opt.value)
                            }
                            className="flex-1 py-2.5 rounded-xl text-xl transition-all"
                            style={{
                              background:
                                sex === opt.value
                                  ? "var(--accent-blue)"
                                  : "var(--bg-input)",
                              border: `1px solid ${sex === opt.value ? "transparent" : "var(--glass-border)"}`,
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Activity Level */}
              {step === 1 && (
                <div>
                  <div className="text-center mb-6">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Nível de Atividade
                    </h2>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Qual seu nível de exercício físico?
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(
                      Object.keys(ACTIVITY_LEVEL_LABELS) as ActivityLevel[]
                    ).map((level) => (
                      <motion.button
                        key={level}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActivityLevel(level)}
                        className="w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4"
                        style={{
                          background:
                            activityLevel === level
                              ? "rgba(10, 132, 255, 0.15)"
                              : "var(--bg-input)",
                          border: `1px solid ${activityLevel === level ? "var(--accent-blue)" : "var(--glass-border)"}`,
                        }}
                      >
                        <span className="text-3xl">
                          {ACTIVITY_LEVEL_ICONS[level]}
                        </span>
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {ACTIVITY_LEVEL_LABELS[level]}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {ACTIVITY_LEVEL_DESCRIPTIONS[level]}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Diet Goal */}
              {step === 2 && (
                <div>
                  <div className="text-center mb-6">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Seu Objetivo
                    </h2>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      O que você busca com sua dieta?
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {(Object.keys(DIET_GOAL_LABELS) as DietGoal[]).map(
                      (goal) => (
                        <motion.button
                          key={goal}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setDietGoal(goal)}
                          className="w-full p-3.5 rounded-2xl text-left transition-all flex items-center gap-3.5"
                          style={{
                            background:
                              dietGoal === goal
                                ? "rgba(10, 132, 255, 0.15)"
                                : "var(--bg-input)",
                            border: `1px solid ${dietGoal === goal ? "var(--accent-blue)" : "var(--glass-border)"}`,
                          }}
                        >
                          <span className="text-2xl">
                            {DIET_GOAL_ICONS[goal]}
                          </span>
                          <div>
                            <p
                              className="font-semibold text-sm"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {DIET_GOAL_LABELS[goal]}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {DIET_GOAL_DESCRIPTIONS[goal]}
                            </p>
                          </div>
                        </motion.button>
                      )
                    )}
                  </div>

                  {/* Target Preview */}
                  {calculatedTarget && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 p-4 rounded-2xl text-center"
                      style={{
                        background: "rgba(48, 209, 88, 0.1)",
                        border: "1px solid rgba(48, 209, 88, 0.3)",
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Sua meta diária será
                      </p>
                      <p
                        className="text-3xl font-bold mt-1"
                        style={{ color: "var(--accent-green)" }}
                      >
                        {calculatedTarget}g
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        de proteína por dia
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary flex-1"
              >
                Voltar
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn-primary flex-1"
              >
                Próximo
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isPending}
                className="btn-primary flex-1"
              >
                {isPending ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Começar 🚀"
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
