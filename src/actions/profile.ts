"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateProteinTarget } from "@/lib/protein";
import type { DietGoal, ActivityLevel } from "@/lib/protein";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true },
  });

  return { profile, user };
}

export async function updateProfile(data: {
  weight: number;
  height: number;
  age: number;
  sex: string | null;
  activityLevel: string;
  dietGoal: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  const proteinTarget = calculateProteinTarget(
    data.weight,
    data.dietGoal as DietGoal,
    data.activityLevel as ActivityLevel
  );

  await prisma.userProfile.update({
    where: { userId: session.user.id },
    data: {
      weight: data.weight,
      height: data.height,
      age: data.age,
      sex: data.sex,
      activityLevel: data.activityLevel,
      dietGoal: data.dietGoal,
      proteinTarget,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return { proteinTarget };
}
