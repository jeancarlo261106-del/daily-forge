export type DietGoal =
  | "hypertrophy"
  | "weight_loss"
  | "maintenance"
  | "performance"
  | "high_performance";

export type ActivityLevel = "sedentary" | "moderate" | "active";

const PROTEIN_MULTIPLIERS: Record<DietGoal, { min: number; max: number }> = {
  hypertrophy: { min: 1.6, max: 2.2 },
  weight_loss: { min: 1.8, max: 2.5 },
  maintenance: { min: 1.2, max: 1.6 },
  performance: { min: 1.6, max: 2.0 },
  high_performance: { min: 2.0, max: 2.4 },
};

const ACTIVITY_WEIGHTS: Record<ActivityLevel, number> = {
  sedentary: 0.0,
  moderate: 0.5,
  active: 1.0,
};

/**
 * Calcula a meta diária de proteína em gramas.
 * O nível de atividade ajusta o multiplicador dentro da faixa do objetivo:
 * - Sedentário → usa o multiplicador mínimo
 * - Moderado → usa o ponto médio
 * - Ativo → usa o multiplicador máximo
 */
export function calculateProteinTarget(
  weight: number,
  goal: DietGoal,
  activity: ActivityLevel
): number {
  const { min, max } = PROTEIN_MULTIPLIERS[goal];
  const activityWeight = ACTIVITY_WEIGHTS[activity];
  const multiplier = min + (max - min) * activityWeight;
  return Math.round(weight * multiplier);
}

export const DIET_GOAL_LABELS: Record<DietGoal, string> = {
  hypertrophy: "Hipertrofia",
  weight_loss: "Perda de Peso",
  maintenance: "Manutenção",
  performance: "Performance",
  high_performance: "Alta Performance",
};

export const DIET_GOAL_DESCRIPTIONS: Record<DietGoal, string> = {
  hypertrophy: "Ganho de massa muscular",
  weight_loss: "Redução de gordura preservando massa magra",
  maintenance: "Manter composição corporal atual",
  performance: "Força e explosão muscular",
  high_performance: "Atletas de alta demanda",
};

export const DIET_GOAL_ICONS: Record<DietGoal, string> = {
  hypertrophy: "💪",
  weight_loss: "🔥",
  maintenance: "⚖️",
  performance: "⚡",
  high_performance: "🏆",
};

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentário",
  moderate: "Moderado",
  active: "Ativo",
};

export const ACTIVITY_LEVEL_DESCRIPTIONS: Record<ActivityLevel, string> = {
  sedentary: "Pouca ou nenhuma atividade física",
  moderate: "Exercício 3-5x por semana",
  active: "Exercício intenso 6-7x por semana",
};

export const ACTIVITY_LEVEL_ICONS: Record<ActivityLevel, string> = {
  sedentary: "🚶",
  moderate: "🏃",
  active: "🏋️",
};

/** Sugestões rápidas de alimentos com proteína */
export const QUICK_FOODS = [
  { name: "Peito de frango (100g)", protein: 31 },
  { name: "Ovos (3 unidades)", protein: 18 },
  { name: "Whey Protein (1 scoop)", protein: 25 },
  { name: "Iogurte grego (170g)", protein: 15 },
  { name: "Atum (1 lata)", protein: 26 },
  { name: "Carne bovina (100g)", protein: 26 },
  { name: "Queijo cottage (100g)", protein: 11 },
  { name: "Leite (250ml)", protein: 8 },
  { name: "Feijão (100g cozido)", protein: 9 },
  { name: "Tofu (100g)", protein: 8 },
  { name: "Salmão (100g)", protein: 20 },
  { name: "Amendoim (30g)", protein: 7 },
];
