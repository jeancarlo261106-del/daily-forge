"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateProteinTarget } from "@/lib/protein";
import type { DietGoal, ActivityLevel } from "@/lib/protein";
import { z } from "zod";
import { redirect } from "next/navigation";

const onboardingSchema = z.object({
  weight: z.number().min(20).max(300),
  height: z.number().min(100).max(250),
  age: z.number().min(12).max(120),
  sex: z.string().nullable(),
  activityLevel: z.enum(["sedentary", "moderate", "active"]),
  dietGoal: z.enum([
    "hypertrophy",
    "weight_loss",
    "maintenance",
    "performance",
    "high_performance",
  ]),
});

export async function saveOnboarding(data: {
  weight: number;
  height: number;
  age: number;
  sex: string | null;
  activityLevel: string;
  dietGoal: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const parsed = onboardingSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Dados inválidos: " + parsed.error.issues[0].message);
  }

  const { weight, height, age, sex, activityLevel, dietGoal } = parsed.data;

  const proteinTarget = calculateProteinTarget(
    weight,
    dietGoal as DietGoal,
    activityLevel as ActivityLevel
  );

  // Upsert profile
  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      weight,
      height,
      age,
      sex,
      activityLevel,
      dietGoal,
      proteinTarget,
    },
    update: {
      weight,
      height,
      age,
      sex,
      activityLevel,
      dietGoal,
      proteinTarget,
    },
  });

  // Mark onboarding as completed
  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingCompleted: true },
  });

  redirect("/dashboard");
}
